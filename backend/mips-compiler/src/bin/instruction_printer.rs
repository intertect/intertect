/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/
extern crate clap;

use clap::{App, Arg};

use std::error::Error;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;
use std::iter::Map;

enum Format {
    R,
    I,
    J,
}

fn main() {
    let matches = App::new("Mips instruction printer")
        .version("0.1")
        .about("Formats binary instructions to show the components")
        .arg(
            Arg::with_name("r_format")
                .short("r")
                .long("r_format")
                .help("Assume the instruction is R format"),
        ).arg(
            Arg::with_name("i_format")
                .short("i")
                .long("i_format")
                .help("Assume the instruction is I format"),
        ).arg(
            Arg::with_name("j_format")
                .short("j")
                .long("j_format")
                .help("Assume the instruction is J format"),
        ).arg(
            Arg::with_name("single")
                .short("s")
                .long("single")
                .takes_value(true)
                .help("A single hexidecimal instruction"),
        ).arg(
            Arg::with_name("file")
                .short("f")
                .long("file")
                .takes_value(true)
                .help("print all instructions contained in FILE"),
        ).get_matches();

    if matches.is_present("single") {
        // We can use unwrap() here because the argument is required
        let hex_string = matches.value_of("single").unwrap().replace(" ", "");
        println!("{}", hex_string);
        let hex_num: u32 = match u32::from_str_radix(&hex_string, 16) {
            Ok(val) => val,
            Err(err) => {
                println!("Error converting argument to hex: {}", err);
                return;
            }
        };

        print_instruction(hex_num);
    } else if matches.is_present("file") {
        let path = Path::new(matches.value_of("file").unwrap());
        let display = path.display();

        let mut file = match File::open(&path) {
            Err(why) => panic!("couldn't open {}: {}", display, why.description()),
            Ok(file) => file,
        };

        let mut program = vec![];
        match file.read_to_end(&mut program) {
            Err(why) => panic!("couldn't read {}: {}", display, why.description()),
            Ok(_) => {}
        };

        let instructions: Vec<u32> = program
            .chunks(4)
            .map(|chunk| {
                let mut res: u32 = 0;

                res |= (chunk[0] as u32) << 24;
                res |= (chunk[1] as u32) << 16;
                res |= (chunk[2] as u32) << 8;
                res |= chunk[3] as u32;

                res
            }).collect();

        println!("{}", instructions.iter().map(|instruction| instruction_string(*instruction)).collect::<Vec<String>>().join("\n\n"))

    } else {
        println!("{}", matches.usage());
    }
}

fn instruction_string(hex_num: u32) -> String {
    let format = determine_format(hex_num);

    match format {
        Format::R => r_format_string(hex_num),
        Format::I => i_format_string(hex_num),
        Format::J => j_format_string(hex_num),
    }
}

fn print_instruction(hex_num: u32) {
    println!("{}", instruction_string(hex_num));
}

fn determine_format(instruction: u32) -> Format {
    let opcode = instruction >> 26;

    match opcode {
        0 => Format::R,
        2 | 3 => Format::J,
        _ => Format::I,
    }
}

fn u32_to_bit_array(num: u32) -> [bool; 32] {
    let mut result = [false; 32];

    for i in 0..32 {
        if (num >> i) & 0b1 == 1 {
            result[i] = true;
        }
    }

    result.reverse();
    result
}

fn bit_array_to_number(arr: &[bool]) -> u32 {
    let mut res = 0;

    for bit in arr {
        res <<= 1;
        res |= if *bit { 1 } else { 0 };
    }

    res
}

fn r_format_string(instruction: u32) -> String {
    let bits = u32_to_bit_array(instruction);

    let opcode = bit_array_to_number(&bits[0..6]);
    let rs = bit_array_to_number(&bits[6..11]);
    let rt = bit_array_to_number(&bits[11..16]);
    let rd = bit_array_to_number(&bits[16..21]);
    let shamt = bit_array_to_number(&bits[21..26]);
    let funct = bit_array_to_number(&bits[26..32]);

    let mut result = String::new();

    result.push_str(&format!(
        "+--------+-------------------------------------------------+\n"
    ));
    result.push_str(&format!(
        "|        | opcode | rs    | rt    | rd    | shamt | funct  |\n"
    ));
    result.push_str(&format!(
        "+--------+--------+-------+-------+-------+-------+--------+\n"
    ));
    result.push_str(&format!(
        "| binary | {:06b} | {:05b} | {:05b} | {:05b} | {:05b} | {:06b} |\n",
        opcode, rs, rt, rd, shamt, funct
    ));
    result.push_str(&format!(
        "+--------+--------+-------+-------+-------+-------+--------+\n"
    ));
    result.push_str(&format!(
        "|    hex | {:6X} | {:5X} | {:5X} | {:5X} | {:5X} | {:6X} |\n",
        opcode, rs, rt, rd, shamt, funct
    ));
    result.push_str(&format!(
        "+--------+--------+-------+-------+-------+-------+--------+"
    ));

    result
}

fn i_format_string(instruction: u32) -> String {
    let bits = u32_to_bit_array(instruction);

    let opcode = bit_array_to_number(&bits[0..6]);
    let rs = bit_array_to_number(&bits[6..11]);
    let rt = bit_array_to_number(&bits[11..16]);
    let imm = bit_array_to_number(&bits[16..32]);

    let mut result = String::new();

    result.push_str(&format!(
        "+--------+--------+-------+-------+------------------+\n"
    ));
    result.push_str(&format!(
        "|        | opcode | rs    | rt    | immediate        |\n"
    ));
    result.push_str(&format!(
        "+--------+--------+-------+-------+------------------+\n"
    ));
    result.push_str(&format!(
        "| binary | {:06b} | {:05b} | {:05b} | {:016b} |\n",
        opcode, rs, rt, imm
    ));
    result.push_str(&format!(
        "+--------+--------+-------+-------+------------------+\n"
    ));
    result.push_str(&format!(
        "|    hex | {:6X} | {:5X} | {:5X} | {:16X} |\n",
        opcode, rs, rt, imm
    ));
    result.push_str(&format!(
        "+--------+--------+-------+-------+------------------+"
    ));

    result
}

fn j_format_string(instruction: u32) -> String {
    let bits = u32_to_bit_array(instruction);

    let opcode = bit_array_to_number(&bits[0..6]);
    let addr = bit_array_to_number(&bits[6..32]);

    let mut result = String::new();

    result.push_str(&format!(
        "+--------+--------+------------------------------+\n"
    ));
    result.push_str(&format!(
        "|        | opcode | address                      |\n"
    ));
    result.push_str(&format!(
        "+--------+--------+------------------------------+\n"
    ));
    result.push_str(&format!("| binary | {:06b} | {:028b} |\n", opcode, addr));
    result.push_str(&format!(
        "+--------+--------+------------------------------+\n"
    ));
    result.push_str(&format!("|    hex | {:6X} | {:28X} |\n", opcode, addr));
    result.push_str(&format!(
        "+--------+--------+------------------------------+"
    ));

    result
}
