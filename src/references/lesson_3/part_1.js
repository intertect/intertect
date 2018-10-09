function ToUint32(x) {
  return x >>> 0;
}

export function solution(location, registers, memory) {
  function fetch(location) {
    var byte_1 = memory[location];
    var byte_2 = memory[location + 1];
    var byte_3 = memory[location + 2];
    var byte_4 = memory[location + 3];

    var binary = byte_4;
    binary |= byte_3 << 8;
    binary |= byte_2 << 16;
    binary |= byte_1 << 24;

    return binary;
  }

  function decode(binary) {
    var opcode = binary >> 26;

    // All R (register) binarys start with 0s
    var rs, rt, rd;
    var op_str;

    var pc, pc_val, result;
    var instruction;

    if (opcode == 0x0) {
      // TODO: Fill this area
      rs = binary >> 21 & 0x1f
      rt = binary >> 16 & 0x1f
      rd = binary >> 11 & 0x1f
      var shamt = binary >> 6 & 0x1f
      var funct = binary & 0x3f

      op_str = functMap[funct];
      instruction = [op_str, rs, rt, rd, shamt, funct];
    }

    else if (opcode == 0x2 || opcode == 0x3) {
      // J format: oooooott ttttttt tttttttt tttttttt
      var target = (binary & 0x3FFFFFF) << 2;

      op_str = opcode == 0x2 ? "j" : "jal";
      instruction = [op_str, target];
    }

    else {
      // I format: ooooooss sssttttt iiiiiiii iiiiiiii
      rs = (binary >> 21) & 0x1F;
      rt = (binary >> 16) & 0x1F;
      var imm = (binary >> 0) & 0xFFFF;

      op_str = opcodeMap[opcode];
      instruction = [op_str, rs, rt, imm];
    }

    return instruction;
  }

  function execute(instruction) {
    var rd, rs, rt;
    var shamt;
    var result;
    var imm;
    var target
    var offset;
    var pc, pc_val, ra;
    var byte_1, byte_2, byte_3, byte_4;
    var bytes;
    var value;
    var start_address;
    switch(instruction[0]) {
      case 'addu':
        rd = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        rt = nameToRegisterMap[instruction[3]];
        result = ToUint32(registers.read(rs) + registers.read(rt));
        return [registers, rd, result];
      case 'subu':
        rd = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        rt = nameToRegisterMap[instruction[3]];
        result = ToUint32(registers.read(rs) - registers.read(rt));
        return [registers, rd, result];
      case 'and':
        rd = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        rt = nameToRegisterMap[instruction[3]];
        result = ToUint32(registers.read(rs) & registers.read(rd));
        return [registers, rd, result];
      case 'or':
        rd = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        rt = nameToRegisterMap[instruction[3]];
        result = ToUint32(registers.read(rs) | registers.read(rd));
        return [registers, rd, result];
      case 'xor':
        rd = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        rt = nameToRegisterMap[instruction[3]];
        result = ToUint32(registers.read(rs) ^ registers.read(rd));
        return [registers, rd, result];
      case 'sll':
        rd = nameToRegisterMap[instruction[1]];
        rt = nameToRegisterMap[instruction[2]];
        shamt = ToUint32(instruction[3]);
        result = ToUint32(registers.read(rs)) << shamt;
        return [registers, rd, result];
      case 'srl':
        rd = nameToRegisterMap[instruction[1]];
        rt = nameToRegisterMap[instruction[2]];
        shamt = ToUint32(instruction[3]);
        result = ToUint32(registers.read(rs)) >>> shamt;
        return [registers, rd, result];
      case 'sra':
        rd = nameToRegisterMap[instruction[1]];
        rt = nameToRegisterMap[instruction[2]];
        shamt = ToUint32(instruction[3]);
        result = ToUint32(registers.read(rs)) >> shamt;
        return [registers, rd, result];
      case 'addiu':
        rt = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        imm = instruction[3];
        result = ToUint32(registers.read(rs) + imm);
        return [registers, rt, result];
      case 'andi':
        rt = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        imm = instruction[3];
        result = ToUint32(registers.read(rs) & imm);
        return [registers, rt, result];
      case 'ori':
        rt = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        imm = instruction[3];
        result = ToUint32(registers.read(rs) | imm);
        return [registers, rt, result];
      case 'xori':
        rt = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        imm = instruction[3];
        result = ToUint32(registers.read(rs) ^ imm);
        return [registers, rt, result];
      case 'beq':
        rt = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        offset = ToUint32(instruction[3]);
        pc = nameToRegisterMap["$pc"];

        result = ToUint32(registers.read(pc)) + offset;
        return [registers, pc, offset];
      case 'j':
        target = ToUint32(instruction[1]) << 2;
        pc = nameToRegisterMap["$pc"];
        // Lop off the two top bits
        target &= 0x3FFFFFFF;

        pc_val = ToUint32(registers.read(pc));
        // Keep only the top two bits
        pc_val &= 0xC0000000;

        result = pc_val | target;

        return [registers, pc, offset];
      case 'jal':
        target = ToUint32(instruction[1]) << 2;
        pc = nameToRegisterMap["$pc"];
        ra = nameToRegisterMap["$ra"];
        // Lop off the two top bits
        target &= 0x3FFFFFFF;

        pc_val = ToUint32(registers.read(pc));
        // Keep only the top two bits
        pc_val &= 0xC0000000;

        result = pc_val | target;

        registers.write(ra, pc);
        return [registers, pc, offset];
      case 'jr':
        rs = nameToRegisterMap[instruction[1]];
        pc = nameToRegisterMap["$pc"];

        result = ToUint32(registers.read(rs));

        return [registers, pc, result];
      case 'nop':
        break;
      case 'sw':
        rt = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        offset = instruction[3];

        start_address = ToUint32(registers.read(rs)) + ToUint32(offset);
        value = ToUint32(registers.read(rt));

        // From most to least significant
        byte_1 = (value >> 24) & 0xFF;
        byte_2 = (value >> 16) & 0xFF;
        byte_3 = (value >> 8) & 0xFF;
        byte_4 = value & 0xFF;
        bytes = [byte_1, byte_2, byte_3, byte_4]

        return [memory, start_address, bytes];
      case 'sh':
        rt = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        offset = instruction[3];

        start_address = ToUint32(registers.read(rs)) + ToUint32(offset);
        value = ToUint32(registers.read(rt));

        // From most to least significant
        byte_1 = (value >> 8) & 0xFF;
        byte_2 = value & 0xFF;
        bytes = [byte_1, byte_2];

        return [memory, start_address, bytes];
      case 'sb':
        rt = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        offset = instruction[3];

        start_address = ToUint32(registers.read(rs)) + ToUint32(offset);
        value = ToUint32(registers.read(rt));

        // From most to least significant
        byte_1 = value & 0xFF;
        bytes = [byte_1];

        return [memory, start_address, bytes];
      case 'lw':
        rt = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        offset = instruction[3];

        start_address = ToUint32(registers.read(rs)) + ToUint32(offset);

        // From most to least significant
        byte_1 = memory.read(start_address);
        byte_2 = memory.read(start_address + 1);
        byte_3 = memory.read(start_address + 2);
        byte_4 = memory.read(start_address + 3);

        value = byte_4;
        value |= byte_3 << 8;
        value |= byte_2 << 16;
        value |= byte_1 << 24;

        return [registers, rt, value];
      case 'lh':
        rt = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        offset = instruction[3];

        start_address = ToUint32(registers.read(rs)) + ToUint32(offset);

        // From most to least significant
        byte_1 = memory.read(start_address);
        byte_2 = memory.read(start_address + 1);

        value = byte_2;
        value |= byte_1 << 8;

        return [registers, rt, value];
      case 'lb':
        rt = nameToRegisterMap[instruction[1]];
        rs = nameToRegisterMap[instruction[2]];
        offset = instruction[3];

        start_address = ToUint32(registers.read(rs)) + ToUint32(offset);

        // From most to least significant
        byte_1 = memory.read(start_address);

        value = byte_1;

        return [registers, rt, value];
      default:
        // invalid/unsupported instruction passed in
        return;
    }
  }

  function write(location, position, result) {
    // TODO: Make this less hideous -- this distinguishes memory vs. register write
    if (result instanceof Array) {
      for (var i = 0; i < result.length; i++) {
        location.write(position + i, result[i]);
      }
    } else {
      location.write(position, result);
    }
  }

  var binary = fetch(location);
  var instruction = decode(binary);
  var [location, position, result] = execute(instruction);
  write(location, position, result);
}

const functMap = {
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

const opcodeMap = {
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

const nameToRegisterMap = {
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
