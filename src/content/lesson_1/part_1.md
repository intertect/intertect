# Part 1: Starting Slowly

Welcome to the first lesson on computer architecture!  It's just the first part,
but we don't want you reading for too long so we'll get right into things by
implementing the [`addu`](#addu) instruction.  To give you a base to build on,
we've already done most of the implementation for this part.  We've provided the
basic structure of the code, and for for each lesson you'll just have to fill in
the parts of the code for the new functionality.

During this course, you will be implementing a handful of emulators for the MIPS
I instruction set.  This was a Reduced Instruction Set Computer (RISC)
architecture, which means that each of the instruction the computer executed is
quite simple.  This is unlike the x86 processor that is probably in your
computer right now, which has instructions that each perform many smaller
sub-operations.

## Code Structure
**Important**: Do not skip reading this section in general.  It will make
implementing the current and future lessons much more difficult than it need be
(and sometimes completely impossible if you have to adhere to an API we have set
up for you)!

Since this is the first part, understanding the exact details of how the code
works is not completely necessary.  The "Code Structure" section of the
instructions is where we generally explain how we've laid out the code, and any
new APIs we're exposing to you.  We will explain the code more in-depth in the
following part, since you'll be modifying it more extensively there.  But, the
change(s) you'll make in this part should be pretty micro in scope.

## Your Task
You task for this part is to familiarize yourself with the interface since
you'll be using it a lot in the upcoming lessons.  Try running the code!

It should now be abundantly clear that there is a bug in the code.  Your task is
now to find the bug and fix it.

## Lesson Structure
The content for this course is divided up into lessons which each cover some
self-contained topic, each one generally at a lower level of abstraction than
the previous.  Each lesson is then divided up into individual parts to provide
self-contained units of progression.  The topics of the lessons are as follows

1. Assembly Interpreter
2. Binary Interpreter
3. Simple Pipeline
4. Full-Featured Pipeline

Don't worry if the terminology doesn't all make sense yet; we'll be doing our
best to provide introductions to new topics as they come up.

## Some Background
It's possible that Computer Architecture might be a completely foreign subject
to you.  We don't want to assume much about how much you've learned previously,
so with each part, we will provide much of the necessary background for you.  We
do assume that you know how to program in JavaScript or can at least learn it on
your own.  We use a very small subset of the features, so there shouldn't be
much to worry about.

### The Computer Model
At a high level, the Central Processing Unit (CPU), or processor for short, is
just an agent that executes simple instructions according to a strict set of
rules.  The instructions it deals with are things like: "read a byte from
memory," "add these two numbers," or "compare these values."  Every program you
run is fundamentally just a stream of these sorts of instructions, along with
the corresponding data.  As a user or programmer, you can think of the processor
as faithfully executing a stream of instructions one at time.  However, this is
really only an illusion.

The contract that the CPU has with the programmer is that it must **appear** to
be the case that instructions are being executed in this manner.  The CPU is
free to do anything it wants as long as this abstraction is maintained.  In this
course, you will be learning how this illusion is performed, and about certain
tricks that processors use to make programs go fast.


### Assembly Language
You won't have to know much about assembly language for this course, but we'll
give a brief overview for the purposes of this first lesson, where you'll be
implementing an assembly language interpreter for the MIPS I instruction set.

Assembly language (usually just called assembly or assembler) is the
lowest-level language that is still human-readable.  Each line of assembly
corresponds to a single instruction that is executed by the machine.  This isn't
entirely true, and there is still some abstraction between assembly and machine
language, but it is good enough for our purposes.

The JavaScript function you are filling out will be called once for each line of
the assembly language program, just like a theoretical CPU would do.

Assembly language instructions are generally written in the format of `operation
operand, operand, operand` although the number of operands differs depending on
the instruction.  When there is a value to be written, it ends up in the first
operand, and the operation is usually applied to the last two.  If you look at
the list of instructions below, you can see how all of the instructions are
formatted and how they work.  Some of the information isn't going to be useful
until Lesson 2, but for consistency, we'll list it here as well.

## The [`addu`](#addu) Instruction
The [`addu`](#addu) instruction is one of the most straightforward instructions
in this architecture.  It takes its second two operands, adds them, and writes
the result into the first operand.  You can click on any instance of the
[`addu`](#addu) instruction in this instructions panel to be taken to the
glossary entry about it.

## What's in a Name?
Why is this instruction called [`addu`](#addu) and not just `add`?  I'll let you
in on a little secret: There *is* an `add` instruction, but we're not making you
implement it.  [`addu`](#addu) stands for Add Unsigned.  However, signed (using
two's-complement) and unsigned additions and subtractions are completely
identical.  The only difference between the two instructions is that `add`
checks for signed integer overflow while [`addu`](#addu) does not.
Specifically, `add` traps (calls into the kernel) if there is an overflow.
Since we most certainly do not have a kernel running on this emulator, these two
instructions are exactly the same, and we felt it pointless for you to implement
the same functionality twice.

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
