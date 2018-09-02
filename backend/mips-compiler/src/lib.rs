extern crate pest;
#[macro_use]
extern crate pest_derive;

use pest::Parser;
use pest::iterators::Pair;
use pest::iterators::Pairs;

use std::collections::HashMap;

const _GRAMMAR: &'static str = include_str!("mips.pest");

#[derive(Parser)]
#[grammar = "mips.pest"]
struct Mips;

// Operation contains structured names of all the instructions we implement
// These don't necessarily correspond 1:1 with opcodes, since there is also a
// "func" field on some instructions
enum Operation {
    Add,
    Addi,
    // TODO: etc...
}

// Register represents a single register in the system
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
    T8,
    T9,
    S0,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    K0,
    K1,
    Gp,
    Sp,
    Fp,
    Ra,
}

#[derive(Hash, PartialEq, Eq, PartialOrd, Ord)]
struct Label {
    name: String,
}

enum Immediate16 {
    Value(u16),
    Label(Label),
}

enum Immediate30 {
    Value(u32),
    Label(Label),
}

// Instruction contains all the information the compiler needs to
enum Instruction {
    RFormat {
        operation: Operation,
        rs: Register,
        rt: Register,
        rd: Register,
        shamt: u8,
    },
    IFormat {
        operation: Operation,
        rs: Register,
        rt: Register,
        imm: Immediate16,
    },
    JFormat {
        operation: Operation,
        imm: Immediate30,
    },
}

// A virtual line of assembly. Contains labels to current line (if any exists) as well as the
// instruction itself
struct Line {
    labels: Vec<Label>,
    instruction: Instruction,
}

// Any label that refers to it
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

    let compiled = match compile_vr(vr) {
        Some(machine_code) => machine_code,
        None => {
            println!("Failed to compile program");
            return None;
        }
    };

    return Some(compiled);
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
            Rule::instruction => {
                match handle_instruction(line.into_inner().next().unwrap()) {
                    Some(instruction) => vr.instructions.push(instruction),
                    None => {}
                }
            },
            _ => {}
        }
    }

    // Discover format of each line
    // Call appropriate function
    // Function returns appropriate struct
    // Struct gets appended to the appropriate area of vr

    return Some(vr);
}

fn handle_instruction(instruction: Pair<Rule>) -> Option<Line> {
    return match instruction.as_rule() {
        Rule::r_instruction => handle_r_instruction(instruction.into_inner()),
        Rule::i_instruction => handle_i_instruction(instruction.into_inner()),
        _ => unreachable!()
    }
}

fn lookup_register(register: &str) -> Option<Register> {
    let reg = match register.to_lowercase().as_ref() {
        "zero" => Register::Zero,
        "at" => Register::At,
        "v0" => Register::V0,
        "v1" => Register::V1,
        "a0" => Register::A0,
        "a1" => Register::A1,
        "a2" => Register::A2,
        "a3" => Register::A3,
        "t0" => Register::T0,
        "t1" => Register::T1,
        "t2" => Register::T2,
        "t3" => Register::T3,
        "t4" => Register::T4,
        "t5" => Register::T5,
        "t6" => Register::T6,
        "t7" => Register::T7,
        "t8" => Register::T8,
        "t9" => Register::T9,
        "s0" => Register::S0,
        "s1" => Register::S1,
        "s2" => Register::S2,
        "s3" => Register::S3,
        "s4" => Register::S4,
        "s5" => Register::S5,
        "s6" => Register::S6,
        "s7" => Register::S7,
        "k0" => Register::K0,
        "k1" => Register::K1,
        "gp" => Register::Gp,
        "sp" => Register::Sp,
        "fp" => Register::Fp,
        "ra" => Register::Ra,
        _ => return None
    };

    return Some(reg);
}

fn lookup_operation(operation: &str) -> Option<Operation> {
    let oper =  match operation.to_lowercase().as_ref() {
        "add" => Operation::Add,
        "addi" => Operation::Addi,
        _ => return None
    };

    return Some(oper);
}

fn handle_r_instruction(mut instruction: Pairs<Rule>) -> Option<Line> {
    let name = instruction.next().unwrap().as_str();
    let rd_str = instruction.next().unwrap().as_str();
    let rs_str = instruction.next().unwrap().as_str();
    let rt_str = instruction.next().unwrap().as_str();

    let operation = match lookup_operation(name) {
        Some(operation) => operation,
        None => return None
    };

    let rd = match lookup_register(rd_str) {
        Some(reg) => reg,
        None => return None
    };

    let rs = match lookup_register(rs_str) {
        Some(reg) => reg,
        None => return None
    };

    let rt = match lookup_register(rt_str) {
        Some(reg) => reg,
        None => return None
    };

    return Some(Line {
        labels: Vec::new(),
        instruction: Instruction::RFormat {
            operation: operation,
            rd: rd,
            rs: rs,
            rt: rt,
            shamt: 0
        }
    });

}

fn handle_i_instruction(instruction: Pairs<Rule>) -> Option<Line> {
    return None;
}

fn compile_vr(vr: VirtualRepresentation) -> Option<Vec<u8>> {
    return Some(vec![1, 2, 3]);
}
