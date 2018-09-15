pub mod instruction_printer;
pub mod reference_extractor;
/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

#[cfg(test)]
mod tests;

extern crate pest;
#[macro_use]
extern crate pest_derive;
extern crate clap;
extern crate goblin;
#[macro_use]
extern crate simple_error;

use pest::iterators::Pair;
use pest::Parser;

use std::collections::HashMap;

const _GRAMMAR: &'static str = include_str!("mips.pest");

#[derive(Parser)]
#[grammar = "mips.pest"]
struct Mips;

#[derive(Debug)]
enum Operation {
    Add,
    Addu,
    Sub,
    Subu,
    And,
    Or,
    Nor,
    Xor,
    Sll,
    Srl,
    Sra,
    Jr,
    /* --------------------- Immediate Operations -------------------------- */
    Addi,
    Addiu,
    Andi,
    Ori,
    Xori,
    Lbu,
    Lhu,
    Lw,
    Lui,
    Sb,
    Sh,
    Sw,
    Beq,
    /* -------------------------- Jump Operations -------------------------- */
    J,
    Jal,

    /* ------------------------ Non-existent Operations -------------------- */
    /* TODO: @peterdelong: The below instructions are not in MIPS page. We   */
    /* should probably remove them from implementation details               */

    // Li
    // Blt <== apparently you can check equliaty first, subtract 1, and then recheck
}

// Instruction contains all the information that a given instruction could possibly need when it is
// being compiled
#[derive(Debug)]
enum Instruction {
    R {
        op: Operation,
        rs: Register,
        rt: Register,
        rd: Register,
        shamt: u8,
    },

    I {
        op: Operation,
        rs: Register,
        rt: Register,
        imm: Immediate,
    },

    J {
        op: Operation,
        target: JumpTarget,
    },

    Nop,
}



// Register represents a single register in the system
#[derive(Debug)]
enum Register {
    Zero = 0x0,
    At,
    V0,
    V1,
    A0,
    A1,
    A2,
    A3,
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    S0,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    T8,
    T9,
    K0,
    K1,
    Gp,
    Sp,
    Fp,
    Ra,
}

#[derive(Debug)]
enum Immediate {
    Value(u16),
    Label(String),
}

#[derive(Debug)]
enum JumpTarget {
    Value(u32),
    Label(String),
}

// Any label that refers to it
#[derive(Debug)]
struct VirtualRepresentation {
    labels: HashMap<String, u32>,
    instructions: Vec<Instruction>,
}

// The main entry point. Pass in a string containing assembly code and return an array
// containing the complete program image
#[wasm_bindgen]
pub fn compile_string(program: &str) -> Option<Vec<u8>> {
    let vr = match parse_program(program) {
        Some(vr) => vr,
        None => {
            println!("Failed to parse program");
            return None;
        }
    };

    let resolved = match resolve_labels(vr) {
        Some(resolved) => resolved,
        None => {
            println!("Failed to resolve labels");
            return None
        }
    };

    let compiled = match compile_vr(resolved) {
        Some(machine_code) => machine_code,
        None => {
            println!("Failed to compile program");
            return None;
        }
    };

    Some(compiled)
}

fn resolve_labels(vr: VirtualRepresentation) -> Option<Vec<Instruction>> {
    let mut instructions = Vec::new();

    for (index, instruction) in vr.instructions.into_iter().enumerate() {
        let resolved_instruction = match instruction {
            Instruction::I {op, rs, rt, imm} => {
                let address = match op {
                    Operation::Beq => Some(index as u32 * 4),
                    _ => None,
                };

                let imm = resolve_imm_label(imm, &vr.labels, address);
                Instruction::I {
                    op,
                    rs,
                    rt,
                    imm
                }
            },
            Instruction::J {op, target} => {
                let target = resolve_target_label(target, &vr.labels);
                Instruction::J {
                    op,
                    target
                }
            },
            _ => instruction,
        };

        instructions.push(resolved_instruction);
    }

    Some(instructions)
}

