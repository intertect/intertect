/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/
extern crate clap;
extern crate mips;

use clap::{App, Arg};

use std::error::Error;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;

use mips::instruction_printer::{program_string, instruction_string};

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

        println!("{}", instruction_string(hex_num));
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

        println!("{}", program_string(&program));

    } else {
        println!("{}", matches.usage());
    }
}

