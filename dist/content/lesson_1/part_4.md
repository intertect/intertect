# Part 4: Immediate Instructions

Immediate instructions are those which have some constant specified
along with the instruction itself. The immediate operand simply
replaces one of the two operand registers that we saw before. Other
than that, these instructions are mostly the same.

## Where is `Subiu`

It wasn't us who left out the instruction. Instead, the designers of
the MIPS instruction set decided that since you can just add negative
constants, having an additional `subiu` (and corresponding `subi`)
instruction was pointless. This makes the physical processor just a
bit simpler.

## On Immediate Operands

Something interesting to note is that these immediate operands are
only 16 bits wide. We'll see why this is the case in lesson two. You
will have to be careful with the `addiu` instruction because in order
to get negative constants, you will have to sign-extend the immediate
operand. This works as follows: If the immediate operand is negative
(when considering 16 bits), expand the constant to 32 bits by filling
on the left with the sign bit. As an example (in the full 32 bits this
time), we consider `addiu $t0, $t0, −2` which decrements `$t0` by 2.

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
