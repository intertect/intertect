function ToUint32(x) {
  return x >>> 0;
}

export function solution(instruction, registers, memory) {
  var rd, rs, rt;
  var shamt;
  var result;
  var imm;
  var target
  var offset;
  var pc, pc_val, ra;
  var byte_1, byte_2, byte_3, byte_4;
  var value;
  var start_address;
  switch(instruction[0]) {
    case 'addu':
      rd = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      rt = nameToRegisterMap[instruction[3]];
      result = ToUint32(registers.read(rs) + registers.read(rt));
      registers.write(rd, result);
      break;
    case 'subu':
      rd = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      rt = nameToRegisterMap[instruction[3]];
      result = ToUint32(registers.read(rs) - registers.read(rt));
      registers.write(rd, result);
      break;
    case 'and':
      rd = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      rt = nameToRegisterMap[instruction[3]];
      result = ToUint32(registers.read(rs) & registers.read(rt));
      registers.write(rd, result);
      break;
    case 'or':
      rd = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      rt = nameToRegisterMap[instruction[3]];
      result = ToUint32(registers.read(rs) | registers.read(rt));
      registers.write(rd, result);
      break;
    case 'xor':
      rd = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      rt = nameToRegisterMap[instruction[3]];
      result = ToUint32(registers.read(rs) ^ registers.read(rt));
      registers.write(rd, result);
      break;
    case 'sll':
      rd = nameToRegisterMap[instruction[1]];
      rt = nameToRegisterMap[instruction[2]];
      shamt = ToUint32(instruction[3]);
      result = ToUint32(registers.read(rs)) << shamt;
      registers.write(rd, result);
      break;
    case 'srl':
      rd = nameToRegisterMap[instruction[1]];
      rt = nameToRegisterMap[instruction[2]];
      shamt = ToUint32(instruction[3]);
      result = ToUint32(registers.read(rs)) >>> shamt;
      registers.write(rd, result);
      break;
    case 'sra':
      rd = nameToRegisterMap[instruction[1]];
      rt = nameToRegisterMap[instruction[2]];
      shamt = ToUint32(instruction[3]);
      result = ToUint32(registers.read(rs)) >> shamt;
      registers.write(rd, result);
      break;
    case 'addiu':
      rt = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      imm = instruction[3];
      result = ToUint32(registers.read(rs) + imm);
      registers.write(rt, result);
      break;
    case 'andi':
      rt = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      imm = instruction[3];
      result = ToUint32(registers.read(rs) & imm);
      registers.write(rt, result);
      break;
    case 'ori':
      rt = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      imm = instruction[3];
      result = ToUint32(registers.read(rs) | imm);
      registers.write(rt, result);
      break;
    case 'xori':
      rt = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      imm = instruction[3];
      result = ToUint32(registers.read(rs) ^ imm);
      registers.write(rt, result);
      break;
    case 'beq':
      rt = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      offset = ToUint32(instruction[3]);
      pc = nameToRegisterMap["$pc"];

      result = ToUint32(registers.read(pc)) + offset;
      registers.write(pc, offset);
      break;
    case 'j':
      target = ToUint32(instruction[1]) << 2;
      pc = nameToRegisterMap["$pc"];
      // Lop off the two top bits
      target &= 0x3FFFFFFF;

      pc_val = ToUint32(registers.read(pc));
      // Keep only the top two bits
      pc_val &= 0xC0000000;

      result = pc_val | target;

      registers.write(pc, offset);
      break;
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

      registers.write(pc, offset);
      registers.write(ra, pc);
      break;
    case 'jr':
      rs = nameToRegisterMap[instruction[1]];
      pc = nameToRegisterMap["$pc"];

      result = ToUint32(registers.read(rs));

      registers.write(pc, result);
      break;
    case 'nop':
      break;
    case 'sw':
      rt = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      offset = instruction[3];

      start_address = ToUint32(registers.read(rs)) + ToUint32(offset);
      value = ToUint32(registers.read(rt));

      // From most to least significant
      byte_1 = (value >>> 24) & 0xFF;
      byte_2 = (value >>> 16) & 0xFF;
      byte_3 = (value >>> 8) & 0xFF;
      byte_4 = value & 0xFF;

      memory.write(start_address, byte_1);
      memory.write(start_address + 1, byte_2);
      memory.write(start_address + 2, byte_3);
      memory.write(start_address + 3, byte_4);

      break;
    case 'sh':
      rt = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      offset = instruction[3];

      start_address = ToUint32(registers.read(rs)) + ToUint32(offset);
      value = ToUint32(registers.read(rt));

      // From most to least significant
      byte_1 = (value >>> 8) & 0xFF;
      byte_2 = value & 0xFF;

      memory.write(start_address, byte_1);
      memory.write(start_address + 1, byte_2);

      break;
    case 'sb':
      rt = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      offset = instruction[3];

      start_address = ToUint32(registers.read(rs)) + ToUint32(offset);
      value = ToUint32(registers.read(rt));

      // From most to least significant
      byte_1 = value & 0xFF;

      memory.write(start_address, byte_1);

      break;
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

      registers.write(rt, value);
      break;
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

      registers.write(rt, value);
      break;
    case 'lb':
      rt = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      offset = instruction[3];

      start_address = ToUint32(registers.read(rs)) + ToUint32(offset);

      // From most to least significant
      byte_1 = memory.read(start_address);

      value = byte_1;

      registers.write(rt, value);
      break;
    case 'lui':
      rt = nameToRegisterMap[instruction[1]];
      imm = instruction[2];
      value = imm << 16;
      registers.write(rt, value);
      break;
    default:
      // invalid/unsupported instruction passed in
      return;
  }
}

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
  "$ra" : 0x1f
};
