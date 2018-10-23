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

function IF(latches, registers, memory) {
  var location = registers.read(nameToRegisterMap["$pc"]);

  var byte_1 = memory.read(location);
  var byte_2 = memory.read(location + 1);
  var byte_3 = memory.read(location + 2);
  var byte_4 = memory.read(location + 3);

  var binary = byte_4;
  binary |= byte_3 << 8;
  binary |= byte_2 << 16;
  binary |= byte_1 << 24;
  binary = ToUint32(binary);

  if (binary == 0xFAFAFAFA) {
    latches.term_if = true;
  } else {
    latches.if_id = binary;
  }
}

function ID(latches, registers, memory) {
  var binary = latches.if_id;
  var opcode = binary >>> 26;

  // All R (register) binarys start with 0s
  var rs, rt, rd;
  var op_str;

  var pc, pc_val, result;
  var instruction;

  if (opcode == 0x0) {
    rs = binary >>> 21 & 0x1f
    rt = binary >>> 16 & 0x1f
    rd = binary >>> 11 & 0x1f
    var shamt = binary >>> 6 & 0x1f
    var funct = binary & 0x3f

    op_str = functMap[funct];

    switch(op_str) {
      case 'jr':
        pc = nameToRegisterMap["$pc"];
        position = pc;
        result = ToUint32(registers.read(rs));
        registers.write(position, result)
        break;
      default:
        instruction = {
          "op_str" : op_str,
          "rs" : rs,
          "rt" : rt,
          "rd" : rd,
          "shamt" : shamt
        }
        break;
    }
  }

  else if (opcode == 0x2 || opcode == 0x3) {
    // J format: oooooott ttttttt tttttttt tttttttt
    var target = (binary & 0x3FFFFFF) << 2;

    op_str = opcode == 0x2 ? "j" : "jal";
    position = nameToRegisterMap["$pc"];
    switch(op_str) {
      case 'j':
        pc = nameToRegisterMap["$pc"];
        // Lop off the two top bits
        target &= 0x3FFFFFFF;

        pc_val = ToUint32(registers.read(pc));
        // Keep only the top two bits
        pc_val &= 0xC0000000;

        result = pc_val | target;
        registers.write(position, result)
        break;
      case 'jal':
        pc = nameToRegisterMap["$pc"];
        ra = nameToRegisterMap["$ra"];
        // Lop off the two top bits
        target &= 0x3FFFFFFF;

        pc_val = ToUint32(registers.read(pc));

        result = (pc_val & 0xC0000000) | target;

        registers.write(position, result)
        registers.write(ra, pc_val + 8);
        break;
      default:
        break;
    }
  }

  else {
    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    rs = (binary >>> 21) & 0x1F;
    rt = (binary >>> 16) & 0x1F;
    var imm = SignExtend16(binary & 0xFFFF);

    op_str = opcodeMap[opcode];
    switch(op_str) {
      case 'beq':
        if (registers.read(rs) == registers.read(rt)) {
          pc = nameToRegisterMap["$pc"];
          var target = imm << 2;

          position = pc;
          result = ToUint32(registers.read(pc) + target + 4);
          registers.write(position, result)
        }
        break;
      default:
        instruction = {
          "op_str" : op_str,
          "rs" : rs,
          "rt" : rt,
          "imm" : imm
        }
        break;
    }
  }

  latches.id_ex = instruction;
}

function EX(latches, registers, memory) {
  var instruction = latches.id_ex;

  // All R (register) instructions start with 0s
  var rs, rt, rd;
  var op_str = instruction["op_str"];

  var pc, pc_val, result;
  var ra;

  var r_ops = ['addu', 'subu', 'and', 'or', 'xor', 'sll', 'srl', 'sra'];
  var i_ops = ['addiu', 'andi', 'ori', 'xori', 'sw', 'sh', 'sb', 'lw', 'lh', 'lb'];

  var location, position, result, memory_address;
  var writeInfo;

  if (r_ops.indexOf(op_str) != -1) {
    rs = instruction["rs"]
    rt = instruction["rt"]
    rd = instruction["rd"]
    var shamt = instruction["shamt"]

    location = "registers";
    position = rd;
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
      default:
        break;
    }
  }

  else if (i_ops.indexOf(op_str) != -1) {
    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    rs = instruction["rs"]
    rt = instruction["rt"]
    var imm = instruction["imm"]

    // used in store/load instructions
    memory_address = ToUint32(registers.read(rs)) + ToUint32(imm);
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
      default:
        break;
    }
  }

  latches.ex_mem = {
    "instruction": instruction, // for instructions to execute in MEM stage
    "memory_address": memory_address, // only relevant for load/stores
    "result": result,
    "location": location,
    "position": position
  }
}

