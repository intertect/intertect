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

fn read_file(filename: String) -> String {
    let path = Path::new(&filename);
    let display = path.display();

    let mut file = match File::open(&path) {
        Err(why) => panic!("couldn't open {}: {}", display, why.description()),
        Ok(file) => file,
    };

    let mut s = String::new();
    match file.read_to_string(&mut s) {
        Err(why) => panic!("couldn't read {}: {}", display, why.description()),
        Ok(_) => return s,
    };
}

fn write_file(filename: String, contents: Vec<u8>) {
    let path = Path::new(&filename);
    let display = path.display();

    let mut file = match File::create(&path) {
        Err(why) => panic!("couldn't open {}: {}", display, why.description()),
        Ok(file) => file,
    };

    match file.write_all(&contents[..]) {
        Err(why) => panic!("couldn't write {}: {}", display, why.description()),
        Ok(_) => {}
    };
}

fn main() {
    let matches = App::new("Mips Compiler")
        .version("0.1")
        .about("Compile a MIPS program")
        .arg(
            Arg::with_name("output")
                .short("o")
                .long("output")
                .value_name("FILE")
                .help("Sets the output file (default: program)")
                .takes_value(true),
        ).arg(
            Arg::with_name("input")
                .value_name("INPUT")
                .help("The input file to use")
                .required(true)
                .index(1),
        ).get_matches();

    let output_filename = matches.value_of("output").unwrap_or("program").to_string();
    // input is a required parameter so this is safe
    let input_filename = matches.value_of("input").unwrap().to_string();
    let file_contents = read_file(input_filename);

    match mips::compile_string(&file_contents) {
        Some(compiled_output) => write_file(output_filename, compiled_output),
        None => {}
    };
}
