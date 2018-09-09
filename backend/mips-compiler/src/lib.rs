/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

#[cfg(test)]
mod tests;
pub mod reference_extractor;

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

// Instruction contains all the information that a given instruction could possibly need when it is
// being compiled
#[derive(Debug)]
enum Instruction {
    /* ------------------------ Register Operations ------------------------ */
    Add {
        rs: Register,
        rt: Register,
        rd: Register,
    },

    Addu {
        rs: Register,
        rt: Register,
        rd: Register,
    },

    Sub {
        rs: Register,
        rt: Register,
        rd: Register,
    },

    Subu {
        rs: Register,
        rt: Register,
        rd: Register,
    },

    And {
        rs: Register,
        rt: Register,
        rd: Register,
    },

    Or {
        rs: Register,
        rt: Register,
        rd: Register,
    },

    Nor {
        rs: Register,
        rt: Register,
        rd: Register,
    },

    Xor {
        rs: Register,
        rt: Register,
        rd: Register,
    },

    Sll {
      rt: Register,
      rd: Register,
      shamt: u8
    },

    Srl {
      rt: Register,
      rd: Register,
      shamt: u8
    },

    Sra {
      rt: Register,
      rd: Register,
      shamt: u8
    },

    /* --------------------- Immediate Operations -------------------------- */
    Addi {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },

    Addiu {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },

    Andi {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },

    Ori {
        rs: Register,
        rt: Register,
        imm: Immediate16
    },

    Xori {
        rs: Register,
        rt: Register,
        imm: Immediate16
    },

    Lbu {
        rs: Register,
        rt: Register,
        imm: Immediate16
    },

    Lhu {
        rs: Register,
        rt: Register,
        imm: Immediate16
    },

    Lw {
        rs: Register,
        rt: Register,
        imm: Immediate16
    },

    Lui {
        rt: Register,
        imm: Immediate16
    },

    Sb {
        rs: Register,
        rt: Register,
        imm: Immediate16
    },

    Sh {
        rs: Register,
        rt: Register,
        imm: Immediate16
    },

    Sw {
        rs: Register,
        rt: Register,
        imm: Immediate16
    },

    Beq {
        rs: Register,
        rt: Register,
        imm: Immediate16
    },

    /* -------------------------- Jump Operations -------------------------- */
    // TODO J {},
    // TODO Jal {},
    // TODO Jr {},

    /* -------------------------- Special Operations ----------------------- */
    Noop {}

    /* ------------------------ Non-existent Operations -------------------- */
    /* TODO: @peterdelong: The below instructions are not in MIPS page. We   */
    /* should probably remove them from implementation details               */

    // Li
    // Blt <== apparently you can check equliaty first, subtract 1, and then recheck
}

// Register represents a single register in the system
#[derive(Debug)]
enum Register {
    Zero,
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

#[derive(Hash, PartialEq, Eq, PartialOrd, Ord, Debug)]
struct Label {
    name: String,
}

#[derive(Debug)]
enum Immediate16 {
    Value(u16),
    Label(Label),
}

#[derive(Debug)]
enum Immediate30 {
    Value(u32),
    Label(Label),
}

// A virtual line of assembly. Contains labels to current line (if any exists) as well as the
// instruction itself
#[derive(Debug)]
struct Line {
    labels: Vec<Label>,
    instruction: Instruction,
}

// Any label that refers to it
#[derive(Debug)]
struct VirtualRepresentation {
    labels: HashMap<Label, u32>,
    instructions: Vec<Line>,
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
        Some(vr) => vr,
        None => {
            println!("Failed to resolve labels");
            return None;
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

fn resolve_labels(vr: VirtualRepresentation) -> Option<VirtualRepresentation> {
    return Some(vr);
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
            return None
        }
    };

    let program_pair = pairs.next().unwrap();

    for line in program_pair.into_inner() {
        println!("{:?}", line.as_str());
        match line.as_rule() {
            Rule::instruction => match handle_instruction(line.into_inner().next().unwrap()) {
                Some(instruction) => vr.instructions.push(instruction),
                None => println!("Couldn't parse instruction"),
            },
            _ => {}
        }
    }

