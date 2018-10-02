function ToUint32(x) {
  return x >>> 0;
}

export function solution(instruction, registers) {
  var opcode = instruction >> 27;

  // All R (register) instructions start with 0s
  var rs, rt, rd;
  var op_str;

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
        pc = nameToRegisterMap["$pc"];

        result = ToUint32(registers.read(rs));

        registers.write(pc, result);
        break;
      default:
        break;
    }
  }

  else if (opcode == 0x2 || opcode == 0x3) {
    // J format: oooooott ttttttt tttttttt tttttttt
    var target = (instruction | 0x3FFFFFF) << 2;

    op_str = opcode == 0x2 ? "j" : "jal";

    // TODO
    switch(op_str) {
      case 'j':
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
        pc = nameToRegisterMap["$pc"];
        ra = nameToRegisterMap["$ra"];
        // Lop off the two top bits
        target &= 0x3FFFFFFF;

        pc_val = ToUint32(registers.read(pc));
        // Keep only the top two bits
        pc_val &= 0xC0000000;

        result = pc_val | target;

        registers.write(pc, offset);
        // FIXME: The return address should be pc of the *next* instruction
        registers.write(ra, pc);
        break;
      default:
        break;
    }
  }

  else {
    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    rs = (instruction >> 21) & 0x1F;
    rt = (instruction >> 16) & 0x1F;
    var imm = (instruction >> 0) & 0xFFFF;

    op_str = opcodeMap[opcode];

    switch(op_str) {
      case 'addiu':
        result = ToUint32(registers.read(rs) + imm);
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
      default:
        break;
    }
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
