function ToUint32(x) {
  return x >>> 0;
}

function SignExtend16(x) {
  x = ToUint32(x);

  if (x >>> 15 > 0) {
    x |= 0xFFFF0000;
  }

  return x;
}

var branch_delay = false;
var branch_target;

export function solution(instruction, registers) {
  instruction = ToUint32(instruction);
  var opcode = instruction >> 26;

  // All R (register) instructions start with 0s
  var rs, rt, rd;
  var op_str;

  var pc_val, result;
  var ra;

  // Actually perform the branch delay
  if (branch_delay) {
    var pc = nameToRegisterMap["$pc"];
    branch_delay = false;
    registers.write(pc, branch_target);
  }

  if (opcode == 0x0) {
    // TODO: Fill this area
    rs = instruction >> 21 & 0x1f
    rt = instruction >> 16 & 0x1f
    rd = instruction >> 11 & 0x1f
    var shamt = instruction >> 6 & 0x1f
    var funct = instruction & 0x3f

    op_str = functMap[funct];

    var result;
    switch(op_str) {
      case 'addu':
        result = ToUint32(registers.read(rs) + registers.read(rt));
        registers.write(rd, result);
        break;
      case 'subu':
        result = ToUint32(registers.read(rs) - registers.read(rt));
        registers.write(rd, result);
        break;
      case 'and':
        result = ToUint32(registers.read(rs) & registers.read(rd));
        registers.write(rd, result);
        break;
      case 'or':
        result = ToUint32(registers.read(rs) | registers.read(rd));
        registers.write(rd, result);
        break;
      case 'xor':
        result = ToUint32(registers.read(rs) ^ registers.read(rd));
        registers.write(rd, result);
        break;
      case 'sll':
        result = ToUint32(registers.read(rs) << registers.read(rd));
        registers.write(rd, result);
        break;
      case 'srl':
        result = ToUint32(registers.read(rs) >>> registers.read(rd));
        registers.write(rd, result);
        break;
      case 'sra':
        result = ToUint32(registers.read(rs) >> registers.read(rd));
        registers.write(rd, result);
        break;
      case 'jr':
        result = ToUint32(registers.read(rs));

        branch_delay = true;
        branch_target = result;
        break;
      default:
        break;
    }
  }

  else if (opcode == 0x2 || opcode == 0x3) {
    // J format: oooooott ttttttt tttttttt tttttttt
    var target = (instruction & 0x3FFFFFF) << 2;

    op_str = opcode == 0x2 ? "j" : "jal";

    // TODO
    switch(op_str) {
      case 'j':
        // Lop off the two top bits
        target &= 0x3FFFFFFF;

        pc_val = ToUint32(registers.read(pc));
        // Keep only the top two bits
        pc_val &= 0xC0000000;

        result = pc_val | target;

        branch_delay = true;
        branch_target = result;
        break;
      case 'jal':
        ra = nameToRegisterMap["$ra"];
        // Lop off the two top bits
        target &= 0x3FFFFFFF;

        pc_val = ToUint32(registers.read(pc));

        result = (pc_val & 0xC0000000) | target;

        branch_delay = true;
        branch_target = result;
        registers.write(ra, pc_val + 8);
        break;
      default:
        break;
    }
  }

  else {
    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    rs = (instruction >> 21) & 0x1F;
    rt = (instruction >> 16) & 0x1F;
    var imm = SignExtend16(instruction & 0xFFFF);

    // used in store/load instructions
    var start_address = ToUint32(registers.read(rs)) + ToUint32(imm);
    var byte_1, byte_2, byte_3, byte_4;
    var value;

    op_str = opcodeMap[opcode];

    switch(op_str) {
      case 'addiu':
        result = registers.read(rs) + SignExtend16(imm);
        registers.write(rt, result);
        break;
      case 'andi':
        result = ToUint32(registers.read(rs) & imm);
        registers.write(rt, result);
        break;
      case 'ori':
        result = ToUint32(registers.read(rs) | imm);
        registers.write(rt, result);
        break;
      case 'xori':
        result = ToUint32(registers.read(rs) ^ imm);
        registers.write(rt, result);
        break;
      case 'beq':
        if (registers.read(rs) == registers.read(rt)) {
          target = imm << 2;

          result = ToUint32(registers.read(pc) + target + 4);

          branch_delay = true;
          branch_target = result;
        }
        break;
      case 'sw':
        value = ToUint32(registers.read(rt));

        byte_1 = (value >> 24) & 0xFF;
        byte_2 = (value >> 16) & 0xFF;
        byte_3 = (value >> 8) & 0xFF;
        byte_4 = value & 0xFF;

        memory.write(start_address, byte_1);
        memory.write(start_address + 1, byte_2);
        memory.write(start_address + 2, byte_3);
        memory.write(start_address + 3, byte_4);

        break;
      case 'sh':
        value = ToUint32(registers.read(rt));

        byte_1 = (value >> 8) & 0xFF;
        byte_2 = value & 0xFF;

        memory.write(start_address, byte_1);
        memory.write(start_address + 1, byte_2);

        break;
      case 'sb':
        value = ToUint32(registers.read(rt));
        byte_1 = value & 0xFF;
        memory.write(start_address, byte_1);

        break;
      case 'lw':
        byte_1 = memory.read(start_address);
        byte_2 = memory.read(start_address + 1);
        byte_3 = memory.read(start_address + 2);
        byte_4 = memory.read(start_address + 3);

        result = byte_4;
        result |= byte_3 << 8;
        result |= byte_2 << 16;
        result |= byte_1 << 24;

        registers.write(rt, result);
        break;
      case 'lh':
        byte_1 = memory.read(start_address);
        byte_2 = memory.read(start_address + 1);

        result = byte_2;
        result |= byte_1 << 8;

        registers.write(rt, result);
        break;
      case 'lb':
        byte_1 = memory.read(start_address);
        result = byte_1;
        registers.write(rt, result);
        break;
      default:
        break;
    }
  }
}

