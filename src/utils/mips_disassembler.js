/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

const functMap = {
  0x20: "add",
  0x21: "addu",
  0x22: "sub",
  0x23: "subu",
  0x24: "and",
  0x25: "or",
  0x27: "nor",
  0x26: "xor",
  0x0: "sll",
  0x2: "srl",
  0x3: "sra",
  0x8: "jr",
};

const opcodeMap = {
  0x8: "addi",
  0x9: "addiu",
  0xc: "andi",
  0xd: "ori",
  0xe: "xori",
  0x24: "lbu",
  0x25: "lhu",
  0x23: "lw",
  0xf: "lui",
  0x28: "sb",
  0x29: "sh",
  0x2b: "sw",
  0x4: "beq",
};

const regMap = {
  0x0:  "$zero",
  0x1:  "$at",
  0x2:  "$v0",
  0x3:  "$v1",
  0x4:  "$a0",
  0x5:  "$a1",
  0x6:  "$a2",
  0x7:  "$a3",
  0x8:  "$t0",
  0x9:  "$t1",
  0xa:  "$t2",
  0xb:  "$t3",
  0xc:  "$t4",
  0xd:  "$t5",
  0xe:  "$t6",
  0xf:  "$t7",
  0x10: "$s0",
  0x11: "$s1",
  0x12: "$s2",
  0x13: "$s3",
  0x14: "$s4",
  0x15: "$s5",
  0x16: "$s6",
  0x17: "$s7",
  0x18: "$t8",
  0x19: "$t9",
  0x1a: "$k0",
  0x1b: "$k1",
  0x1c: "$gp",
  0x1d: "$sp",
  0x1e: "$fp",
  0x1f: "$ra",
};

export function bytesToInstruction (bytes) {
  return bytes[0] << 24 |
         bytes[1] << 16 |
         bytes[2] << 8  |
         bytes[3];
}

/* We assume the inputs will be decimal numbers that are to be converted to
decimal to understand their underlying meaning */
export function disassembleInstruction(instruction) {
  var opcode = (instruction >> 26) & 0x3F // 0x3F == 0b111111

  // All R (register) instructions start with 0s
  if (opcode == 0x0) {
    var rs = (instruction >> 21) & 0x1F;
    var rt = (instruction >> 16) & 0x1F;
    var rd = (instruction >> 11) & 0x1F;
    var shamt = (instruction >> 6) & 0x1F;
    var funct = (instruction >> 0) & 0x3F;

    var op_str = functMap[funct];

    var rs_str = regMap[rs];
    var rt_str = regMap[rt];
    var rd_str = regMap[rd];

    return {op: op_str,
            rs: rs_str,
            rt: rt_str,
            rd: rd_str,
            shamt: shamt
    };
  }

  // only support j and jal J (jump) instructions
  else if (opcode == 0x2 || opcode == 0x3) {
    // J format: oooooott ttttttt tttttttt tttttttt
    var target = instruction | 0x3FFFFFF ;

    op_str = opcode == 0x2 ? "j" : "jal";

    return {op: op_str, target: target}
  }

  else {
    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    var rs = (instruction >> 21) & 0x1F;
    var rt = (instruction >> 16) & 0x1F;
    var i = (instruction >> 0) & 0xFFFF;

    var op_str = opcodeMap[opcode];

    var rs_str = regMap[rs];
    var rt_str = regMap[rt];

    return {op: op_str, rs: rs_str, rt: rt_str, immediate: i}
  }
}
