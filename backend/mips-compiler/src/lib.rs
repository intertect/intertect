pub mod instruction_printer;
pub mod reference_extractor;
/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

#[cfg(test)]
mod tests;

extern crate pest;
#[macro_use]
extern crate pest_derive;
extern crate clap;
extern crate goblin;
#[macro_use]
extern crate simple_error;
extern crate tempfile;

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
        shamt: u8,
    },

    Srl {
        rt: Register,
        rd: Register,
        shamt: u8,
    },

    Sra {
        rt: Register,
        rd: Register,
        shamt: u8,
    },

    Jr {
        rs: Register,
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
        imm: Immediate16,
    },

    Xori {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },

    Lbu {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },

    Lhu {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },

    Lw {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },

    Lui {
        rt: Register,
        imm: Immediate16,
    },

    Sb {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },

    Sh {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },

    Sw {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },

    Beq {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },

    /* -------------------------- Jump Operations -------------------------- */
    J {
        target: Immediate28,
    },
    Jal {
        target: Immediate28,
    },

    /* -------------------------- Special Operations ----------------------- */
    Nop {},
    
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
    Value(u32),
    Label(Label),
}

#[derive(Debug)]
enum Immediate28 {
    Value(u32),
    Label(Label),
}

// A virtual line of assembly. Contains labels to current line (if any exists) as well as the
// instruction itself
#[derive(Debug)]
struct Line {
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
pub fn compile_string(program: &str) -> Option<Vec<u8>> {
    let vr = match parse_program(program) {
        Some(vr) => vr,
        None => {
            println!("Failed to parse program");
            return None;
        }
    };

    let compiled = match compile_vr(vr) {
        Some(machine_code) => machine_code,
        None => {
            println!("Failed to compile program");
            return None;
        }
    };

    Some(compiled)
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
            Rule::instruction => match handle_instruction(line.into_inner().next().unwrap()) {
                Some(instruction) => {
                    next_instruction_index += 1;
                    vr.instructions.push(instruction)
                }
                None => println!("Couldn't parse instruction"),
            },
            Rule::label => {
                let label_str = line.as_str();
                let label = Label {
                    name: label_str[..label_str.len()-1].to_string(),
                };

                vr.labels.insert(label, next_instruction_index * 4);
            }
            _ => println!("Found a thing: {:?}", line),
        }
    }

    println!("{:?}", vr);

    Some(vr)
}

fn handle_instruction(instruction: Pair<'_, Rule>) -> Option<Line> {
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
                    name, /*rd_str=*/ rt_str, /*rs_str=*/ "$at", /*rt_str=*/ rs_str,
                    /*shamt_str=*/ imm_str,
                )
            } else {
                handle_i_instruction(name, rt_str, rs_str, imm_str)
            }
        }
        Rule::j_instruction => {
            let mut pairs = instruction.into_inner();

            let name = pairs.next().unwrap().as_str();
            let target = pairs.next().unwrap().as_str();

            handle_j_instruction(name, target)
        }
        Rule::nop => Some(Line {
            instruction: Instruction::Nop {},
        }),
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
) -> Option<Line> {
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

    let instruction = match construct_r_instruction(operation, rs, rt, rd, shamt) {
        Some(instruction) => instruction,
        None => return None,
    };

    let line = Line {
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
            rd: rd,
        },

        "subu" => Instruction::Subu {
            rs: rs,
            rt: rt,
            rd: rd,
        },

        "and" => Instruction::And {
            rs: rs,
            rt: rt,
            rd: rd,
        },

        "or" => Instruction::Or {
            rs: rs,
            rt: rt,
            rd: rd,
        },

        "nor" => Instruction::Nor {
            rs: rs,
            rt: rt,
            rd: rd,
        },

        "xor" => Instruction::Xor {
            rs: rs,
            rt: rt,
            rd: rd,
        },

        "sll" => Instruction::Sll {
            rt: rt,
            rd: rd,
            shamt: _shamt,
        },

        "srl" => Instruction::Srl {
            rt: rt,
            rd: rd,
            shamt: _shamt,
        },

        "sra" => Instruction::Sra {
            rt: rt,
            rd: rd,
            shamt: _shamt,
        },

        "jr" => Instruction::Jr { rs: rs },

        _ => return None,
    };

    Some(instruction)
}

