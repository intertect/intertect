function ToUint32(x) {
  return parseInt(x) % Math.pow(2, 32);
}

function execute(instruction, registers) {
  switch(instruction[0]) {
    case 'add':
      var rd = nameToRegisterMap[instruction[1]];
      var rs = nameToRegisterMap[instruction[2]];
      var rt = nameToRegisterMap[instruction[3]];
      var result = ToUint32(registers.read(rs) + registers.read(rt));
      registers.write(rd, result);
      break;
    case 'addu':
      // TODO
      break;
    case 'sub':
      // TODO
      break;
    case 'subu':
      // TODO
      break;
    case 'and':
      // TODO
      break;
    case 'or':
      // TODO
      break;
    case 'nor':
      // TODO
      break;
    case 'xor':
      // TODO
      break;
    case 'sll':
      // TODO
      break;
    case 'srl':
      // TODO
      break;
    case 'sra':
      // TODO
      break;
    case 'jr':
      // TODO
      break;
    case 'addi':
      // TODO
      break;
    case 'addiu':
      // TODO
      break;
    case 'andi':
      // TODO
      break;
    case 'ori':
      // TODO
      break;
    case 'xori':
      // TODO
      break;
    case 'lbu':
      // TODO
      break;
    case 'lhu':
      // TODO
      break;
    case 'lw':
      // TODO
      break;
    case 'lui':
      // TODO
      break;
    case 'sb':
      // TODO
      break;
    case 'sh':
      // TODO
      break;
    case 'sw':
      // TODO
      break;
    case 'jr':
      // TODO
      break;
    case 'beq':
      // TODO
      break;
    case 'j':
      // TODO
      break;
    case 'jal':
      // TODO
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

