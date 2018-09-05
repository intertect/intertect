extern crate pest;
#[macro_use]
extern crate pest_derive;

use pest::iterators::Pair;
use pest::iterators::Pairs;
use pest::Parser;

use std::collections::HashMap;

const _GRAMMAR: &'static str = include_str!("mips.pest");

#[derive(Parser)]
#[grammar = "mips.pest"]
struct Mips;

// Operation contains structured names of all the instructions we implement
// These don't necessarily correspond 1:1 with opcodes, since there is also a
// "func" field on some instructions
#[derive(Debug)]
enum Operation {
    Add,
    Addi,
    // TODO: etc...
}

// Instruction contains all the information that a given instruction could possibly need when it is
// being compiled
#[derive(Debug)]
enum Instruction {
    Add {
        rs: Register,
        rt: Register,
        rd: Register,
    },
    Addi {
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },
    // TODO: etc...
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
    // TODO: Data
    labels: HashMap<Label, u32>,
    instructions: Vec<Line>,
}

// The main entry point. Pass in a string containing assembly code and return an array
// containing the complete program image
pub fn compile_string(program: String) -> Option<Vec<u8>> {
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
fn parse_program(program: String) -> Option<VirtualRepresentation> {
    let mut vr = VirtualRepresentation {
        labels: HashMap::new(),
        instructions: Vec::new(),
    };

    let mut pairs = match Mips::parse(Rule::program, &program) {
        Ok(mut pairs) => pairs,
        Err(_) => return None, //TODO(peterdelong)
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

fn handle_instruction(instruction: Pair<Rule>) -> Option<Line> {
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

fn lookup_operation(operation: &str) -> Option<Operation> {
    let oper = match operation.to_lowercase().as_ref() {
        "add" => Operation::Add,
        "addi" => Operation::Addi,
        _ => return None,
    };

    Some(oper)
}

fn handle_r_instruction(name: &str, rd_str: &str, rs_str: &str, rt_str: &str) -> Option<Line> {
    let operation = match lookup_operation(name) {
        Some(operation) => operation,
        None => return None,
    };

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
    operation: Operation,
    rs: Register,
    rt: Register,
    rd: Register,
    shamt: u8,
) -> Option<Instruction> {
    let instruction = match operation {
        Operation::Add => Instruction::Add {
            rs: rs,
            rt: rt,
            rd: rd,
        },
        _ => return None,
    };

    Some(instruction)
}

fn handle_i_instruction(name: &str, rt_str: &str, rs_str: &str, imm_str: &str) -> Option<Line> {
    let operation = match lookup_operation(name) {
        Some(operation) => operation,
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
    operation: Operation,
    rs: Register,
    rt: Register,
    imm: Immediate16,
) -> Option<Instruction> {
    let instruction = match operation {
        Operation::Addi => Instruction::Addi {
            rs: rs,
            rt: rt,
            imm: imm,
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
    for instruction in vr.instructions {
        let machine_code = match instruction.instruction {
            Instruction::Add { rs, rt, rd } => {
                let (opcode, rs, rt, rd, shamt, funct) = compile_add(rs, rt, rd);
                compile_r_format(opcode, rs, rt, rd, shamt, funct)
            }
            Instruction::Addi { rs, rt, imm } => {
                let (opcode, rs, rt, imm) = compile_addi(rs, rt, imm);
                compile_i_format(opcode, rs, rt, imm)
            }
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

fn compile_r_format(opcode: u8, rs: u8, rt: u8, rd: u8, shamt: u8, funct: u8) -> u32 {
    // Make sure arguments use the appropriate number of bits
    assert!(opcode < 64);
    assert!(rs < 32);
    assert!(rt < 32);
    assert!(rd < 32);
    assert!(shamt < 32);
    assert!(funct < 64);

    let mut instruction: u32 = 0;

    // 6 bits opcode
    instruction |= (opcode as u32) << 26;

    // 5 bits rs
    instruction |= (rs as u32) << 21;

    // 5 bits rt
    instruction |= (rt as u32) << 16;

    // 5 bits rd
    instruction |= (rd as u32) << 11;

    // 5 bits shamt
    instruction |= (shamt as u32) << 6;

    // 6 bits funct
    instruction |= funct as u32;

    instruction
}

fn compile_i_format(opcode: u8, rs: u8, rt: u8, imm: u16) -> u32 {
    // Make sure arguments use the appropriate number of bits
    assert!(opcode < 64);
    assert!(rs < 32);
    assert!(rt < 32);
    // imm is exactly 16 bits which is enforced by rust

    let mut instruction: u32 = 0;

    // 6 bits opcode
    instruction |= (opcode as u32) << 26;

    // 5 bits rs
    instruction |= (rs as u32) << 21;

    // 5 bits rt
    instruction |= (rt as u32) << 16;

    // 16 bits immediate
    instruction |= imm as u32;

    instruction
}

fn compile_add(rs: Register, rt: Register, rd: Register) -> (u8, u8, u8, u8, u8, u8) {
    let opcode = 0x0;
    let rs_val = rs as u8;
    let rt_val = rt as u8;
    let rd_val = rd as u8;
    let shamt = 0x0;
    let funct = 0x20;

    (opcode, rs_val, rt_val, rd_val, shamt, funct)
}

fn compile_addi(rs: Register, rt: Register, imm: Immediate16) -> (u8, u8, u8, u16) {
    let opcode = 0x8;
    let rs_val = rs as u8;
    let rt_val = rt as u8;
    let imm_val = match imm {
        Immediate16::Value(val) => val,
        Immediate16::Label(_) => panic!("Label still present at codegen time"),
    };

    (opcode, rs_val, rt_val, imm_val)
}
