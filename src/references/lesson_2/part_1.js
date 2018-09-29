function ToUint32(x) {
  return parseInt(x) % Math.pow(2, 32);
}

export function solution(instruction, registers) {
  var opcode = parseInt(instruction.substr(0,6), 2);

  // All R (register) instructions start with 0s
  var rs, rt, rd;
  var op_str;

  if (opcode == 0x0) {
    // TODO: Fill this area
    rs = parseInt(instruction.substr(6,5),2);
    rt = parseInt(instruction.substr(11,5),2);
    rd = parseInt(instruction.substr(16,5),2);
    var shamt = parseInt(instruction.substr(21,5),2);
    var funct = parseInt(instruction.substr(26,6),2);

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
      default:
        break;
    }
  }

  // J isntructions case
  // TODO: Fill this condition
  else if (true) {
    // J format: oooooott ttttttt tttttttt tttttttt
    // TODO: Fill this area
  }

  // I instructions case
  else {
    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    // TODO: Fill this area
  }
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
