use ::compile_string;
use ::reference_extractor;

use std::process::{Command,Stdio};
use reference_extractor::{Segment};
use tempfile::NamedTempFile;
use std::fs::File;
use std::io::{Read, Write};


fn reference_compile_string(program: &str) -> Segment {
    let output_file = NamedTempFile::new().unwrap();

    let mut compiler = Command::new("mipsel-linux-gnu-as")
        .args(&["-EB", "-o", output_file.path().to_str().unwrap()])
        .stdin(Stdio::piped())
        .spawn()
        .ok().expect("Failed to start compiler");

    compiler.stdin.as_mut().unwrap().write_all(program.as_bytes());
    compiler.wait();

    let mut compiler_output = vec![];
    output_file.into_file().read_to_end(&mut compiler_output);

    reference_extractor::get_text(compiler_output).unwrap().unwrap()
}

fn pad_test_output(mut binary: Vec<u8>, alignment: u64) -> Vec<u8> {
    let modulo = binary.len() % (alignment as usize);
    let extra_bytes = if modulo == 0 { 0 } else { (alignment as usize) - modulo };
    for _ in 0..extra_bytes {
        binary.push(0);
    }


    binary
}

fn compile_test_and_reference(program: &str) -> (Vec<u8>, Vec<u8>) {
    let test_text = compile_string(program).unwrap();
    let reference_text_segment = reference_compile_string(program);

    let test_text = pad_test_output(test_text, reference_text_segment.alignment);

    let reference_text = reference_text_segment.data;

    (test_text, reference_text)
}

#[test]
fn empty_program_test() {
    let (test_text, reference_text) = compile_test_and_reference("");
    assert_eq!(test_text, reference_text);
}

#[test]
fn add_test() {
    let (test_text, reference_text) = compile_test_and_reference("add $t2, $t0, $t1");
    assert_eq!(test_text, reference_text);
}