fn handle_i_instruction(
    operation: &str,
    rt_str: &str,
    rs_str: &str,
    imm_str: &str,
) -> Option<Line> {
    let rs = match lookup_register(rs_str) {
        Some(reg) => reg,
        None => return None,
    };

    let rt = match lookup_register(rt_str) {
        Some(reg) => reg,
        None => return None,
    };

    let (radix, imm_str) = if imm_str.to_lowercase().starts_with("0x") {
        (16, &imm_str[2..])
    } else {
        (10, imm_str)
    };

    let imm = match u32::from_str_radix(imm_str, radix) {
        Ok(val) => Immediate16::Value(val),
        Err(_) => {
            let label_name = imm_str.to_string();
            Immediate16::Label(Label { name: label_name })
        }
    };

    let instruction = match construct_i_instruction(operation, rs, rt, imm) {
        Some(instruction) => instruction,
        None => return None,
    };

    let line = Line {
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
            imm: imm,
        },

        "addiu" => Instruction::Addiu {
            rs: rs,
            rt: rt,
            imm: imm,
        },

        "andi" => Instruction::Andi {
            rs: rs,
            rt: rt,
            imm: imm,
        },

        "ori" => Instruction::Ori {
            rs: rs,
            rt: rt,
            imm: imm,
        },

        "xori" => Instruction::Xori {
            rs: rs,
            rt: rt,
            imm: imm,
        },

        "lbu" => Instruction::Lbu {
            rs: rs,
            rt: rt,
            imm: imm,
        },

        "lhu" => Instruction::Lhu {
            rs: rs,
            rt: rt,
            imm: imm,
        },

        "lw" => Instruction::Lw {
            rs: rs,
            rt: rt,
            imm: imm,
        },

        "lui" => Instruction::Lui { rt: rt, imm: imm },

        "sb" => Instruction::Sb {
            rs: rs,
            rt: rt,
            imm: imm,
        },

        "sh" => Instruction::Sh {
            rs: rs,
            rt: rt,
            imm: imm,
        },

        "sw" => Instruction::Sw {
            rs: rs,
            rt: rt,
            imm: imm,
        },

        "beq" => Instruction::Beq {
            // They are backwards on purpose
            rs: rt,
            rt: rs,
            imm: imm,
        },

        _ => return None,
    };

    Some(instruction)
}

fn handle_j_instruction(operation: &str, target_str: &str) -> Option<Line> {
    let (radix, imm_str) = if target_str.to_lowercase().starts_with("0x") {
        (16, &target_str[2..])
    } else {
        (10, target_str)
    };

    println!("{}", target_str);

    let target = match u32::from_str_radix(imm_str, radix) {
        Ok(val) => Immediate28::Value(val >> 2),
        Err(_) => Immediate28::Label(Label {
            name: imm_str.to_string(),
        }),
    };

    let instruction = match construct_j_instruction(operation, target) {
        Some(instruction) => instruction,
        None => return None,
    };

    let line = Line {
        instruction: instruction,
    };

    Some(line)
}

