# Part 5: Jump Around!
Now it's time to implement control flow.  With this, your emulator will be
Turing Complete.  Congratulations!  You will have a processor in the JavaScript
virtual machine, in your browser, on your Operating System, running on a real
physical processor.  If you're running in a VM, you've got even more levels in
there.  Isn't that exciting?

There are a couple strange things about branch and jump instructions that we'll
gloss over for this lesson, but be prepared for a little bit of strangeness
starting in Lesson 2.

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
