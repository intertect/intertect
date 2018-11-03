# Part 3: Bitwise Instructions

Bitwise instructions are the bread and butter of low-level programming. They
allow you to quickly manipulate binary data efficiently. In very high-level
languages like Python, JavaScript, Perl, etc., you won't find these operators
used much, but when dealing with binary protocols and systems programming, they
come up really frequently. 

(Not to make value judgments, but these are my favorite instructions. You don't 
even need any of the other arithmetic instructions! All you need is `nor` or 
`nand` and you can make all of them. Really slowly, of course.)

# Note on Notation

For this lesson part and many of those to come, we'll be encountering a lot of
binary, in the content of both function arguments and (eventually) instructions themselves. As a
result, we'll be referencing them quite often in our instructions panel. To
prevent confusion, we use the standard numeric notation, where the
prefix `0x` represents a hex value and `0b` a binary value. The hex is pretty
obvious to see. *Be careful* with binary though: it is very easy to glance at a
number such as `0b1100` and misinterpret that as being the hex number `0B1100`, which
we would typically notate as `0x0B1100`. To distinguish
these two (outside the use of the prefix), simply keep in mind that the letter 
characters used in hex numbers are always capitalized!

## Your Task
You task is to implement the `add`, `or`, `nor`, `xor`, `sll`, `srl`, and `sra`
instructions. These perform the bitwise AND, OR, NOR, and XOR boolean operations as
well as left logical shift, right logical shift, and right arithmetic shift. If
you're not sure what all of that meant, keep reading. Otherwise, you can go
right ahead and start implementing.

## Introduction To Bitwise Operations
If you aren't familiar with logical operations, check out the Wikipedia page on
[Logical Connectives](https://en.wikipedia.org/wiki/Logical_connective) for a
good introduction. As you'll see, logical connectives deal with two truth
values at a time, but our registers are 32 bits long. These are therefore
implemented by pairing the bits in the two registers (hence why they are called
bitwise operators).

As a quick example, taking the bitwise AND of `0b0110` and `0b0011` gives
`0b0010`. We'll write the two operands vertically to make this more clear. The
up carrot is the logical AND operator

```
0 ∧ 0 = 0
1 ∧ 0 = 0
1 ∧ 1 = 1
0 ∧ 0 = 0

```

## Shift Operations
There are three kinds of shifts that we want you to implement: shift left
logical (`sll`), shift right logical (`srl`), and shift right arithmetic
(`sra`).

Shift left logical means you shift each of the bits in the target by some
amount, filling on the right with 0. For example, shifting `0b1111` left by 2
leaves us with `0b1100`. In this case we assumed we only had 4 bits to work
with, in which case the top two bits got shifted off the top.

Shift right logical means the reverse of this. You shift all the bits to the
right by some amount, filling with 0 from the left. Therefore, our previous
example of `0b1111` shifted right logically by 2 would yield `0b0011`.

Lastly, there's the arithmetic right shift. This is the odd-instruction-out.
The difference is that it treats the number as signed so when it shifts in new
bits, they match the sign bit. In this way it's very close to integer division
by two (rounded towards −∞). In this way, −1 arithmetic shift right by 1 is
still −1 but 1 arithmetic shift right by 1 is 0. We can see this in the
following way, starting with the −1 case. For all of these we assume 4 bits for
simplicity.

```
−1 = 0b1111
0b1111 >> 1 = 0b1111
```

Where `>>` is the symbol for arithmetic shift right. We see that a new 1 is
shifted in to replace the old one. For another example, consider −2

```
−2 = 0b1110
0b1110 >> 1 = 0b1111
```

Now it's more obvious what is happening. For the positive versions of these
examples, we see:

```
1 = 0b0001
0b0001 >> 1 = 0b0000
```

```
2 = 0b0010
0b0010 >> 1 = 0b0001
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
