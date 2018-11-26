# Part 5: Jump Around!
Now it's time to implement control flow.  With this, your emulator will be
Turing Complete.  Congratulations!  You will have a processor in the JavaScript
virtual machine, in your browser, on your Operating System, running on a real
physical processor.  If you're running in a VM, you've got even more levels in
there.  Isn't that exciting?

There are a couple strange things about branch and jump instructions that we'll
gloss over for this lesson, but be prepared for a little bit of strangeness
starting in Lesson 2.

# Code Structure
As we explain below, the instructions you will be implementing involve
jumping to different labels in the code. In future parts, the destinations will
be directly embedded in the instruction itself. Because of how we're passing
in the instruction in this first lesson, however, we need a way to translate from
the jump label to the program line. As a result, we provide a variable `labelToLine`
for easy lookup of this information. Whenever you are jumping to a location, make
sure to set `$pc` to the value of `labelToLine[label]`: setting it directly to 
`label` will cause an error when attempting to jump to that location!

# Your Task
You task in this part is to implement the following instructions:

1. [`beq`](#beq)
2. [`j`](#j)
3. [`jal`](#jal)
4. [`jr`](#jr)
5. [`nop`](#nop)

Read on to learn how branch and jump instructions work!

## Branch Instructions
Branch instructions do exactly what they sound like: They branch.  Branch
instructions are used to implement conditional branches in the code.  Think if
statements.  You will be implementing the [`beq`](#beq) and [`bne`](#bne)
instructions, which stand for "branch if equal" and "branch if not equal".  You
only have to implement [`beq`](#beq) and [`bne`](#bne), since it's possible to
emulate any other branch instruction if you really wanted to!  For example, to
check if one number is less than another, you can subtract and use some bit
shifts.  It's not the most wonderful thing, but it works.  Thankfully, all of
our test programs only need these two, so there won't be any insane control-flow
acrobatics.

## How To Calculate Where To Go?
Branch instructions are immediate format instructions where the immediate
operand is an offset from the address of the *next* instruction to the desired
address.  More specifically, the immediate operand is the offset *divided by 4*.
Since all instructions are 32 bits, the bottom two bits are always 0.  This
allows us to get four times greater coverage from a branch instruction.  Once
the bits have been shifted, they are also sign extended and then added to the
address of the next instruction.

For example, consider the following program;

```asm
beq $zero, $zero, target
addiu $t0, $t0, 1
target:
    addiu $t0, $t0, 1
```

The addresses of the instructions are 0, 4, and 8 respectively.  Since the
`target` label points at the instruction immediately following it, it has a
value of 8.  Now lets perform the calculation.  The address of the instruction
immediately following the branch is 4, so the offset in the instruction is `8 -
4 = 4`.  We then divide by 4 to get the immediate operand of 1.  A similar
process happens when the offsets are in reverse, but with negative numbers.

To decode, first sign-extend the immediate operand to get a 32 bit value, then
multiply by 4, and then add it to the current address.  That reminds me, we have
to talk about the program counter.

## Program Counter
The program counter is simply a register that stores the address of the
currently executing instruction.  It isn't directly visible to the programmer,
so the only way to adjust it is through the use of jump and branch instructions.
In order to simplify things, we created a fake register named `$pc` to hold this
value and allow you to interact directly with it.  All you have to do is read
and write to it like it were any other register.

## Jump Instruction
Jump instructions are much more straightforward. [`jr`](#jr) resets the program
counter with the address contained in whatever register is passed in.  This
allows us to go to any place in memory we could possibly want to jump to.

The [`j`](#j) and [`jal`](#jal) instruction formats are identical, though their
semantics (explained in the paragraph below) differ slightly.  Both of
them are an opcode followed by as many bits of address as possible, which
happens to be 26.  They both use the same divide-by-four trick as before, so we
actually end up with 28 bits in the end.  Instead of using these as an offset,
the target is instead overlaid on the program counter.  This means the new
address is the top 4 bits of the program counter (for the next instruction) and
then 28 bits of address.

[`j`](#j) and [`jal`](#jal) are both unconditional jump instructions, meaning
they always go to their target location. [`jal`](#jal), however, additionally
saves the address of the next instruction into the `$ra` or Return Address
register.  This allows the programmer to implement returning from function
calls.

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
