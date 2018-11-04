# Part 4: Immediate Instructions

As alluded to before, in addition to R-Format instructions there are also
"Immediate", or I-Format instructions.  Unlike R-Format instructions, I-Format
instructions have a constant specified along with the instruction itself.  The
immediate operand simply replaces one of the two operand registers that we see
in R-Format instructions.  Other than that, these instructions are quite
comparable.  The information contained within an I-Format instruction is:

1. The operation
2. The source register (`rs`)
3. The target register (`rt`)
4. The 16 bit immediate operand

The target register takes the place of the destination register, `rd`, for
I-Format instructions.

## Your Task
You task in this part is to implement the following instructions:

1. [addiu](#addiu)
2. [andi](#andi)
3. [ori](#ori)
4. [xori](#xori)

These instructions have nearly the same behavior as their R-Format counterparts.
The main difference is in the handling of the immediate operand.  For each of
these instructions, we must extend the immediate operand from it's original 16
bits to the full 32 bits of a register.  There are two ways to do this:
Sign-Extending and Zero-Extending.  First, however, we must describe two's
complement numbers

### Two's Complement
The most common way to represent integers on a modern computer is through the
[Two's complement](https://en.wikipedia.org/wiki/Two%27s_complement)
representation.  In a two's complement representation, each digit of a binary
number represents it's given power of two.  For example, the number `0b0101` is
equivalent to the decimal `4 + 1 = 5`.  However, the first bit of a two's
complement number can be special.

When treated as a signed number, the first bit represents the value of `-2^N`
where `N` is the number of bits in the number.  Therefore, the smallest possible
number in a signed two's complement representation is `0x1000...`.  This also
means that `-1 = 0b11...11`.

In order to add two two's complement numbers, there are added just like any
other binary numbers; surprisingly the math works out.  (If you're feeling
adventurous, try to convince yourself of this fact.  Remember that when the
result wouldn't fit in the number of bits available, it wraps around).  Read the
linked page from the previous section if you would like to learn more about
two's complement arithmetic.  It's incredibly interesting, but we don't have
time to describe it in detail here.

### Zero-Extending
Zero-extending is the simplest way to take a binary value and expand the number
of bits.  Imagine we have the binary number `0b1111` and we want to zero-extend
it to be 8 bits.  We simply tack on 4 more 0s at the top to get to the correct
size.  `0b1111 => 0b00001111`.  If we considered this number as a signed
integer, then the value has gone from -1 to 7.  However, in an unsigned case,
the value of the number has not changed.  This is the motivation for
sign-extension, since it doesn't change the value itself, only the size of it's
representation.

### Sign-Extending
To sign-extend a number from it's current size to a larger size, the new bits
take on the value of the sign bit.  For example, let's look at two possible
cases: Sign-extending `0b1111 = -1` and `0b0001 = 1` from 4 bits to 8 bits.

To extend `0b1111`, first we need to figure out the value of the sign bit, which
is obviously 1.  Now, we just add 4 ones to the top to get the value up to 8
bits, giving us `0b11111111 = -1`.

Let's breeze through the other case.  We see that the sign bit is 0, so we fill
the top with 0s, giving us `0b00000001 = 1`.  The values are unchanged, but we
now have more bits.

### When are These Used?
For our purposes, zero-extension is only used for the logical operations since
they don't operate on values so much as on patterns of bits.  In that way, since
we can't specify more than 16 bits, we want to make sure we're not accidentally
specifying the higher-order bits.

Sign extension, on the other hand, is useful when we are using the bits to
represent a number.  If we want to add a negative number to a register, we want
to make sure that it is still negative when we expand the value to 32 bits.
We'll see another case of this when we get to branching in the next part where
we have to deal with offsets, some of which will be negative.

## Where is [`subiu`](#subiu)?
It wasn't us who left out the instruction.  Instead, the designers of the MIPS
instruction set decided that since you can just add negative constants, having
an additional [`subiu`](#subiu) (and corresponding `subi`) instruction was
pointless.  This makes the physical processor just a little bit simpler.

## On Immediate Operands
Something interesting to note is that these immediate operands are only 16 bits
wide.  We'll see why this is the case in lesson two.  You will have to be
careful with the [`addiu`](#addiu) instruction because in order to get negative
constants, you will have to sign-extend the immediate operand.  This works as
follows: If the immediate operand is negative (when considering 16 bits), expand
the constant to 32 bits by filling on the left with the sign bit.  As an example
(in the full 32 bits this time), we consider `addiu $t0, $t0, −2` which
decrements `$t0` by 2.

```
−2 = 0b1111111111111110
(sign extending...)
−2 = 0b11111111111111111111111111111110
```

If we had 2 instead of −2, it would work as follows:

```
2 = 0b0000000000000010
(sign extending...)
2 = 0b00000000000000000000000000000010
```

## Code Structure
Finally, we get to the nuts and bolts of the implementation for this section.  I
hope you've made it this far, but the information here isn't terribly hard to
figure out, so you would be fine in any case.  The main difference for this part
is that you are going to be dealing with a slightly different instruction
format.  The `instruction` parameter that is being passed in will now have a
slightly different format (but only slightly):

0. The operation to perform
1. The source register (`rs`)
2. The target register (`rt`)
3. The immediate operand

In order to deal with the immediate operand, you are going to have to know
whether to sign-extend or zero-extend the value that you get.  We have provided
the `SignExtend32(val)` and `ZeroExtend32(val)` functions for your convenience.
If you don't want to have to figure out what do do in this respect, then look no
further:

1. [addiu](#addiu) gets sign-extended since the value is a number
2. [andi](#andi) gets zero-extended because it is a logical operation
3. [ori](#ori) same
4. [xori](#xori) same

Isn't that straightforward?  Now get implementing!

---
# The MIPS Instruction Set

## Arithmetic


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

You might be wondering where the immediate subtraction operations are.  There
are two reasons you don't see them here.  It's because if in assembly you write
`subi $rt, $rs, val`, you can just take the two's-compliment of val and add it!
This saves space on the chip so it was common in older architectures.  You can
also do the same with `subu $rd, $rs, $rt` using the `$at` register for
calculating the two's-compliment when the program is assembled.

## Logic

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

## Control Flow

Many of these instructions multiply their arguments by 4.  This is because each
instruction is exactly 4 bytes long, and so the last two bits of an address will
always be zero.  By having the argument being the offset or address / 4, you can
get 4 times as much reach with any of these instructions

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


## Memory / Registers

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

Note: This could be interesting not to demonstrate, but rather to show how
pseudo-instructions work since it's impossible to have a 32 bit immediate value

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
