# Part 2: Heading Off On Your Own

In this lesson, you'll be implementing the [`subu`](#subu) instruction.  Each of
the parts in Lesson 1 will be adding to your code from previous ones, so by the
end, you'll have a complete MIPS emulator.

# Code Structure
Now that we've gotten through all that preliminary information, it's time for
you to understand the structure of the code that you will be writing.  The code
that we give you as a starting point is just a suggestion, and there are of
course many other ways to write this emulator, but we feel like this is the most
clear.

## Overview
Hopefully the structure of the code is clear to you now, but in case it isn't,
this is an explanation of the structure of the code we have given you.

The `instruction` variable which is passed into your `processMIPS` function
contains all the information you will need to perform the operation.  It is an
array of strings that is the space-delimited form of the assembly instruction currently
being executed (highlighted in the UI). This will be the case for all of Lesson 1,
but it will differ slightly in future lessons. Keep that in the back of your mind 
for when you have to adapt your code for future lessons! 

As an example, the assembly code line `addu $t5, $t0, $t0` would have the following
value passed in `instruction`: `["addu", "$t5", "$t0", "$t0"]`. In order to execute 
the code, the code simply enumerates each of the possible
operations, and then performs the necessary work for whichever particular
instruction it is.  This is the simplest way to write an emulator; while the
later lessons will deal with more and more complicated ideas, this basic
structure will remain the same for the most part.

## Registers
The `registers` variable contains an interface to the registers so you don't
have to implement this functionality yourself (and so that we can check your
work).  It provides a two-method interface: `registers.read(register)` and
`registers.write(register, value)`. Specifically:

- `registers.read(register)`: Returns the numeric value stored at that register. Note
that read takes in the **numeric** value of the register. So, trying to call
`registers.read("$t5")`, for example, will simply return `undefined`, since there's
no such value as `$t5` in the registers object: instead, it is `0xd`. To make this
conversion easier for you, `nameToRegisterMap` is provided, which gives the numeric value
associated with each register name. Make sure to use this whenever doing lookups or writes!
- `registers.write(register, value)`: Writes the specified value into the register. Once
again, the write functionality expects **numeric** values for the destination, which
means you will have to look registers up in `nameToRegisterMap` before storing.

## Memory
The memory abstraction is just like the register abstraction.  It provides the
two methods `memory.read(location)` and `memory.write(location.value)`.  You
won't use memory until a later part, but now you know why it's there!

## Globals
The globals variable is an *Object* that is used for storing global values. If you
have worked with data structures or databases, this effectively acts as a key-value
storage system. You should *not* have to use this outside of a subsequent lesson, 
where we remind you of the interface for this. However, if you wish to use it, simply
read/write to it as a standard JS object with:

- `read`: To read a field `property`, simply do `globals[property]`
- `write`: To write to a field `property`, simply use `globals[property] = value`
- `contains`: To check whether `property` has been set in this globals space,
use: `globals.hasOwnProperty(property)`

# Your Task
You task in this part is to implement the following instruction:

1. [`subu`](#subu)

As a reminder, you can click on any instruction on the sidebar to be taken to a
glossary containing all the information you could possibly want to know about
it.

## R-Format Instructions
Now it's time to introduce you to some of the details of the MIPS instruction
set, starting with R-Format instructions.  What are R-Format instructions?
They're "Register Format" instructions!  Simply put, R-Format instructions are
those which operate entirely on register values.  Instructions like
[`addu`](#addu) and [`subu`](#subu) are R-Format instructions and they operate
completely on registers.

R-Format instructions contain the following information:

1. The operation to perform
2. The destination register (called "`rd`")
3. The source register (called "`rs`")
4. The target register (called "`rt`")
5. The shift amount

The previous definition isn't entirely correct, but it gives a base on which we
will continue to build.  We will go into significantly more detail in the coming
parts and lessons, but this should be enough information for now.

## More Instruction Formats
There are two other instruction formats that you will encounter during the
course of these lessons.  They are I- and J-Format instructions.  J-Format
instructions are those involved with jumps and are mostly just an address.

I-Format instructions are a little bit more complicated.  An I, or Immediate,
format instruction is one that contains information about only two registers and
then a constant value that is used during the operation.  For example, if you
wanted to add 1 to the value contained in the register `$t0`, there isn't a way
to do that with R-Format instructions since they only carry information about
registers.  However, using an I-Format instruction, the 1 would be contained
within the instruction itself.

Don't worry if this section didn't make perfect sense; in the following parts,
you'll be introduced to these instruction formats in much more detail.


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