    Some(vr)
}

fn handle_instruction(instruction: Pair<'_, Rule>) -> Option<Line> {
    return match instruction.as_rule() {
        Rule::r_instruction => {
            let mut pairs = instruction.into_inner();

            let name = pairs.next().unwrap().as_str();
            let rd_str = pairs.next().unwrap().as_str();
            let rs_str = pairs.next().unwrap().as_str();
            let rt_str = pairs.next().unwrap().as_str();

            handle_r_instruction(name, rd_str, rs_str, rt_str)
        }
        Rule::i_instruction => {
            let mut pairs = instruction.into_inner();

            let name = pairs.next().unwrap().as_str();
            let rt_str = pairs.next().unwrap().as_str();
            let rs_str = pairs.next().unwrap().as_str();
            let imm_str = pairs.next().unwrap().as_str();

            handle_i_instruction(name, rt_str, rs_str, imm_str)
        }
        _ => unreachable!(),
    };
}

fn lookup_register(register: &str) -> Option<Register> {
    let reg = match register.to_lowercase().as_ref() {
        "$zero" => Register::Zero,
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

fn handle_r_instruction(operation: &str, rd_str: &str, rs_str: &str, rt_str: &str) -> Option<Line> {
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

    let instruction = match construct_r_instruction(operation, rs, rt, rd, /*shamt=*/ 0) {
        Some(instruction) => instruction,
        None => return None,
    };

    let line = Line {
        labels: Vec::new(),
        instruction: instruction,
    };

    Some(line)
}

fn construct_r_instruction(
    operation: &str,
    rs: Register,
    rt: Register,
    rd: Register,
    _shamt: u8,
) -> Option<Instruction> {
    let instruction = match operation {
        "add" => Instruction::Add {
            rs: rs,
            rt: rt,
            rd: rd,
        },

        "addu" => Instruction::Addu {
            rs: rs,
            rt: rt,
            rd: rd,
        },

        "sub" => Instruction::Sub {
            rs: rs,
            rt: rt,
            rd: rd
        },

        "subu" => Instruction::Subu {
            rs: rs,
            rt: rt,
            rd: rd
        },

        "and" => Instruction::And {
            rs: rs,
            rt: rt,
            rd: rd
        },

        "or" => Instruction::Or {
            rs: rs,
            rt: rt,
            rd: rd
        },

        "nor" => Instruction::Nor {
            rs: rs,
            rt: rt,
            rd: rd
        },

        "xor" => Instruction::Xor {
            rs: rs,
            rt: rt,
            rd: rd
        },

        "sll" => Instruction::Sll {
          rt: rt,
          rd: rd,
          shamt: _shamt
        },

        "srl" => Instruction::Srl {
          rt: rt,
          rd: rd,
          shamt: _shamt
        },

        "sra" => Instruction::Sra {
          rt: rt,
          rd: rd,
          shamt: _shamt
        },

        _ => return None,
    };

    Some(instruction)
}

fn handle_i_instruction(operation: &str, rt_str: &str, rs_str: &str, imm_str: &str) -> Option<Line> {
    let rs = match lookup_register(rs_str) {
        Some(reg) => reg,
        None => return None,
    };

    let rt = match lookup_register(rt_str) {
        Some(reg) => reg,
        None => return None,
    };

    let imm = match imm_str.parse() {
        Ok(val) => Immediate16::Value(val),
        Err(_) => return None,
    };

    let instruction = match construct_i_instruction(operation, rs, rt, imm) {
        Some(instruction) => instruction,
        None => return None,
    };

    let line = Line {
        labels: Vec::new(),
        instruction: instruction,
    };

    Some(line)
}

fn construct_i_instruction(
    operation: &str,
    rs: Register,
    rt: Register,
    imm: Immediate16,
) -> Option<Instruction> {
    let instruction = match operation {
        "addi" => Instruction::Addi {
            rs: rs,
            rt: rt,
            imm: imm
        },

        "addiu" => Instruction::Addiu {
            rs: rs,
            rt: rt,
            imm: imm
        },

        "andi" => Instruction::Andi {
            rs: rs,
            rt: rt,
            imm: imm
        },

        "ori" => Instruction::Ori {
            rs: rs,
            rt: rt,
            imm: imm
        },

        "xori" => Instruction::Xori {
            rs: rs,
            rt: rt,
            imm: imm
        },

        "lbu" => Instruction::Lbu {
            rs: rs,
            rt: rt,
            imm: imm
        },

        "lhu" => Instruction::Lhu {
            rs: rs,
            rt: rt,
            imm: imm
        },

        "lw" => Instruction::Lw {
            rs: rs,
            rt: rt,
            imm: imm
        },

        "lui" => Instruction::Lui {
            rt: rt,
            imm: imm
        },

        "sb" => Instruction::Sb {
            rs: rs,
            rt: rt,
            imm: imm
        },

        "sh" => Instruction::Sh {
            rs: rs,
            rt: rt,
            imm: imm
        },

        "sw" => Instruction::Sw {
            rs: rs,
            rt: rt,
            imm: imm
        },

        "beq" => Instruction::Beq {
            rs: rs,
            rt: rt,
            imm: imm
        },

        _ => return None,
    };

    Some(instruction)
}

// Take `vr` containing the complete program state and return the corresponding machine code
// representing the compiled program
// Returns None if labels can't be resolved
// TODO(peterdelong): don't take a VirtualRepresentation, instad take something that requires that
// all labels have been resolved so we don't have to worry about that checking here. We can then
// separate out the label resoulution into a different function which will make maintenance easier.
fn compile_vr(vr: VirtualRepresentation) -> Option<Vec<u8>> {
    let mut program: Vec<u8> = Vec::new();

    // TODO(peterdelong): Might be better as a map
    // all material was pulled from: http://www2.engr.arizona.edu/~ece369/Resources/spim/MIPSReference.pdf
    for instruction in vr.instructions {
        let machine_code = match instruction.instruction {
            /* ------------------------ Register Operations ------------------------ */
            Instruction::Add   { rs, rt, rd } => {
                compile_r_format(Some(rs), rt, rd, 0x0, 0x20)
            },
            Instruction::Addu  { rs, rt, rd } => {
                compile_r_format(Some(rs), rt, rd, 0x0, 0x21)
            },
            Instruction::Sub   { rs, rt, rd } => {
                compile_r_format(Some(rs), rt, rd, 0x0, 0x22)
            },
            Instruction::Subu  { rs, rt, rd } => {
                compile_r_format(Some(rs), rt, rd, 0x0, 0x23)
            },
            Instruction::And   { rs, rt, rd } => {
                compile_r_format(Some(rs), rt, rd, 0x0, 0x24)
            },
            Instruction::Or    { rs, rt, rd } => {
                compile_r_format(Some(rs), rt, rd, 0x0, 0x25)
            },
            Instruction::Xor   { rs, rt, rd } => {
                compile_r_format(Some(rs), rt, rd, 0x0, 0x26)
            },
            Instruction::Nor   { rs, rt, rd } => {
                compile_r_format(Some(rs), rt, rd, 0x0, 0x27)
            },
            Instruction::Sll   { rt, rd, shamt } => {
                compile_r_format(None, rt, rd, shamt, 0x0)
            },
            Instruction::Srl   { rt, rd, shamt } => {
                compile_r_format(None, rt, rd, shamt, 0x2)
            },
            Instruction::Sra   { rt, rd, shamt } => {
                compile_r_format(None, rt, rd, shamt, 0x3)
            },

            /* --------------------- Immediate Operations -------------------------- */
            Instruction::Addi  { rs, rt, imm } => {
                compile_i_format(0x8, Some(rs), rt, imm)
            },
            Instruction::Addiu { rs, rt, imm } => {
                compile_i_format(0x9, Some(rs), rt, imm)
            },
            Instruction::Andi  { rs, rt, imm } => {
                compile_i_format(0xc, Some(rs), rt, imm)
            },
            Instruction::Ori   { rs, rt, imm } => {
                compile_i_format(0xd, Some(rs), rt, imm)
            },
            Instruction::Xori  { rs, rt, imm } => {
                compile_i_format(0xe, Some(rs), rt, imm)
            },
            Instruction::Beq   { rs, rt, imm } => {
                compile_i_format(0x4, Some(rs), rt, imm)
            },
            Instruction::Lbu   { rs, rt, imm } => {
                compile_i_format(0x24, Some(rs), rt, imm)
            },
            Instruction::Lhu   { rs, rt, imm } => {
                compile_i_format(0x25, Some(rs), rt, imm)
            },
            Instruction::Lw    { rs, rt, imm } => {
                compile_i_format(0x23, Some(rs), rt, imm)
            },
            Instruction::Lui   { rt, imm } => {
                compile_i_format(0xf, None, rt, imm)
            },
            Instruction::Sb    { rs, rt, imm } => {
                compile_i_format(0x28, Some(rs), rt, imm)
            },
            Instruction::Sh    { rs, rt, imm } => {
                compile_i_format(0x29, Some(rs), rt, imm)
            },
            Instruction::Sw    { rs, rt, imm } => {
                compile_i_format(0x2b, Some(rs), rt, imm)
            },

            /* -------------------------- Jump Operations -------------------------- */
            _ => return None,
        };

        program.extend_from_slice(&transform_u32_to_array_of_u8(machine_code));
    }

    Some(program)
}

fn transform_u32_to_array_of_u8(x: u32) -> [u8; 4] {
    let b1: u8 = ((x >> 24) & 0xff) as u8;
    let b2: u8 = ((x >> 16) & 0xff) as u8;
    let b3: u8 = ((x >> 8) & 0xff) as u8;
    let b4: u8 = (x & 0xff) as u8;
    return [b1, b2, b3, b4];
}

fn compile_r_format(rs: Option<Register>, rt: Register, rd: Register, shamt: u8, funct: u8) -> u32 {
    let rs_val = match rs {
        Some(rs_value) => rs_value as u8,
        None => 0x0,
    };
    let rt_val = rt as u8;
    let rd_val = rd as u8;

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

fn compile_i_format(opcode: u8, rs: Option<Register>, rt: Register, imm: Immediate16) -> u32 {
    let rs_val = match rs {
        Some(rs_value) => rs_value as u8,
        None => 0x0,
    };
    let rt_val = rt as u8;
    let imm_val = match imm {
        Immediate16::Value(val) => val,
        Immediate16::Label(_) => panic!("Label still present at codegen time"),
    };

    // Make sure arguments use the appropriate number of bits
    assert!(opcode < 64);
    assert!(rs_val < 32);
    assert!(rt_val < 32);
    // imm is exactly 16 bits which is enforced by rust

    let mut instruction: u32 = 0;

    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    instruction |= (opcode as u32) << 26;
    instruction |= (rs_val as u32) << 21;
    instruction |= (rt_val as u32) << 16;
    instruction |= imm_val as u32;

    instruction
}