fn construct_j_instruction(operation: &str, target: Immediate28) -> Option<Instruction> {
    let instruction = match operation {
        "j" => Instruction::J { target: target },

        "jal" => Instruction::Jal { target: target },

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
    let mut current_address: u32 = 0;

    // TODO(peterdelong): Might be better as a map
    // all material was pulled from: http://www2.engr.arizona.edu/~ece369/Resources/spim/MIPSReference.pdf
    for instruction in vr.instructions {
        let machine_code = match instruction.instruction {
            /* ------------------------ Register Operations ------------------------ */
            Instruction::Add { rs, rt, rd } => {
                compile_r_format(Some(rs), Some(rt), Some(rd), 0x0, 0x20)
            }
            Instruction::Addu { rs, rt, rd } => {
                compile_r_format(Some(rs), Some(rt), Some(rd), 0x0, 0x21)
            }
            Instruction::Sub { rs, rt, rd } => {
                compile_r_format(Some(rs), Some(rt), Some(rd), 0x0, 0x22)
            }
            Instruction::Subu { rs, rt, rd } => {
                compile_r_format(Some(rs), Some(rt), Some(rd), 0x0, 0x23)
            }
            Instruction::And { rs, rt, rd } => {
                compile_r_format(Some(rs), Some(rt), Some(rd), 0x0, 0x24)
            }
            Instruction::Or { rs, rt, rd } => {
                compile_r_format(Some(rs), Some(rt), Some(rd), 0x0, 0x25)
            }
            Instruction::Xor { rs, rt, rd } => {
                compile_r_format(Some(rs), Some(rt), Some(rd), 0x0, 0x26)
            }
            Instruction::Nor { rs, rt, rd } => {
                compile_r_format(Some(rs), Some(rt), Some(rd), 0x0, 0x27)
            }
            Instruction::Sll { rt, rd, shamt } => {
                compile_r_format(None, Some(rt), Some(rd), shamt, 0x0)
            }
            Instruction::Srl { rt, rd, shamt } => {
                compile_r_format(None, Some(rt), Some(rd), shamt, 0x2)
            }
            Instruction::Sra { rt, rd, shamt } => {
                compile_r_format(None, Some(rt), Some(rd), shamt, 0x3)
            }
            Instruction::Jr { rs } => compile_r_format(Some(rs), None, None, 0, 0x8),

            /* --------------------- Immediate Operations -------------------------- */
            Instruction::Addi { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0x8, Some(rs), rt, imm)
            },
            Instruction::Addiu { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0x9, Some(rs), rt, imm)
            }
            Instruction::Andi { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0xc, Some(rs), rt, imm)
            },
            Instruction::Ori { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0xd, Some(rs), rt, imm)
            },
            Instruction::Xori { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0xe, Some(rs), rt, imm)
            },
            Instruction::Beq { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                let imm = match imm {
                    Immediate16::Value(val) => {
                        Immediate16::Value((val - current_address) >> 2)
                    }
                    Immediate16::Label(_) => panic!("Label somehow made it into codegen"),
                };
                compile_i_format(0x4, Some(rs), rt, imm)
            }
            Instruction::Lbu { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0x24, Some(rs), rt, imm)
            },
            Instruction::Lhu { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0x25, Some(rs), rt, imm)
            },
            Instruction::Lw { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0x23, Some(rs), rt, imm)
            },
            Instruction::Lui { rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0xf, None, rt, imm)
            },
            Instruction::Sb { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0x28, Some(rs), rt, imm)
            },
            Instruction::Sh { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0x29, Some(rs), rt, imm)
            },
            Instruction::Sw { rs, rt, imm } => {
                let imm = resolve_label(imm, &vr.labels);
                compile_i_format(0x2b, Some(rs), rt, imm)
            },
            Instruction::Nop {} => 0,

            /* -------------------------- Jump Operations -------------------------- */
            Instruction::J { target } => compile_j_format(0x2, target),
            Instruction::Jal { target } => compile_j_format(0x3, target),
        };

        program.extend_from_slice(&transform_u32_to_array_of_u8(machine_code));
        current_address += 4;
    }

    Some(program)
}

fn resolve_label(imm: Immediate16, labels: &HashMap<Label, u32>) -> Immediate16 {
    match imm {
        Immediate16::Value(_) => imm,
        Immediate16::Label(label) => {
            match labels.get(&label) {
                Some(&value) => Immediate16::Value(value),
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

fn compile_j_format(opcode: u8, target: Immediate28) -> u32 {
    let target = match target {
        Immediate28::Value(val) => val,
        Immediate28::Label(_) => panic!("Label somehow made it into final codegen step"),
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

fn compile_r_format(
    rs: Option<Register>,
    rt: Option<Register>,
    rd: Option<Register>,
    shamt: u8,
    funct: u8,
) -> u32 {
    let rs_val = match rs {
        Some(rs_value) => rs_value as u8,
        None => 0x0,
    };
    let rt_val = match rt {
        Some(rt_value) => rt_value as u8,
        None => 0x0,
    };
    let rd_val = match rd {
        Some(rd_value) => rd_value as u8,
        None => 0x0,
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
    // TODO: See if we can get this to be enforced by rust again
    assert!(imm_val < 65536);

    let mut instruction: u32 = 0;

    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    instruction |= (opcode as u32) << 26;
    instruction |= (rs_val as u32) << 21;
    instruction |= (rt_val as u32) << 16;
    instruction |= imm_val as u32;

    instruction
}
