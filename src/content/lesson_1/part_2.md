# Part 2: Heading Off On Your Own

In this lesson, you'll be implementing the [`subu`](#subu) instruction.  Each of
the parts in Lesson 1 will be adding to your code from previous ones, so by the
end, you'll have a complete MIPS emulator.

# Code structure
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
for when you have to adopt your code for future lessons! 

As an example, the assembly code line `addu $t5, $t0, $t0` would have the following
value passed in `instruction`: `["addu", "$t5", "$t0", "$t0"]`. In order to execute 
the code, the code simply enumerates each of the possible
operations, and then performs the necessary work for whichever particular
instruction it is.  This is the simplest way to write an emulator; while the
later lessons will deal with more and more complicated ideas, this basic
structure will remain for the most part.

## Registers
The `registers` variable contains an interface to the registers so you don't
have to implement this functionality yourself (and also allows us to check your
work).  It provides a two-method interface: `registers.read(register)` and
`registers.write(register, value)`. Specifically:

- `registers.read(register)`: Returns the numeric value stored at that location. Note
that read takes in the **numeric** value of the register. So, trying to call
`registers.read("$t5")`, for example, will simply return `undefined`, since there's
no such value as `$t5` in the registers object: instead, it is `0xd`. To make this
conversion easier for you, `nameToRegisterMap` to you, which gives the numeric value
associated with a register name. Make sure to use this whenever doing lookups or writes!
- `registers.write(register, value)`: Writes the specified value into the register. Once
again, the write functionality expects **numeric** values for the destination, which
means you will have to look registers up in `nameToRegisterMap` before storing.

## Memory
The memory abstraction is just like the register abstraction.  It provides the
two methods `memory.read(location)` and `memory.write(location.value)`.  You
won't use memory until a later part, but now you know why it's there!

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
parts and lessons but this should be enough information for now.

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
# The MIPS Instruction Set

<a id="addu"></a>
### Add Unsigned (`addu $rd, $rs, $rt`)

Take the unsigned integer values from `$rs` and `$rt`, perform an unsigned add
on them, and save the result into `$rd`

<a id="addi"></a>
### Add Immediate (`addi $rt, $rs, val`)

Take the signed integer values from `$rs` and `val` (which is stored in the
instruction), perform a signed add on them, and write the value to `$rt`

<a id="addiu"></a>
### Add Immediate Unsigned (`addiu $rt, $rs, val`)

Take the unsigned integer values from `$rs` and `val` (which is stored in the
instruction), perform an unsigned add on them, and write the value to `$rt`.

<a id="subu"></a>
### Subtract Unsigned (`subu $rd, $rs, $rt`)

Take the unsigned integer values from `$rs` and `$rt`, perform an unsigned
subtraction (`$rs - $rt`) on them, and save the result into `$rd`

<a id="and"></a>
### And (`and $rd, $rs, $rt`)

Perform a bitwise logical AND between `$rs` and `$rt`, saving the result into
`$rd`

<a id="andi"></a>
### And Immediate (`andi $rt, $rs, val`)

Perform a bitwise logical AND between `$rs` and `val` (which has been padded out
to the left with 0), saving the result into `$rt`

<a id="or"></a>
### Or (`or $rd, $rs, $rt`)

Perform a bitwise logical OR between `$rs` and `$rt`, saving the value into
`$rd`

<a id="ori"></a>
### Or Immediate (`ori $rt, $rs, val`)

Perform a bitwise logical OR between `$rs` and `val` (which has been padded out
to the left with 0), saving the result into `$rt`

<a id="nor"></a>
### Nor (`nor $rd, $rs, $rt`)

Perform a bitwise logical NOR between `$rs` and `$rt` which is the same as
taking the bitwise logical OR and then negating it (`~($rs | $rt)`), saving the
result into `$rd`

<a id="xor"></a>
### Xor (`xor $rd, $rs, $rt`)

Perform a bitwise logical XOR between `$rs` and `$rt`, saving the result into
`$rd`

<a id="xori"></a>
### Xor Immediate (`xori`)

Perform a bitwise logical XOR between `$rs` and `val` (which has been padded to
the left with 0), saving the result into `$rt`

<a id="sll"></a>
### Shift Left Logical (`sll $rt, $rs, val`)

Perform a logical shift left of `$rt` by `val` places, saving the result into
`$rt`.  This is integer multiplication by 2

<a id="srl"></a>
### Shift Right Logical (`srl $rt, $rs, val`)

Perform a logical right shift of `$rs` by `val` places, filling the vacated
places on the left with 0, saving the result into `$rt`

<a id="sra"></a>
### Shift Right Arithmetic (`sra $rt, $rs, val`)

Perform an arithmetic right shift of `$rs` by `val` places, filling the vacated
places with 0 if the leading bit was 0, and 1 if the leading place was one.
This is integer division by 2

<a id="beq"></a>
### Branch On Equal (`beq $rt, $rs, val`)

if `$rs == $rt`, jump to the location specified by `val` shifted left by two
places (multiplied by 4)

<a id="blt"></a>
### Branch Less Than (`blt $rt, $rs, val`)

if `$rs < $rt` (yes, this does seem quite backwards), jump to the location
specified by `val` shifted left by two places (multiplied by 4)

<a id="j"></a>
### Jump (`j val`)

Jump to the address specified in val shifted left 2 places (multiply by 4)

<a id="jal"></a>
### Jump And Link (`jal val`)

Jump to the address specified in val shifted left 2 places (multiplied by 4),
and save the address of the next instruction into `$ra`

<a id="jr"></a>
### Jump Register (`jr $rs`)

Jump to the address stored in `$rs` shifted left two places (multiplied by 4)


<a id="lbu"></a>
### Load Byte Unsigned (`lbu`)

<a id="lhu"></a>
### Load Halfword Unsigned (`lhu`)

<a id="lw"></a>
### Load Word (`lw`)

<a id="lui"></a>
### Load Upper Immediate (`lui`)

<a id="li"></a>
### Load Immediate (`li`)

<a id="sb"></a>
### Store Byte (`sb`)

<a id="sh"></a>
### Store Halfword (`sh`)

<a id="sw"></a>
### Store Word (`sw`)

## Special

<a id="noop"></a>
### No Operation (`noop`)
Do nothing.  This might not seem like a useful instruction to have in an
instruction set archiecture, but it can really come in handy when you need to
fill a space with something and you want to make sure that nothing could
possibly happen if you end up there.  It certainly doesn't come up much, but
it's very handy to have around when it does.
