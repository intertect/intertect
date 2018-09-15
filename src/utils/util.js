function Memory() {
  // Memory as a map for simplicity. This is not optimized in the slightest.
  // However, this should be fine if memory remains small
  this.memory_ = {};

  this.read = function(addr) {
    return this.memory_[addr];
  }

  this.write = function(addr, value) {
    this.memory_[addr] = value;
  }
}

function RegisterFile() {
  // Registers as a map for simplicity. Definitely fast enough
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
    0x1f: 0,
  };

  this.read = function(register) {
    if (register > 31 || register < 0) {
      // TODO: Should also signal an error in the interface
      return
    }

    return this.registers_[register];
  }
}