var functMap = {
  0x20: "add",
  0x21: "addu",
  0x22: "sub",
  0x23: "subu",
  0x24: "and",
  0x25: "or",
  0x27: "nor",
  0x26: "xor",
  0x00: "sll",
  0x02: "srl",
  0x03: "sra",
  0x08: "jr",
};

var opcodeMap = {
  0x08: "addi",
  0x09: "addiu",
  0x0c: "andi",
  0x0d: "ori",
  0x0e: "xori",
  0x24: "lbu",
  0x25: "lhu",
  0x23: "lw",
  0x0f: "lui",
  0x28: "sb",
  0x29: "sh",
  0x2b: "sw",
  0x04: "beq",
};

var nameToRegisterMap = {
  "$zero" : 0x0,
  "$at" : 0x1,
  "$v0" : 0x2,
  "$v1" : 0x3,
  "$a0" : 0x4,
  "$a1" : 0x5,
  "$a2" : 0x6,
  "$a3" : 0x7,
  "$t0" : 0x8,
  "$t1" : 0x9,
  "$t2" : 0xa,
  "$t3" : 0xb,
  "$t4" : 0xc,
  "$t5" : 0xd,
  "$t6" : 0xe,
  "$t7" : 0xf,
  "$s0" : 0x10,
  "$s1" : 0x11,
  "$s2" : 0x12,
  "$s3" : 0x13,
  "$s4" : 0x14,
  "$s5" : 0x15,
  "$s6" : 0x16,
  "$s7" : 0x17,
  "$t8" : 0x18,
  "$t9" : 0x19,
  "$k0" : 0x1a,
  "$k1" : 0x1b,
  "$gp" : 0x1c,
  "$sp" : 0x1d,
  "$fp" : 0x1e,
  "$ra" : 0x1f,
  "$pc" : 0x20
};