// Attempt to parse `program` into a `VirtualRepresentation` object.
// All further compilation operations will occur directly on this
// VirtualRepresentation object, since it will contain all possible information
// about the program
//
// Takes ownership of and consumes `program` in the process
fn parse_program(program: &str) -> Option<VirtualRepresentation> {
    let mut vr = VirtualRepresentation {
        labels: HashMap::new(),
        instructions: Vec::new(),
    };

    // FIXME This is disgusting
    let program_hack = format!("{}\n", &program);
    let mut pairs = match Mips::parse(Rule::program, &program_hack) {
        Ok(pairs) => pairs,
        // TODO
        Err(err) => {
            println!("{:?}", err);
            return None;
        }
    };

    let program_pair = pairs.next().unwrap();

    let mut next_instruction_index = 0;

    for line in program_pair.into_inner() {
        println!("{:?}", line.as_str());
        match line.as_rule() {
            Rule::instruction => match handle_instruction(line.into_inner().next().unwrap(), next_instruction_index * 4) {
                Some(instruction) => {
                    next_instruction_index += 1;
                    vr.instructions.push(instruction)
                }
                None => println!("Couldn't parse instruction"),
            },
            Rule::label => {
                let label_name_str = line.as_str();
                let label_name = label_name_str[..label_name_str.len()-1].to_string();
                vr.labels.insert(label_name, next_instruction_index * 4);
            }
            _ => println!("Found a thing: {:?}", line),
        }
    }

    println!("{:?}", vr);

    Some(vr)
}

// TODO: If we want to implement pseudo instructions, we'll want to return a vector
fn handle_instruction(instruction: Pair<'_, Rule>, current_address: u32) -> Option<Instruction> {
    return match instruction.as_rule() {
        Rule::r_instruction => {
            let mut pairs = instruction.into_inner();

            let name = pairs.next().unwrap().as_str();
            let (rd_str, rs_str, rt_str) = if name == "jr" {
                let rs_str = pairs.next().unwrap().as_str();
                ("", rs_str, "")
            } else {
                let rd_str = pairs.next().unwrap().as_str();
                let rs_str = pairs.next().unwrap().as_str();
                let rt_str = pairs.next().unwrap().as_str();

                (rd_str, rs_str, rt_str)
            };

            // Shamt always 0 since shifts are handled below
            handle_r_instruction(name, rd_str, rs_str, rt_str, "0")
        }

        Rule::i_instruction => {
            let mut pairs = instruction.into_inner();

            let name = pairs.next().unwrap().as_str();
            let rt_str = pairs.next().unwrap().as_str();
            let rs_str = pairs.next().unwrap().as_str();
            let imm_str = pairs.next().unwrap().as_str();

            // These look like I format instructions but are really R format
            if name == "srl" || name == "sra" || name == "sll" {
                handle_r_instruction(
                    name, /*rd_str=*/ rt_str, /*rs_str=*/ "$zero", /*rt_str=*/ rs_str,
                    /*shamt_str=*/ imm_str,
                )
            } else {
                handle_i_instruction(name, rt_str, rs_str, imm_str, current_address)
            }
        }

        Rule::j_instruction => {
            let mut pairs = instruction.into_inner();

            let name = pairs.next().unwrap().as_str();
            let target = pairs.next().unwrap().as_str();

            handle_j_instruction(name, target)
        }

        Rule::mem_instruction => {
            let mut pairs = instruction.into_inner();

            let name = pairs.next().unwrap().as_str();
            let rt_str = pairs.next().unwrap().as_str();
            let imm_str = pairs.next().unwrap().as_str();
            let rs_str = pairs.next().unwrap().as_str();

            handle_i_instruction(name, rt_str, rs_str, imm_str, current_address)
        }

        Rule::lui => {
            let mut pairs = instruction.into_inner();

            let rt_str = pairs.next().unwrap().as_str();
            let imm_str = pairs.next().unwrap().as_str();

            handle_i_instruction("lui", rt_str, "$zero", imm_str, current_address)
        }

        Rule::data => {
            let mut pairs = instruction.into_inner();

            let type_str = pairs.next().unwrap().as_str();
            let data_str = pairs.next().unwrap().as_str();

            None
        }

        Rule::nop => Some(Instruction::Nop),

        _ => unreachable!(),
    };
}