function MEM(latches, registers, memory) {
  var instruction = latches.ex_mem["instruction"];
  var memory_address = latches.ex_mem["memory_address"];

  var result = latches.ex_mem["result"];
  var location = latches.ex_mem["location"];
  var position = latches.ex_mem["position"];

  var mem_ops = ['sw', 'sh', 'sb', 'lw', 'lh', 'lb'];

  // All R (register) instructions start with 0s
  var rs, rt, rd;
  var op_str = instruction["op_str"];

  var pc, result;

  if (mem_ops.indexOf(op_str) != -1) {
    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    rs = instruction["rs"]
    rt = instruction["rt"]
    var imm = instruction["imm"]

    // used in store/load instructions
    var byte_1, byte_2, byte_3, byte_4;
    var value;

    switch(op_str) {
      case 'sw':
        value = ToUint32(registers.read(rt));

        byte_1 = (value >>> 24) & 0xFF;
        byte_2 = (value >>> 16) & 0xFF;
        byte_3 = (value >>> 8) & 0xFF;
        byte_4 = value & 0xFF;

        location = "memory";
        position = memory_address;
        result = [byte_1, byte_2, byte_3, byte_4]
        break;
      case 'sh':
        value = ToUint32(registers.read(rt));

        byte_1 = (value >>> 8) & 0xFF;
        byte_2 = value & 0xFF;

        location = "memory";
        position = memory_address;
        result = [byte_1, byte_2]
        break;
      case 'sb':
        value = ToUint32(registers.read(rt));
        byte_1 = value & 0xFF;

        location = "memory";
        position = memory_address;
        result = [byte_1]
        break;
      case 'lw':
        byte_1 = memory.read(memory_address);
        byte_2 = memory.read(memory_address + 1);
        byte_3 = memory.read(memory_address + 2);
        byte_4 = memory.read(memory_address + 3);

        result = byte_4;
        result |= byte_3 << 8;
        result |= byte_2 << 16;
        result |= byte_1 << 24;

        location = "registers";
        position = rt;
        break;
      case 'lh':
        byte_1 = memory.read(memory_address);
        byte_2 = memory.read(memory_address + 1);

        result = byte_2;
        result |= byte_1 << 8;

        location = "registers";
        position = rt;
        console.log(result)
        break;
      case 'lb':
        byte_1 = memory.read(memory_address);
        result = byte_1;
        location = "registers";
        position = rt;
        break;
      default:
        break;
    }
  }

  if (location == "memory") {
    for (var i = 0; i < result.length; i++) {
      memory.write(position + i, result[i]);
    }
  }

  latches.mem_wb = {
    "result": result,
    "location": location,
    "position": position
  }
}

function WB(latches, registers, memory) {
  if (latches.mem_wb["location"] == "registers") {
    registers.write(latches.mem_wb["position"], latches.mem_wb["result"])
  }
}

export function solution(latches, registers, memory) {
  if (latches.mem_wb != undefined) {
    WB(latches, registers, memory);
    latches.mem_wb = undefined;
  }

  if (latches.ex_mem != undefined) {
    MEM(latches, registers, memory);
    latches.ex_mem = undefined;
  }

  if (latches.id_ex != undefined)  {
    EX(latches, registers, memory);
    latches.id_ex = undefined;
  }

  if (latches.if_id != undefined)  {
    ID(latches, registers, memory);
    latches.if_id = undefined;
  }

  if (!latches.term_if) {
    IF(latches, registers, memory);
  }
}

var functMap = {
  0x21: "addu",
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
