# Lesson 1: Assemby Language Interpreter

Welcome to the first lesson! The goal of this lesson to familiarize you with
assembly language, and have you write a basic emulator for the MIPS I
instruction set.  This might sound quite complicated now, but taken one step at
a time, it’s surprisingly straightforward.  The upside to assembly language is
that each instruction is quite simple.  The downside is that you need a lot of
them to do anything.  We've populated the Assembly editor with a program that
will test all parts of the instruction set.  Feel free to edit the assembly and
see how it changes the behavior of the program.

# Assembly Language

# MIPS Registers
The MIPS architecture contains 32 general purpose registers.  The name might
make you wonder if there are special purpose registers and you'd be correct.
There are also two registers for integer multiplication and division, as well as
another 32 for floating point arithmetic.  You won't be implementing
multiplication, division, or floating point instructions in this lesson since
they add significant operating complexity.

The general purpose registers are organized as follows

## 0 (`$zero`)
The `$zero` register is hardwired to be 0.  There isn't any other value it can
take.  This exists as an optimization since you can't assign to a whole register
at once unless you're reading from memory.  This allows a register to be set to
0 (generally the most common initialization value) in one shot.  A write to this
register does nothing, so generally any instruction that uses this as a
destination won't do anything.

## 1 (`$at`)
Assembler temporary register.  This is reserved for use by the assembler to
implement pseudo-instructions.  These are assembly instructions that you write
that require more than one machine-language instruction to actually implement.
The `$at` register allows for a temporary storage location that won't overwrite
another register that's in use.

## 2-3 (`$v0-$v1`)
Return values from functions

## 4-7 (`$a0-$a3`)
Arguments to functions

## 8-15 (`$t0-t7`)
Temporary values

## 16-23 (`$s0-$s7`)
Saved registers

## 24-25 (`$t8-$t9`)
More temporary values

## 26-27 (`$k0-$k1`)
Reserved for kernel use

## 28 (`gp`)
Global pointer.  Points to the bottom of the global data segment

## 29 (`sp`)
Stack pointer.  Points to the current top of the stack

## 30 (`fp`)
Frame pointer.  Points to the beginning of the stack for the current function

## 31 (`ra`)
Return address.  This points to the address of the next instruction following a
function call.  Returning from a function is implemented by jumping to this
address at the end of the function.

All of these conventions are just that: conventions.  There aren't any built-in
requirement about how each of the registers is supposed to be used except for
`$zero` since it's hardwired to `0` and `$ra` since it's modified by Jump And
Link instructions.  For these lessons we will treat registers 2-27 as exactly
the same, and all other registers as their conventions dictate.

# The MIPS Instruction Set

## Arithmetic

### Add Unsigned (`addu $rd, $rs, $rt`)
Take the unsigned integer values from `$rs` and `$rt`, perform an unsigned add
on them, and save the result into `$rd`

### Add Immediate (`addi $rt, $rs, val`)
Take the signed integer values from `$rs` and `val` (which is stored in the
instruction), perform a signed add on them, and write the value to `$rt`

### Add Immediate Unsigned (`addiu $rt, $rs, val`)
Take the unsigned integer values from `$rs` and `val` (which is stored in the
instruction), perform an unsigned add on them, and write the value to `$rt`.

### Subtract Unsigned (`subu $rd, $rs, $rt`)
Take the unsigned integer values from `$rs` and `$rt`, perform an unsigned
subtraction (`$rs - $rt`) on them, and save the result into `$rd`

You might be wondering where the immediate subtraction operations are.  There
are two reasons you don't see them here.  It's because if in assembly you write
`subi $rt, $rs, val`, you can just take the two's-compliment of val and add it!
This saves space on the chip so it was common in older architectures.  You can
also do the same with `subu $rd, $rs, $rt` using the `$at` register for
calculating the two's-compliment at runtime.

## Logic

### And (`and $rd, $rs, $rt`)
Perform a bitwise logical AND between `$rs` and `$rt`, saving the result into
`$rd`

### And Immediate (`andi $rt, $rs, val`)
Perform a bitwise logical AND between `$rs` and `val` (which has been padded out
to the left with 0), saving the result into `$rt`

### Or (`or $rd, $rs, $rt`)
Perform a bitwise logical OR between `$rs` and `$rt`, saving the value into
`$rd`

### Or Immediate (`ori $rt, $rs, val`)
Perform a bitwise logical OR between `$rs` and `val` (which has been padded out
to the left with 0), saving the result into `$rt`

### Nor (`nor $rd, $rs, $rt`)
Perform a bitwise logical NOR between `$rs` and `$rt` which is the same as
taking the bitwise logical OR and then negating it (`~($rs | $rt)`), saving the
result into `$rd`

### Xor (`xor $rd, $rs, $rt`)
Perform a bitwise logical XOR between `$rs` and `$rt`, saving the result into
`$rd`

### Xor Immediate (`xori`)
Perform a bitwise logical XOR between `$rs` and `val` (which has been padded to
the left with 0), saving the result into `$rt`

### Shift Left Logical (`sll $rt, $rs, val`)
Perform a logical shift left of `$rt` by `val` places, saving the result into
`$rt`.  This is integer multiplication by 2

### Shift Right Logical (`srl $rt, $rs, val`)
Perform a logical right shift of `$rs` by `val` places, filling the vacated
places on the left with 0, saving the result into `$rt`

### Shift Right Arithmetic (`sra $rt, $rs, val`)
Perform an arithmetic right shift of `$rs` by `val` places, filling the vacated
places with 0 if the leading bit was 0, and 1 if the leading place was one.
This is integer division by 2

## Control Flow

Many of these instructions multiply their arguments by 4.  This is because each
instruction is exactly 4 bytes long, and so the last two bits of an address will
always be zero.  By having the argument being the offset or address / 4, you can
get 4 times as much reach with any of these instructions

### Branch On Equal (`beq $rt, $rs, val`)
if `$rs == $rt`, jump to the location specified by `val` shifted left by two
places (multiplied by 4)

### Branch Less Than (`blt $rt, $rs, val`)
if `$rs < $rt` (yes, this does seem quite backwards), jump to the location
specified by `val` shifted left by two places (multiplied by 4)

### Jump (`j val`)
Jump to the address specified in val shifted left 2 places (multiply by 4)

### Jump And Link (`jal val`)
Jump to the address specified in val shifted left 2 places (multiplied by 4),
and save the address of the next instruction into `$ra`

### Jump Register (`jr $rs`)
Jump to the address stored in `$rs` shifted left two places (multiplied by 4)


## Memory / Registers

### Load Byte Unsigned (`lbu`)
### Load Halfword Unsigned (`lhu`)
### Load Word (`lw`)
### Load Upper Immediate (`lui`)
### Load Immediate (`li`)
Note: This could be interesting not to demonstrate, but rather to show how
pseudo-instructions work since it's impossible to have a 32 bit immediate value

### Store Byte (`sb`)
### Store Halfword (`sh`)
### Store Word (`sw`)

## Special

### No Operation (`noop`)
Do nothing.  This might not seem like a useful instruction to have in an
instruction set archiecture, but it can really come in handy when you need to
fill a space with something and you want to make sure that nothing could
possibly happen if you end up there.  It certainly doesn't come up much, but
it's very handy to have around when it does.
