extern crate goblin;
extern crate clap;
#[macro_use]
extern crate simple_error;

use clap::{App, Arg};
use goblin::Object;
use std::path::Path;
use std::fs::File;
use std::io::Read;
use std::error::Error;

#[derive(Debug)]
enum SegmentType {
    Text,
    Data,
}

#[derive(Debug)]
struct Segment {
    kind: SegmentType,
    alignment: u64,
    data: Vec<u8>,
}

fn get_text_and_data(program: Vec<u8>) -> Result<(Option<Segment>, Option<Segment>), Box<Error>> {
    let mut text_seg = None;
    let mut data_seg = None;

    let program_object = match Object::parse(&program).unwrap() {
        Object::Elf(elf) => elf,
        _ => bail!("Program was not in the ELF format")
    };

    let section_header_names = program_object.shdr_strtab;
    for section_header in program_object.section_headers {
        let name = section_header_names.get(section_header.sh_name).unwrap()?;
        if name == ".data" {
            let offset = section_header.sh_offset;
            let size = section_header.sh_size;
            let addralign = section_header.sh_addralign;

            let data = &program[(offset as usize)..((offset+size) as usize)];

            let segment = Segment {
                kind: SegmentType::Data,
                alignment: addralign,
                data: data.into(),
            };

            data_seg = Some(segment);
        } else if name == ".text" {
            let offset = section_header.sh_offset;
            let size = section_header.sh_size;
            let addralign = section_header.sh_addralign;

            let data = &program[(offset as usize)..((offset+size) as usize)];

            let segment = Segment {
                kind: SegmentType::Text,
                alignment: addralign,
                data: data.into(),
            };

            text_seg = Some(segment);
        }
    }

    Ok((text_seg, data_seg))
}

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

    let (text, data) = get_text_and_data(buffer).unwrap();
    println!("Text segment: {:?}", text);
    println!("Data segment: {:?}", data);
}
