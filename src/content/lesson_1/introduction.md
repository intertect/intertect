# Lesson 1: Assemby Language Interpreter

Welcome to the first lesson! The goal of this lesson to familiarize you with
assembly language, and have you write a basic emulator for the MIPS I
instruction set. This might sound quite complicated now, but taken one step at a
time, it’s surprisingly straightforward. The upside to assembly language is that
each instruction is quite simple. The downside is that you need a lot of them to
do anything. We've populated the Assembly editor with a program that will test
all parts of the instruction set. Feel free to edit the assembly and see how it
changes the behavior of the program.

# Assembly Language

# MIPS Registers
The MIPS architecture contains 32 general purpose registers. The name might make
you wonder if there are special purpose registers and you'd be correct. There
are also two registers for integer multiplication and division, as well as
another 32 for floating point arithmetic. You won't be implementing
multiplication, division, or floating point instructions in this lesson since
they add significant operating complexity.

The general purpose registers are organized as follows

## 0 (`$zero`) <a id="zero"></a>

The `$zero` register is hardwired to be 0. There isn't any other value it can
take. This exists as an optimization since you can't assign to a whole register
at once unless you're reading from memory. This allows a register to be set to 0
(generally the most common initialization value) in one shot. A write to this
register does nothing, so generally any instruction that uses this as a
destination won't do anything.

## 1 (`$at`) <a id="at"></a>

Assembler temporary register. This is reserved for use by the assembler to
implement pseudo-instructions. These are assembly instructions that you write
that require more than one machine-language instruction to actually
implement. The `$at` register allows for a temporary storage location that won't
overwrite another register that's in use.

## 2-3 (`$v0-$v1`) <a id="v0_1"></a>

Return values from functions

## 4-7 (`$a0-$a3`) <a id="a0_3"></a>

Arguments to functions

## 8-15 (`$t0-t7`) <a id="t0_7"></a>

Temporary values

## 16-23 (`$s0-$s7`) <a id="s0_7"></a>

Saved registers

## 24-25 (`$t8-$t9`) <a id="t8_9"></a>

More temporary values

## 26-27 (`$k0-$k1`) <a id="k0_1"></a>

Reserved for kernel use

## 28 (`gp`) <a id="gp"></a>

Global pointer. Points to the bottom of the global data segment

## 29 (`sp`) <a id="sp"></a>

Stack pointer. Points to the current top of the stack

## 30 (`fp`) <a id="fp"></a>

Frame pointer. Points to the beginning of the stack for the current function

## 31 (`ra`) <a id="ra"></a>

Return address. This points to the address of the next instruction following a
function call. Returning from a function is implemented by jumping to this
address at the end of the function.

All of these conventions are just that: conventions. There aren't any built-in
requirement about how each of the registers is supposed to be used except for
`$zero` since it's hardwired to `0` and `$ra` since it's modified by Jump And
Link instructions. For these lessons we will treat registers 2-27 as exactly the
same, and all other registers as their conventions dictate.
