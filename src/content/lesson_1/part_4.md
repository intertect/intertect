# Part 4: Immediate Instructions

In addition to the register instructions, we have immediate (I)
instructions. Unlike register instructions, immediates have a constant specified
along with the instruction itself. The immediate operand simply replaces one of
the two operand registers in R instructions. Other than that, these instructions
are quite comparable.

## Your Task
You task in this part is to implement

## Where is [`subiu`](#subiu)?
It wasn't us who left out the instruction. Instead, the designers of the MIPS
instruction set decided that since you can just add negative constants, having
an additional [`subiu`](#subiu) (and corresponding `subi`) instruction was
pointless.  This makes the physical processor just a little bit simpler.

## On Immediate Operands
Something interesting to note is that these immediate operands are only 16 bits
wide. We'll see why this is the case in lesson two. You will have to be careful
with the [`addiu`](#addiu) instruction because in order to get negative
constants, you will have to sign-extend the immediate operand. This works as
follows: If the immediate operand is negative (when considering 16 bits), expand
the constant to 32 bits by filling on the left with the sign bit. As an example
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

You might be wondering where the immediate subtraction operations are. There are
two reasons you don't see them here. It's because if in assembly you write `subi
$rt, $rs, val`, you can just take the two's-compliment of val and add it! This
saves space on the chip so it was common in older architectures. You can also do
the same with `subu $rd, $rs, $rt` using the `$at` register for calculating the
two's-compliment at runtime.

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
`$rt`. This is integer multiplication by 2

<a id="srl"></a>
### Shift Right Logical (`srl $rt, $rs, val`)

Perform a logical right shift of `$rs` by `val` places, filling the vacated
places on the left with 0, saving the result into `$rt`

<a id="sra"></a>
### Shift Right Arithmetic (`sra $rt, $rs, val`)

Perform an arithmetic right shift of `$rs` by `val` places, filling the vacated
places with 0 if the leading bit was 0, and 1 if the leading place was one. This
is integer division by 2

## Control Flow

Many of these instructions multiply their arguments by 4. This is because each
instruction is exactly 4 bytes long, and so the last two bits of an address will
always be zero. By having the argument being the offset or address / 4, you can
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
Do nothing. This might not seem like a useful instruction to have in an
instruction set archiecture, but it can really come in handy when you need to
fill a space with something and you want to make sure that nothing could
possibly happen if you end up there. It certainly doesn't come up much, but it's
very handy to have around when it does.
