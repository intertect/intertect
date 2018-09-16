export class Memory {
  // Memory as a map for simplicity. This is not optimized in the slightest.
  // However, this should be fine if memory remains small
  constructor() {
    this.memory_ = {};
  }

  read(addr) {
    return this.memory_[addr];
  }

  write(addr, value) {
    this.memory_[addr] = value;
  }
}

export var nameToRegisterMap = {
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

export class Registers {
  // Registers as a map for simplicity. Definitely fast enough
  constructor() {
    this.registers_ = {};
    this.reset();
  }

  reset() {
    this.registers_ = {
      0x0: 0,
      0x1: 0,
      0x2: 0,
      0x3: 0,
      0x4: 0,
      0x5: 0,
      0x6: 0,
      0x7: 0,
      0x8: 0,
      0x9: 0,
      0xa: 0,
      0xb: 0,
      0xc: 0,
      0xd: 0,
      0xe: 0,
      0xf: 0,
      0x10: 0,
      0x11: 0,
      0x12: 0,
      0x13: 0,
      0x14: 0,
      0x15: 0,
      0x16: 0,
      0x17: 0,
      0x18: 0,
      0x19: 0,
      0x1a: 0,
      0x1b: 0,
      0x1c: 0,
      0x1d: 0,
      0x1e: 0,
      0x1f: 0
    }
  }

  read(register) {
    if (register > 31 || register < 0) {
      // TODO: Should also signal an error in the interface
      return
    }

    return this.registers_[register];
  }

  write(register, value) {
    if (register > 31 || register < 0) {
      // TODO: Should also signal an error in the interface
      return
    }

    this.registers_[register] = value;
  }

  // expects to receive information in the format of init, i.e. $t1=3
  load(registerValueSets) {
    var splitRegisterValueSets = registerValueSets.split("\n")
    var registers = Object.keys(this.registers_);
    for (var i = 0; i < splitRegisterValueSets.length; i++) {
      var registerValueSet = splitRegisterValueSets[i];
      var registerPair = registerValueSet.split("=");
      var registerBinary = nameToRegisterMap[registerPair[0]];
      if (!this.registers_.hasOwnProperty(registerBinary)) return;
      this.registers_[registerBinary] = parseInt(registerPair[1]);
    }
  }

  compareRegisters(other) {
    if (this.registers_.size !== other.registers_.size) {
        return false;
    }
    var registers = Object.keys(this.registers_);
    for (var i = 0; i < registers.length; i++) {
      if (this.registers_[registers[i]] != other.registers_[registers[i]]) {
        console.log("Sorry, incorrect for register: " + registers[i]);
        return false;
      }
    }
    return true;
  }
}
