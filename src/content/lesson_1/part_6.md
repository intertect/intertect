# Part 6: Memory!
Up until now, we've been executing instructions and keeping their results in
registers.  However, in real programs we deal with main memory (RAM) since the
combined capacity of all the registers in our machine is 124 bytes (since the
zero register can't hold any value besides zero).

The instructions in the MIPS architecture (and other RISC architectures) only
operate on data that is stored in registers, so the only job for memory
instructions is to read data from memory or write data back to memory.  This
section will be straightforward since once you've gotten one of the operations,
the rest of them are quite similar.

# Code Structure
The way loads are stores are written is somewhat different from other
instructions.  Instead of coming last, the immediate operand comes before the
second register value, which is surrounded in parentheses.  The way to read a
load or store (e.g. `lw $rt, 0x10($rs)`) is "Load a word (32 bits) from the
address `$rs` + 0x10 and store that value in $rt".

The purpose of the offset from the register value is to implement data
structures!  We won't deal with those here but in a C-style struct, the offsets
of the members are known at compile time.  This means that the compiler can
hard-code the offsets in the immediate operands of loads and store, while using
a register to keep track of where in memory the struct began.

In order to implement the loads and stores, you will have to read the address
out of `rs`, sign-extend the offset (since it's a number), and add them to get
the address to read from.

Let us look at an example of a store.  We'll assume that we're storing the value
`0xDEADBEEF` to address `0x10`.  We also assume that memory is initialized to 0
to begin with.  Note that, as we explain further below, we assume a big-endian
architecture here. If you don't know what that means or want to learn more about 
it, click [`here`](#endian)!

The value in the register looks like this:

| 0x0 | 0x1 | 0x2 | 0x3 |
|------|------|------|------|
| 0xDE | 0xAD | 0xBE | 0xEF |

We start by writing to the first byte after the address and then write
subsequent bytes to subsequent addresses:

| 0x10 | 0x14 | 0x18 | 0x1C |
|------|------|------|------|
| 0xDE | 0x0 | 0x0 | 0x0 |

And the next byte

| 0x10 | 0x14 | 0x18 | 0x1C |
|------|------|------|------|
| 0xDE | 0xAD | 0x0 | 0x0 |

etc.

| 0x10 | 0x14 | 0x18 | 0x1C |
|------|------|------|------|
| 0xDE | 0xAD | 0xBE | 0x0 |

etc.

| 0x10 | 0x14 | 0x18 | 0x1C |
|------|------|------|------|
| 0xDE | 0xAD | 0xBE | 0xEF |

All other store operations work the same way, but with different number of bytes
to write.

Things will be slightly more complicated for `lhu`, `lbu`, `sh`, `sb`.  These
instructions operate on half-words (2 bytes) and single bytes respectively.  The
load instructions end in a `u` since they are unsigned; this means that you
should zero-extend the read values rather than sign-extend them.  The only
difficulties with these instructions is making sure you're operating on the
correct number of bytes.

For `lhu`, you must read two bytes starting at the address you just calculated
and zero-extend them to 32 bits before storing them in the low-order 16 bits of
the register (there should be 16 bits of 0s at the top).

`lb` is the same but you read only a single byte.

`sh` must store only the lower 16 bytes of `rt` at the two bytes starting with
the calculated address.

`sb` is the same but only stores 1.

# Your Task
You task in this part is to implement the following instructions:

1. [`sb`](#sb)
2. [`sh`](#sh)
3. [`sw`](#sw)
4. [`lb`](#lb)
5. [`lh`](#lh)
6. [`lw`](#lw)
7. [`lui`](#lui)

Storing and loading from memory is quite different from the operations we have 
dealt with thus far, so read below to understand how exactly memory addressing works 
in our case!

## Addressing
In order to read/write a given number of bytes from/to memory, you're going to
have to know which addresses to read.  The simplest read/write is of a byte (8
bits).  The address to read is simply the address given in the instruction.  For
half-words (two bytes) and words (four bytes), you will need to read the address
given in memory as well as the next 2 or 4 bytes respectively.  Sounds simple
enough, right?  Thankfully it is, but endianness can make this more complicated.

<a id="endian"></a>
## Endianness
When a computer writes bytes into memory, it has to decide what order it wants
to write them in.  For example, if you have the word `0xDEADBEEF`, should the
bytes be written as:

| address | 0x0 | 0x1 | 0x2 | 0x3 |
|---------|------|------|------|------|
| value | 0xDE | 0xAD | 0xBE | 0xEF |

Or perhaps like:

| address | 0x0 | 0x1 | 0x2 | 0x3 |
|---------|------|------|------|------|
| value | 0xEF | 0xBE | 0xAD | 0xDE |

The first one is called "Big-Endian" while the second one is called
"Little-Endian". "Big-Endian" means the bytes are written such that the most
significant byte is in the lowest address, while "Little-Endian" means the bytes
are written such that the most significant byte is in the largest address.
There is logic to both of these, and one is not inherently better than the
other.

If you're curious, these names come from *Gulliver's Travels* where there was an
island where one tribe cracked eggs on the big end and the other cracked them on
the small end.  They went to war over this.

MIPS can be either big- or little-endian and is either set by the processor
itself or customized by the operator, but once it has booted, the endianness
cannot change.  We have decided to use big-endian for these lessons because we
think it's mildly easier to learn.  If you want to learn more, the Wikipedia
page on [Endianness](https://en.wikipedia.org/wiki/Endianness) is fantastic.

---
## The MIPS Instruction Set

<a id="addu"></a>
### Add Unsigned (`addu $rd, $rs, $rt`)

`$rd = $rs + $rt`

Take the unsigned integer values from `$rs` and `$rt`, perform an unsigned add
on them, and save the result into `$rd`.  An unsigned add means that on
overflow, the result wraps back around to 0.

There is also an `add` instruction that performs a signed add, but we're not
having you implement that.  If you're curious, the "signed" add means that the
processor throws an error when there would be an overflow.  What happens is that
the processor detects the case and signals to the operating system that
something went wrong.  Since there isn't going to be an operating system here,
there wasn't a point to having you implement this instruction.

<a id="addiu"></a>
### Add Immediate Unsigned (`addiu $rt, $rs, imm`)

`$rt = $rt + imm`

Take the unsigned integer values from `$rs` and `imm` (which is stored in the
instruction), perform an unsigned add on them, and write the value to `$rt`.

<a id="subu"></a>
### Subtract Unsigned (`subu $rd, $rs, $rt`)

`$rd = $rs - $rt`

Take the unsigned integer values from `$rs` and `$rt`, perform an unsigned
subtraction on them, and save the result into `$rd`.  See the above explanation
for [addu](#addu) for more information about unsigned vs signed operations.

<a id="and"></a>
### And (`and $rd, $rs, $rt`)

`$rd = $rs & $rt`

Perform a bitwise logical AND between `$rs` and `$rt`, saving the result into
`$rd`.

<a id="andi"></a>
### And Immediate (`andi $rt, $rs, imm`)

`$rt = $rs & ZeroExt(imm)`

Perform a bitwise logical AND between `$rs` and a zero-extended `imm`, saving
the result into `$rt`.

<a id="or"></a>
### Or (`or $rd, $rs, $rt`)

`$rd = $rs | $rt`

Perform a bitwise logical OR between `$rs` and `$rt`, saving the value into
`$rd`.

<a id="ori"></a>
### Or Immediate (`ori $rt, $rs, imm`)

`$rt = $rs | ZeroExt(imm)`

Perform a bitwise logical OR between `$rs` and a zero-extended `imm`, saving the
result into `$rt`.

<a id="nor"></a>
### Nor (`nor $rd, $rs, $rt`)

`$rd = ~($rs | $rt)`

Perform a bitwise logical NOR between `$rs` and `$rt` which is the same as
taking the bitwise logical OR and then negating it, saving the result into
`$rd`.

<a id="xor"></a>
### Xor (`xor $rd, $rs, $rt`)

`$rd = $rs ^ $rt`

Perform a bitwise logical XOR between `$rs` and `$rt`, saving the result into
`$rd`.

<a id="xori"></a>
### Xor Immediate (`xori`)

`$rd = $rs ^ ZeroExt(imm)`

Perform a bitwise logical XOR between `$rs` and `imm` (which has been padded to
the left with 0), saving the result into `$rt`

<a id="sll"></a>
### Shift Left Logical (`sll $rt, $rs, shamt`)

`$rt = $rs << shamt`

Perform a logical shift left of `$rt` by `shamt` binary digits, saving the
result into `$rt`.  This is integer multiplication by 2.

<a id="srl"></a>
### Shift Right Logical (`srl $rt, $rs, shamt`)

`$rt = $rs >>> shamt`

Perform a logical right shift of `$rs` by `shamt` places, filling the vacated
places on the left with 0 and saving the result into `$rt`.

<a id="sra"></a>
### Shift Right Arithmetic (`sra $rt, $rs, shamt`)

`$rt = $rs >> shamt`

Perform an arithmetic right shift of `$rs` by `shamt` places, filling the
vacated places with 0 if the leading bit was 0 (number was positive), and 1 if
the leading place was one (number was negative).  This is integer division by 2
with rounding towards negative infinity.

<a id="beq"></a>
### Branch On Equal (`beq $rt, $rs, imm`)

if `$rs == $rt`, jump to the branch target.  The branch target is calculated as
follows: `$pc + 4 + imm << 2`.  In English, the branch target is `imm`
multiplied by 4 bytes after the address of the **next** instruction.

Since instructions are all 4 bytes in length, this can be thought of as `imm`
instructions after the instruction following the branch.

<a id="j"></a>
### Jump (`j imm`)

Unconditionally jump to the jump target.  The jump target is calculated by
taking the top 4 bytes of the address of the **next instruction** and adding
below that `imm` * 4.

<a id="jal"></a>
### Jump And Link (`jal imm`)

An unconditional branch like above, but the address of the next instruction is
saved into the `$ra` register.

<a id="jr"></a>
### Jump Register (`jr $rs`)

`$pc = $rs`

Jump to the address stored in `$rs`.

<a id="lbu"></a>
### Load Byte Unsigned (`lbu $rt, imm($rs)`)

Load a single byte from address `$rs + imm` into `$rt`.  An unsigned load means
that the top 24 bits of the register should be set to 0.  A signed load would
mean setting the top 24 bits to the top bit of the byte read.

<a id="lhu"></a>
### Load Halfword Unsigned (`lhu $t, imm($rs)`)

Load a halfword (2 bytes) from address `$rs + imm` into `$rt`.  The top 16 bits
will be 0.  The ordering of the bytes depends on the endianness of the
architecture.  The bytes read from memory go from most significant byte to least
significant.

<a id="lw"></a>
### Load Word (`lw`)

Load a word (4 bytes) from address `$rs + imm` into `$rt`. There is no
signed/unsigned distinction here since the read will fill the whole register.
The bytes read from memory go from most significant byte to least significant.

<a id="lui"></a>
### Load Upper Immediate (`lui $rt imm`)

`$rt = imm << 16`

Load the upper 16 bits of `$rt` with `imm`.  The bottom 16 bits of `$rt` will be
0.

<a id="sb"></a>
### Store Byte (`sb $rt, imm($rs)`)

Store the least significant byte of `$rt` into the address `imm + $rs`.

<a id="sh"></a>
### Store Halfword (`sh $rt, imm($rs)`)

Store the two least significant bytes of `$rt` into addresses starting with `imm
+ $rs`.  The bytes stored go from most to least significant.

<a id="sw"></a>
### Store Word (`sw $rt, imm($rs)`)

Store the four bytes of `$rt` into the addresses starting with `imm + $rs`.  The
bytes are stored from most significant to least significant.

<a id="noop"></a>
### No Operation (`noop`)

Do nothing.

Noop (also no-op, no op, nop, etc.) instructions are used when a region of
memory will be executed but the programmer doesn't want anything to happen.
They are used liberally in MIPS in the branch delay slot when nothing else will
fit.  They are also occasionally seen in buffer overrun attacks to make the
target calculation easier (as a "nop sled").

The most common noop instruction in MIPS is the all 0 instruction, although
anything that writes to the `$zero` register is a functional no-op.
