/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

// unsure about LUI immediate and labels

// formatted version from http://www2.engr.arizona.edu/~ece369/Resources/spim/MIPSReference.pdf
const functToNameFormat = {
  "100000": ["add", "ArithLog"],
  "100001": ["addu", "ArithLog"],
  "100010": ["sub", "ArithLog"],
  "100011": ["subu", "ArithLog"],
  "100100": ["and", "ArithLog"],
  "100101": ["or", "ArithLog"],
  "100111": ["nor", "ArithLog"],
  "100110": ["xor", "ArithLog"],
  "000000": ["sll", "Shift"],
  "000010": ["srl", "Shift"],
  "000011": ["sra", "Shift"],
  "001000": ["jr", "JumpR"],
}

const opcodeToNameFormat = {
  "001000": ["addi", "ArithLogI"],
  "001001": ["addiu", "ArithLogI"],
  "001100": ["andi", "ArithLogI"],
  "001101": ["ori", "ArithLogI"],
  "001110": ["xori", "ArithLogI"],
  "100100": ["lbu", "LoadStore"],
  "100101": ["lhu", "LoadStore"],
  "100011": ["lw", "LoadStore"],
  "001111": ["lui", "LoadImm"],
  "101000": ["sb", "LoadStore"],
  "101001": ["sh", "LoadStore"],
  "101011": ["sw", "LoadStore"],
  "000100": ["beq", "Branch"],

  "000010": ["j", "Jump"],
  "000011": ["jal", "Jump"]
}

const styleToFormatter = {
  "ArithLog": (opname, rd, rs, rt) => `${opname} $${rd} $${rs} $${rt}`,
  "Shift": (opname, rd, rt, shamt) => `${opname} $${rd} $${rt} ${shamt}`,
  "JumpR": (opname, rs) => `${opname} $${rs}`,

  "ArithLogI": (opname, rt, rs, i) => `${opname} $${rt} $${rs} ${i}`,
  "LoadImm": (opname, rt, imm) => `${opname} $${rt} ${imm}`,
  "Branch": (opname, rs, rt, label) => `${opname} $${rs} $${rt} ${label}`,
  "LoadStore": (opname, rt, rs) => `${opname} $${rt} i($${rs})`,

  "Jump": (opname, label) => `${opname} ${label}`
}

/* We assume the inputs will be decimal numbers that are to be converted to
decimal to understand their underlying meaning */
export function disassembleMips(decimalOperations) {
  var binaryOperation = "";
  decimalOperations.forEach(function(el) {
    var nextSegment = el.toString(2);
    nextSegment = "00000000".substr(0, 8 - nextSegment.length) + nextSegment;
    binaryOperation += nextSegment;
  });

  var opcode = binaryOperation.slice(0,6);

  var opname, formatter;
  var rs, rt, i;

  if (opcode == "000000") {
    // R format: 000000ss sssttttt dddddaaa aaffffff
    rs    = binaryOperation.slice(6,11);
    rt    = binaryOperation.slice(11,16);
    var rd    = binaryOperation.slice(16,21);
    var shamt = binaryOperation.slice(21,26);
    var funct = binaryOperation.slice(26,32);

    // funct is unique identifier for R instructions
    [opname, formatter] = functToNameFormat[funct];
    switch(formatter) {
      case "ArithLog":
        return styleToFormatter[formatter](opname, rd, rs, rt);
      case "Shift":
        return styleToFormatter[formatter](opname, rd, rt, shamt);
      case "JumpR":
        return styleToFormatter[formatter](opname, rs);
      default:
        return;
    }
  }

  // only support j and jal J (jump) instructions
  else if (opcode == "000010" || opcode == "000011") {
    // I format: ooooooss sssttttt iiiiiiii iiiiiiii
    rs = binaryOperation.slice(6,11);
    rt = binaryOperation.slice(11,16);
    i  = binaryOperation.slice(16,32);

    [opname, formatter] = opcodeToNameFormat[opcode];
    switch(formatter) {
      case "ArithLogI":
        return styleToFormatter[formatter](opname, rt, rs, i);
      case "Branch":
        return styleToFormatter[formatter](opname, rs, rt, label);
      case "LoadStore":
        return styleToFormatter[formatter](opname, rt, rs);
      default:
        return;
    }
  }

  // all others are I (immediate) instructions
  else {
    // J format: ooooooii iiiiiiii iiiiiiii iiiiiiii
    rs = binaryOperation.slice(6,11);
    i  = binaryOperation.slice(11,32);

    var label = i >> 2;

    [opname, formatter] = opcodeToNameFormat[opcode];
    switch(formatter) {
      case "Jump":
        return styleToFormatter[formatter](opname, label);
      default:
        return;
    }
  }
}
