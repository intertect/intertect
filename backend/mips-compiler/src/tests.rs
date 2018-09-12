extern crate tempfile;

use compile_string;
use reference_extractor;
use instruction_printer;

use reference_extractor::Segment;
use std::io::prelude::*;
use std::process::{Command, Stdio};
use self::tempfile::NamedTempFile;

fn reference_compile_string(program: &str) -> Segment {
    let output_file = NamedTempFile::new().unwrap();

    let mut compiler = Command::new("mipsel-linux-gnu-as")
        .args(&["-EB", "-o", output_file.path().to_str().unwrap()])
        .stdin(Stdio::piped())
        .spawn()
        .ok()
        .expect("Failed to start compiler");

    compiler
        .stdin
        .as_mut()
        .unwrap()
        .write_all(program.as_bytes());
    compiler.wait();

    let mut compiler_output = vec![];
    output_file.into_file().read_to_end(&mut compiler_output);

    reference_extractor::get_text(compiler_output)
        .unwrap()
        .unwrap()
}

fn pad_test_output(mut binary: Vec<u8>, alignment: u64) -> Vec<u8> {
    let modulo = binary.len() % (alignment as usize);
    let extra_bytes = if modulo == 0 {
        0
    } else {
        (alignment as usize) - modulo
    };
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

fn check_test_and_reference(test: &Vec<u8>, reference: &Vec<u8>) {
    if test != reference {
        println!("Test program:\n {}", instruction_printer::program_string(&test));
        println!("");
        println!("Reference program:\n {}", instruction_printer::program_string(&reference));

        // This will crash since we know they're not equal
        assert_eq!(test, reference);
    }
}

#[test]
fn empty_program_test() {
    let (test_text, reference_text) = compile_test_and_reference("");
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that each of the registers exists and is output correctly
fn register_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#" 
    add $zero, $zero, $zero
    add $at, $at, $at
    add $v0, $v0, $v0
    add $v1, $v1, $v1
    add $a0, $a0, $a0
    add $a1, $a1, $a1
    add $a2, $a2, $a2
    add $a3, $a3, $a3
    add $t0, $t0, $t0
    add $t1, $t1, $t1
    add $t2, $t2, $t2
    add $t3, $t3, $t3
    add $t4, $t4, $t4
    add $t5, $t5, $t5
    add $t6, $t6, $t6
    add $t7, $t7, $t7
    add $s0, $s0, $s0
    add $s1, $s1, $s1
    add $s2, $s2, $s2
    add $s3, $s3, $s3
    add $s4, $s4, $s4
    add $s5, $s5, $s5
    add $s6, $s6, $s6
    add $s7, $s7, $s7
    add $t8, $t8, $t8
    add $t9, $t9, $t9
    add $k0, $k0, $k0
    add $k1, $k1, $k1
    add $gp, $gp, $gp
    add $sp, $sp, $sp
    add $fp, $fp, $fp
    add $ra, $ra, $ra
        "#,
    );
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that hexidecimal literals are handled correctly
fn hex_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        addi $zero, $zero, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that decimal literals are handled correctly
fn decimal_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        addi $zero, $zero, 100
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the operands are output correctly for an R format instruction
fn add_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        add $t0, $t1, $t2
        add $t0, $t2, $t1
        add $t1, $t0, $t2
        add $t1, $t2, $t0
        add $t2, $t1, $t0
        add $t2, $t0, $t1
        "#);
    check_test_and_reference(&test_text, &reference_text);
}


