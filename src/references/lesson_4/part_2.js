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

function fetch(registers, memory) {
  var location = registers.read(nameToRegisterMap["$pc"]);

  var byte_1 = memory.read(location);
  var byte_2 = memory.read(location + 1);
  var byte_3 = memory.read(location + 2);
  var byte_4 = memory.read(location + 3);

  var binary = byte_4;
  binary |= byte_3 << 8;
  binary |= byte_2 << 16;
  binary |= byte_1 << 24;

  return binary;
}

function decode(binary) {
  var opcode = binary >>> 26;

  // All R (register) binarys start with 0s
  var rs, rt, rd;
  var op_str;

  var pc, pc_val, result;
  var instruction;

  if (opcode == 0x0) {
    // TODO: Fill this area
    rs = binary >>> 21 & 0x1f
    rt = binary >>> 16 & 0x1f
    rd = binary >>> 11 & 0x1f
    var shamt = binary >>> 6 & 0x1f
    var funct = binary & 0x3f

    op_str = functMap[funct];
    instruction = {
      "op_str" : op_str,
      "rs" : rs,
      "rt" : rt,
      "rd" : rd,
      "shamt" : shamt
    }
  }

  else if (opcode == 0x2 || opcode == 0x3) {
    // J format: oooooott ttttttt tttttttt tttttttt
    var target = (binary & 0x3FFFFFF) << 2;

    op_str = opcode == 0x2 ? "j" : "jal";
    instruction = {
      "op_str" : op_str,
      "target" : target
    }
  }

  else {
    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    rs = (binary >>> 21) & 0x1F;
    rt = (binary >>> 16) & 0x1F;
    var imm = (binary >>> 0) & 0xFFFF;

    op_str = opcodeMap[opcode];
    instruction = {
      "op_str" : op_str,
      "rs" : rs,
      "rt" : rt,
      "imm" : imm
    }
  }

  return instruction;
}

