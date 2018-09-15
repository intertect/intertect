/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* fn compile_r_format(
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
} */

/*
*/
function disassembleMips(binary) {
  // 1. identify type of instruction (opcode/funct)
  // 2. identify arguments based on instruction type
  // 3. format into proper assembly code to be parsed
}
