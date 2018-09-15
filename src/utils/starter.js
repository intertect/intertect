/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

function main(instruction) {
  switch(instruction.arg) {
    case 'add':
      var result = registers.read(instruction.rs) + registers.read(instruction.rt);
      registers.write(instruction.rd, result);
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
