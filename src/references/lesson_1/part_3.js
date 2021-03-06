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


export function solution(instruction, registers, memory, globals) {
  var rd, rs, rt;
  var shamt;
  var result;
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
    case 'nor':
      rd = nameToRegisterMap[instruction[1]];
      rs = nameToRegisterMap[instruction[2]];
      rt = nameToRegisterMap[instruction[3]];
      result = ToUint32(!(registers.read(rs) | registers.read(rt)));
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