function execute(instruction, registers, memory) {
  // All R (register) instructions start with 0s
  var rs, rt, rd;
  var op_str = instruction["op_str"];

  var pc, pc_val, result;
  var ra;

  var r_ops = ['addu', 'subu', 'and', 'or', 'xor', 'sll', 'srl', 'sra', 'jr'];
  var j_ops = ['j', 'jal'];
  var i_ops = ['addiu', 'andi', 'ori', 'xori', 'beq'];

  var location, position, result;
  var writeInfo;

  if (r_ops.indexOf(op_str) != -1) {
    rs = instruction["rs"]
    rt = instruction["rt"]
    rd = instruction["rd"]
    var shamt = instruction["shamt"]

    location = "registers";
    position = rd; // holds for everything but jr
    switch(op_str) {
      case 'addu':
        result = ToUint32(registers.read(rs) + registers.read(rt));
        break;
      case 'subu':
        result = ToUint32(registers.read(rs) - registers.read(rt));
        break;
      case 'and':
        result = ToUint32(registers.read(rs) & registers.read(rd));
        break;
      case 'or':
        result = ToUint32(registers.read(rs) | registers.read(rd));
        break;
      case 'xor':
        result = ToUint32(registers.read(rs) ^ registers.read(rd));
        break;
      case 'sll':
        result = ToUint32(registers.read(rs) << registers.read(rd));
        break;
      case 'srl':
        result = ToUint32(registers.read(rs) >>> registers.read(rd));
        break;
      case 'sra':
        result = ToUint32(registers.read(rs) >> registers.read(rd));
        break;
      case 'jr':
        pc = nameToRegisterMap["$pc"];
        position = pc;
        result = ToUint32(registers.read(rs));
        break;
      default:
        break;
    }
  }

  else if (j_ops.indexOf(op_str) != -1) {
    // J format: oooooott ttttttt tttttttt tttttttt
    var target = instruction["target"]

    location = "registers";
    position = pc;
    switch(op_str) {
      case 'j':
        pc = nameToRegisterMap["$pc"];
        // Lop off the two top bits
        target &= 0x3FFFFFFF;

        pc_val = ToUint32(registers.read(pc));
        // Keep only the top two bits
        pc_val &= 0xC0000000;

        result = pc_val | target;

        break;
      case 'jal':
        pc = nameToRegisterMap["$pc"];
        ra = nameToRegisterMap["$ra"];
        // Lop off the two top bits
        target &= 0x3FFFFFFF;

        pc_val = ToUint32(registers.read(pc));

        result = (pc_val & 0xC0000000) | target;

        registers.write(ra, pc_val + 8);
        break;
      default:
        break;
    }
  }

  else {
    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    rs = instruction["rs"]
    rt = instruction["rt"]
    var imm = instruction["imm"]

    // used in store/load instructions
    var start_address = ToUint32(registers.read(rs)) + ToUint32(imm);
    var byte_1, byte_2, byte_3, byte_4;
    var value;

    switch(op_str) {
      case 'addiu':
        location = "registers";
        position = rt;
        result = registers.read(rs) + SignExtend16(imm);
        break;
      case 'andi':
        location = "registers";
        position = rt;
        result = ToUint32(registers.read(rs) & imm);
        break;
      case 'ori':
        location = "registers";
        position = rt;
        result = ToUint32(registers.read(rs) | imm);
        break;
      case 'xori':
        location = "registers";
        position = rt;
        result = ToUint32(registers.read(rs) ^ imm);
        break;
      case 'beq':
        if (registers.read(rs) == registers.read(rt)) {
          pc = nameToRegisterMap["$pc"];
          target = imm << 2;

          location = "registers";
          position = pc;
          result = ToUint32(registers.read(pc) + target + 4);
        }
        break;
      case 'sw':
        value = ToUint32(registers.read(rt));

        byte_1 = (value >>> 24) & 0xFF;
        byte_2 = (value >>> 16) & 0xFF;
        byte_3 = (value >>> 8) & 0xFF;
        byte_4 = value & 0xFF;

        location = "memory";
        position = start_address;
        result = [byte_1, byte_2, byte_3, byte_4]
        break;
      case 'sh':
        value = ToUint32(registers.read(rt));

        byte_1 = (value >>> 8) & 0xFF;
        byte_2 = value & 0xFF;

        location = "memory";
        position = start_address;
        result = [byte_1, byte_2]
        break;
      case 'sb':
        value = ToUint32(registers.read(rt));
        byte_1 = value & 0xFF;

        location = "memory";
        position = start_address;
        result = [byte_1]
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

        location = "registers";
        position = rt;
        break;
      case 'lh':
        byte_1 = memory.read(start_address);
        byte_2 = memory.read(start_address + 1);

        result = byte_2;
        result |= byte_1 << 8;

        location = "registers";
        position = rt;
        break;
      case 'lb':
        byte_1 = memory.read(start_address);
        result = byte_1;
        location = "registers";
        position = rt;
        break;
      default:
        break;
    }
  }

  return {
    "result": result,
    "location": location,
    "position": position
  }
}

function write(registers, memory, writeInfo) {
  if (writeInfo["location"] == "memory") {
    for (var i = 0; i < writeInfo["result"].length; i++) {
      memory.write(writeInfo["position"] + i, writeInfo["result"][i]);
    }
  } else {
    registers.write(writeInfo["position"], writeInfo["result"])
  }
}

export function solution(registers, memory, pipeline) {
  var binary, instruction, writeInfo;
  past_binary = pipeline[0];
  past_instruction = pipeline[1];
  past_writeInfo = pipeline[2];

  var new_binary = fetch(registers, memory);
  if (past_binary != undefined) {
    var new_instruction = decode(past_binary);
  }
  if (past_instruction != undefined) {
    var new_writeInfo = execute(past_instruction, registers, memory);
  }
  if (past_writeInfo != undefined) {
    write(registers, memory, past_writeInfo);
  }
  return [new_binary, new_instruction, new_writeInfo]
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
  0x20: "lb",
  0x21: "lh",
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