#[test]
// Tests that the addu instruction is properly encoded
fn addu_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        addu $t0, $t1, $t2
        addu $t0, $t2, $t1
        addu $t1, $t0, $t2
        addu $t1, $t2, $t0
        addu $t2, $t1, $t0
        addu $t2, $t0, $t1
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the sub instruction is properly encoded
fn sub_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        sub $t0, $t1, $t2
        sub $t0, $t2, $t1
        sub $t1, $t0, $t2
        sub $t1, $t2, $t0
        sub $t2, $t1, $t0
        sub $t2, $t0, $t1
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the subu instruction is properly encoded
fn subu_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        subu $t0, $t1, $t2
        subu $t0, $t2, $t1
        subu $t1, $t0, $t2
        subu $t1, $t2, $t0
        subu $t2, $t1, $t0
        subu $t2, $t0, $t1
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the and instruction is properly encoded
fn and_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        and $t0, $t1, $t2
        and $t0, $t2, $t1
        and $t1, $t0, $t2
        and $t1, $t2, $t0
        and $t2, $t1, $t0
        and $t2, $t0, $t1
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the or instruction is properly encoded
fn or_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        or $t0, $t1, $t2
        or $t0, $t2, $t1
        or $t1, $t0, $t2
        or $t1, $t2, $t0
        or $t2, $t1, $t0
        or $t2, $t0, $t1
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the nor instruction is properly encoded
fn nor_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        nor $t0, $t1, $t2
        nor $t0, $t2, $t1
        nor $t1, $t0, $t2
        nor $t1, $t2, $t0
        nor $t2, $t1, $t0
        nor $t2, $t0, $t1
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the xor instruction is properly encoded
fn xor_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        xor $t0, $t1, $t2
        xor $t0, $t2, $t1
        xor $t1, $t0, $t2
        xor $t1, $t2, $t0
        xor $t2, $t1, $t0
        xor $t2, $t0, $t1
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the sll instruction is properly encoded
fn sll_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        sll $t0, $t1, 1
        sll $t0, $t2, 1
        sll $t1, $t0, 1
        sll $t1, $t2, 1
        sll $t2, $t1, 1
        sll $t2, $t0, 1
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the srl instruction is properly encoded
fn srl_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        srl $t0, $t1, 1
        srl $t0, $t2, 1
        srl $t1, $t0, 1
        srl $t1, $t2, 1
        srl $t2, $t1, 1
        srl $t2, $t0, 1
        "#);
}

#[test]
// Tests that the sra instruction is properly encoded
fn sra_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        sra $t0, $t1, 1
        sra $t0, $t2, 1
        sra $t1, $t0, 1
        sra $t1, $t2, 1
        sra $t2, $t1, 1
        sra $t2, $t0, 1
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the jr instruction is properly encoded
fn jr_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        jr $t0
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the operands are output correctly for an I format instruction
fn addi_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        addi $t0, $t1, 0xFAFA
        addi $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}


#[test]
// Tests that the addiu instruction is properly encoded
fn addiu_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        addiu $t0, $t1, 0xFAFA
        addiu $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the andi instruction is properly encoded
fn andi_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        andi $t0, $t1, 0xFAFA
        andi $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the ori instruction is properly encoded
fn ori_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        ori $t0, $t1, 0xFAFA
        ori $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the xori instruction is properly encoded
fn xori_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        xori $t0, $t1, 0xFAFA
        xori $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

/*
#[test]
// Tests that the lbu instruction is properly encoded
fn lbu_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        lbu $t0, $t1, 0xFAFA
        lbu $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the lhu instruction is properly encoded
fn lhu_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        lhu $t0, $t1, 0xFAFA
        lhu $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the lw instruction is properly encoded
fn lw_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        lw $t0, $t1, 0xFAFA
        lw $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the lui instruction is properly encoded
fn lui_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        lui $t0, $t1, 0xFAFA
        lui $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the sb instruction is properly encoded
fn sb_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        sb $t0, $t1, 0xFAFA
        sb $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the sh instruction is properly encoded
fn sh_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        sh $t0, $t1, 0xFAFA
        sh $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the sw instruction is properly encoded
fn sw_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        sw $t0, $t1, 0xFAFA
        sw $t1, $t0, 0xFAFA
        "#);
    check_test_and_reference(&test_text, &reference_text);
}
*/

#[test]
// Tests that the beq instruction is properly encoded
fn beq_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        beq $t0, $t1, done
        nop
        beq $t1, $t0, done
        nop
        done: nop
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the j instruction is properly encoded when not using labels
fn j_nolabel_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        j 0xFAF0
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the jal instruction is properly encoded when not using labels
fn jal_nolabel_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        jal 0xFAF0
        "#);
    check_test_and_reference(&test_text, &reference_text);
}

#[test]
// Tests that the nop instruction is properly encoded
fn nop_test() {
    let (test_text, reference_text) = compile_test_and_reference(
        r#"
        nop
        "#);
    check_test_and_reference(&test_text, &reference_text);
}
