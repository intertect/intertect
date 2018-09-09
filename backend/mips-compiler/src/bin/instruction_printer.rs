/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

extern crate clap;

use clap::{App, Arg};

fn main() {
    let matches = App::new("Mips instruction printer")
        .version("0.1")
        .about("Formats a binary instruction to show the components")
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
            Arg::with_name("instruction")
                .value_name("INSTRUCTION")
                .help("Hexedecimal instruction")
                .required(true)
                .index(1),
        ).get_matches();

    // We can use unwrap() here because the argument is required
    let hex_string = matches.value_of("instruction").unwrap().replace(" ", "");
    println!("{}", hex_string);
    let hex_num: u32 = match u32::from_str_radix(&hex_string, 16) {
        Ok(val) => val,
        Err(err) => {
            println!("Error converting argument to hex: {}", err);
            return;
        }
    };

    if matches.is_present("r_format") {
        print_r_format(hex_num);
    } else if matches.is_present("i_format") {
        print_i_format(hex_num);
    } else if matches.is_present("j_format") {
        print_j_format(hex_num);
    }
}

fn u32_to_bit_array(num: u32) -> [bool;32] {
    let mut result = [false;32];

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

fn print_r_format(instruction: u32) {
    let bits = u32_to_bit_array(instruction);

    let opcode = bit_array_to_number(&bits[0..6]);
    let rs = bit_array_to_number(&bits[6..11]);
    let rt = bit_array_to_number(&bits[11..16]);
    let rd = bit_array_to_number(&bits[16..21]);
    let shamt = bit_array_to_number(&bits[21..26]);
    let funct = bit_array_to_number(&bits[26..32]);

    println!("+--------+-------------------------------------------------+");
    println!("|        | opcode | rs    | rt    | rd    | shamt | funct  |");
    println!("+--------+--------+-------+-------+-------+-------+--------+");
    println!("| binary | {:06b} | {:05b} | {:05b} | {:05b} | {:05b} | {:06b} |", opcode, rs, rt, rd, shamt, funct);
    println!("+--------+--------+-------+-------+-------+-------+--------+");
    println!("|    hex | {:6X} | {:5X} | {:5X} | {:5X} | {:5X} | {:6X} |", opcode, rs, rt, rd, shamt, funct);
    println!("+--------+--------+-------+-------+-------+-------+--------+");
}

fn print_i_format(instruction: u32) {
    let bits = u32_to_bit_array(instruction);

    let opcode = bit_array_to_number(&bits[0..6]);
    let rs = bit_array_to_number(&bits[6..11]);
    let rt = bit_array_to_number(&bits[11..16]);
    let imm = bit_array_to_number(&bits[16..32]);

    println!("+--------+--------+-------+-------+------------------+");
    println!("|        | opcode | rs    | rt    | immediate        |");
    println!("+--------+--------+-------+-------+------------------+");
    println!("| binary | {:06b} | {:05b} | {:05b} | {:016b} |", opcode, rs, rt, imm);
    println!("+--------+--------+-------+-------+------------------+");
    println!("|    hex | {:6X} | {:5X} | {:5X} | {:16X} |", opcode, rs, rt, imm);
    println!("+--------+--------+-------+-------+------------------+");
}

fn print_j_format(instruction: u32) {
    let bits = u32_to_bit_array(instruction);

    let opcode = bit_array_to_number(&bits[0..6]);
    let addr = bit_array_to_number(&bits[6..32]);

    println!("+--------+--------+------------------------------+");
    println!("|        | opcode | address                      |");
    println!("+--------+--------+------------------------------+");
    println!("| binary | {:06b} | {:028b} |", opcode, addr);
    println!("+--------+--------+------------------------------+");
    println!("|    hex | {:6X} | {:28X} |", opcode, addr);
    println!("+--------+--------+------------------------------+");
}
