/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

extern crate mips;

extern crate clap;

use clap::{App, Arg};
use std::path::Path;
use std::fs::File;
use std::io::Read;

fn main() {
    let matches = App::new("Mips ELF extractor")
        .version("0.1")
        .about("Extracts text and data segments from an ELF binary")
        .arg(
            Arg::with_name("file")
            .value_name("FILE")
            .help("The name of the ELF file")
            .required(true)
            .index(1)
        ).get_matches();

    // Unwrap is ok here since the argument is required
    let filename = matches.value_of("file").unwrap();
    let path = Path::new(filename);
    let mut file = File::open(path).unwrap();
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).unwrap();

    let (text, data) = mips::reference_extractor::get_text_and_data(buffer).unwrap();
    println!("Text segment: {:?}", text);
    println!("Data segment: {:?}", data);
}