fn lookup_register(register: &str) -> Option<Register> {
    let reg = match register.to_lowercase().as_ref() {
        "$zero" | "" => Register::Zero,
        "$at" => Register::At,
        "$v0" => Register::V0,
        "$v1" => Register::V1,
        "$a0" => Register::A0,
        "$a1" => Register::A1,
        "$a2" => Register::A2,
        "$a3" => Register::A3,
        "$t0" => Register::T0,
        "$t1" => Register::T1,
        "$t2" => Register::T2,
        "$t3" => Register::T3,
        "$t4" => Register::T4,
        "$t5" => Register::T5,
        "$t6" => Register::T6,
        "$t7" => Register::T7,
        "$t8" => Register::T8,
        "$t9" => Register::T9,
        "$s0" => Register::S0,
        "$s1" => Register::S1,
        "$s2" => Register::S2,
        "$s3" => Register::S3,
        "$s4" => Register::S4,
        "$s5" => Register::S5,
        "$s6" => Register::S6,
        "$s7" => Register::S7,
        "$k0" => Register::K0,
        "$k1" => Register::K1,
        "$gp" => Register::Gp,
        "$sp" => Register::Sp,
        "$fp" => Register::Fp,
        "$ra" => Register::Ra,
        _ => {
            println!("unable to parse register: {}", register);
            return None;
        }
    };

    Some(reg)
}

fn handle_r_instruction(
    operation: &str,
    rd_str: &str,
    rs_str: &str,
    rt_str: &str,
    shamt_str: &str,
) -> Option<Instruction> {
    let rd = match lookup_register(rd_str) {
        Some(reg) => reg,
        None => return None,
    };

    let rs = match lookup_register(rs_str) {
        Some(reg) => reg,
        None => return None,
    };

    let rt = match lookup_register(rt_str) {
        Some(reg) => reg,
        None => return None,
    };

    let (radix, shamt_str) = if shamt_str.to_lowercase().starts_with("0x") {
        (16, &shamt_str[2..])
    } else {
        (10, shamt_str)
    };

    let shamt = match u8::from_str_radix(shamt_str, radix) {
        Ok(val) => val,
        Err(_) => return None,
    };

    construct_r_instruction(operation, rs, rt, rd, shamt)
}

fn construct_r_instruction(
    operation: &str,
    rs: Register,
    rt: Register,
    rd: Register,
    shamt: u8,
) -> Option<Instruction> {
    let op = match operation {
        "add" => Operation::Add,
        "addu" => Operation::Addu,
        "sub" => Operation::Sub,
        "subu" => Operation::Subu,
        "and" => Operation::And,
        "or" => Operation::Or,
        "nor" => Operation::Nor,
        "xor" => Operation::Xor,
        "sll" => Operation::Sll,
        "srl" => Operation::Srl,
        "sra" => Operation::Sra,
        "jr" => Operation::Jr,
        _ => return None,
    };

    let instruction = Instruction::R {
        op,
        rs,
        rt,
        rd,
        shamt,
    };

    Some(instruction)
}

fn handle_i_instruction(
    operation: &str,
    rt_str: &str,
    rs_str: &str,
    imm_str: &str,
    current_address: u32
) -> Option<Instruction> {
    let rs = match lookup_register(rs_str) {
        Some(reg) => reg,
        None => return None,
    };

    let rt = match lookup_register(rt_str) {
        Some(reg) => reg,
        None => return None,
    };

    construct_i_instruction(operation, rs, rt, imm_str, current_address)
}

fn construct_i_instruction(
    operation: &str,
    rs: Register,
    rt: Register,
    imm_str: &str,
    current_address: u32,
) -> Option<Instruction> {
    let op = match operation {
        "addi" => Operation::Addi,
        "addiu" => Operation::Addiu,
        "andi" => Operation::Andi,
        "ori" => Operation::Ori,
        "xori" => Operation::Xori,
        "lbu" => Operation::Lbu,
        "lhu" => Operation::Lhu,
        "lw" => Operation::Lw,
        "lui" => Operation::Lui,
        "sb" => Operation::Sb,
        "sh" => Operation::Sh,
        "sw" => Operation::Sw,
        "beq" => Operation::Beq,
        _ => return None,
    };

    let (radix, imm_str) = if imm_str.to_lowercase().starts_with("0x") {
        (16, &imm_str[2..])
    } else {
        (10, imm_str)
    };

    let imm = match u32::from_str_radix(imm_str, radix) {
        Ok(val) => { 
            if let Operation::Beq = op {
                let offset = (val - current_address) >> 2;
                // TODO: Return this as an error
                assert!(offset < 65536);
                Immediate::Value(offset as u16)
            } else {
                // TODO: Return this as an error
                assert!(val < 65536);
                Immediate::Value(val as u16)
            }
        },
        Err(_) => {
            let label_name = imm_str.to_string();
            Immediate::Label(label_name)
        }
    };

    // For some reason these are swapped for branch instructions
    let (rs, rt) = if let Operation::Beq = op { (rt, rs) } else { (rs, rt) };


    let instruction = Instruction::I {
        op,
        rs,
        rt,
        imm
    };

    Some(instruction)
}

fn handle_j_instruction(operation: &str, target_str: &str) -> Option<Instruction> {
    let (radix, target_str) = if target_str.to_lowercase().starts_with("0x") {
        (16, &target_str[2..])
    } else {
        (10, target_str)
    };

    let target = match u32::from_str_radix(target_str, radix) {
        Ok(val) => JumpTarget::Value(val >> 2),
        Err(_) => JumpTarget::Label(target_str.to_string())
    };

    let op = match operation {
        "j" => Operation::J,
        "jal" => Operation::Jal,
        _ => return None,
    };

    let instruction = Instruction::J {
        op,
        target
    };

    Some(instruction)
}

// Take `vr` containing the complete program state and return the corresponding machine code
// representing the compiled program
// Returns None if labels can't be resolved
// TODO(peterdelong): don't take a VirtualRepresentation, instad take something that requires that
// all labels have been resolved so we don't have to worry about that checking here. We can then
// separate out the label resoulution into a different function which will make maintenance easier.
fn compile_vr(instructions: Vec<Instruction>) -> Option<Vec<u8>> {
    let mut program: Vec<u8> = Vec::new();
    // TODO(peterdelong): Might be better as a map
    // all material was pulled from: http://www2.engr.arizona.edu/~ece369/Resources/spim/MIPSReference.pdf
    for instruction in instructions {
        let machine_code = match instruction {
            Instruction::R {op, rs, rt, rd, shamt} => compile_r_format(op, rs, rt, rd, shamt),
            Instruction::I {op, rs, rt, imm} => compile_i_format(op, rs, rt, imm),
            Instruction::J {op, target} => compile_j_format(op, target),
            Instruction::Nop => 0,
        };

        program.extend_from_slice(&transform_u32_to_array_of_u8(machine_code));
    }

    Some(program)
}

fn resolve_target_label(target: JumpTarget, labels: &HashMap<String, u32>) -> JumpTarget {
    match target {
        JumpTarget::Value(_) => target,
        JumpTarget::Label(label) => {
            match labels.get(&label) {
                Some(&value) => {
                    assert!(value < 67108864);
                    JumpTarget::Value(value << 2)
                },
                // TODO: Return as an error
                None => panic!("Label doesn't have resolution")
            }
        }
    }
}

fn resolve_imm_label(imm: Immediate, labels: &HashMap<String, u32>, current_address: Option<u32>) -> Immediate {
    match imm {
        Immediate::Value(_) => imm,
        Immediate::Label(label) => {
            match labels.get(&label) {
                Some(&value) => {
                    let mut value = value;
                    if let Some(address) = current_address {
                        value = (value - address) >> 2;
                    }
                    assert!(value < 65536);
                    Immediate::Value(value as u16)
                },
                // TODO: Return as an error
                None => panic!("Label doesn't have resolution")
            }
        }
    }
}

fn transform_u32_to_array_of_u8(x: u32) -> [u8; 4] {
    let b1: u8 = ((x >> 24) & 0xff) as u8;
    let b2: u8 = ((x >> 16) & 0xff) as u8;
    let b3: u8 = ((x >> 8) & 0xff) as u8;
    let b4: u8 = (x & 0xff) as u8;
    return [b1, b2, b3, b4];
}

fn compile_r_format(
    op: Operation,
    rs: Register,
    rt: Register,
    rd: Register,
    shamt: u8,
) -> u32 {
    let rs_val = rs as u8;
    let rt_val = rt as u8;
    let rd_val = rd as u8;

    let funct = match op {
        Operation::Add => 0x20,
        Operation::Addu => 0x21,
        Operation::Sub => 0x22,
        Operation::Subu => 0x23,
        Operation::And => 0x24,
        Operation::Or => 0x25,
        Operation::Nor => 0x27,
        Operation::Xor => 0x26,
        Operation::Sll => 0x0,
        Operation::Srl => 0x2,
        Operation::Sra => 0x3,
        Operation::Jr => 0x8,
        _ => unreachable!(),
    };

    // Make sure arguments use the appropriate number of bits
    assert!(rs_val < 32);
    assert!(rt_val < 32);
    assert!(rd_val < 32);
    assert!(shamt < 32);
    assert!(funct < 64);

    let mut instruction: u32 = 0;

    // R format: 000000ss sssttttt dddddaaa aaffffff
    instruction |= (0x0 as u32) << 26; // 6 bits opcode
    instruction |= (rs_val as u32) << 21;
    instruction |= (rt_val as u32) << 16;
    instruction |= (rd_val as u32) << 11;
    instruction |= (shamt as u32) << 6;
    instruction |= funct as u32;

    instruction
}

fn compile_i_format(op: Operation, rs: Register, rt: Register, imm: Immediate) -> u32 {
    let rs_val = rs as u8;
    let rt_val = rt as u8;
    let imm_val = match imm {
        Immediate::Value(val) => val,
        Immediate::Label(_) => panic!("Label still present at codegen time"),
    };

    let opcode = match op {
        Operation::Addi => 0x8,
        Operation::Addiu => 0x9,
        Operation::Andi => 0xc,
        Operation::Ori => 0xd,
        Operation::Xori => 0xe,
        Operation::Lbu => 0x24,
        Operation::Lhu => 0x25,
        Operation::Lw => 0x23,
        Operation::Lui => 0xf,
        Operation::Sb => 0x28,
        Operation::Sh => 0x29,
        Operation::Sw => 0x2b,
        Operation::Beq => 0x4,
        _ => unreachable!(),
    };

    // Make sure arguments use the appropriate number of bits
    assert!(opcode < 64);
    assert!(rs_val < 32);
    assert!(rt_val < 32);
    // imm_val forced to be 16 bits by Rust

    let mut instruction: u32 = 0;

    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    instruction |= (opcode as u32) << 26;
    instruction |= (rs_val as u32) << 21;
    instruction |= (rt_val as u32) << 16;
    instruction |= imm_val as u32;

    instruction
}

fn compile_j_format(op: Operation, target: JumpTarget) -> u32 {
    let target = match target {
        JumpTarget::Value(val) => val,
        JumpTarget::Label(_) => panic!("Label somehow made it into final codegen step"),
    };

    let opcode = match op {
        Operation::J => 0x2,
        Operation::Jal => 0x3,
        _ => unreachable!()
    };

    assert!(opcode < 64);
    assert!(target < 0x10000000);
    assert!(target % 4 == 0);

    let mut instruction: u32 = 0;

    instruction |= (opcode as u32) << 26;
    // Already shifted earlier
    instruction |= target;

    instruction
}
