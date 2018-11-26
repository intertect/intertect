# Part 3: Bitwise Instructions

Bitwise instructions are the bread and butter of low-level programming.  They
allow you to quickly manipulate binary data efficiently.  In very high-level
languages like Python, JavaScript, Perl, etc., you won't find these operators
used much, but when dealing with binary protocols and systems programming, they
come up really frequently.

(Not to make value judgments, but these are my favorite instructions.  You don't
even need any of the other arithmetic instructions!  All you need is
[`nor`](#nor) or `nand` and you can make all of them.  Really slowly, of
course.)

# Code Structure
The structure in this part is identical to the previous part. There are no
additional APIs you'll have to interface with in this part as compared to the previous
ones.

# Your Task
You task in this part is to implement the following instructions:

1. [`and`](#and)
2. [`or`](#or)
3. [`nor`](#nor)
4. [`xor`](#xor)
5. [`sll`](#sll)
6. [`srl`](#srl)
7. [`sra`](#sra)

These perform the bitwise AND, OR, NOR, and XOR boolean operations as well as 
left logical shift, right logical shift, and right arithmetic shift.  If you're not 
sure what all of that meant, keep reading.  Otherwise, you can go right ahead and start
implementing.

## Notation

For this lesson part and many of those to come, we'll be encountering a lot of
binary, in the context of both function arguments and (eventually) instructions
themselves.  As a result, we'll be referencing them quite often in our
instructions panel.  To prevent confusion, we use the standard numeric notation,
where the prefix `0x` represents a hex value and `0b` a binary value.  The hex
is pretty obvious to see. *Be careful* with binary though: it is very easy to
glance at a number such as `0b1100` and misinterpret that as being the hex
number `0B1100`, which we would typically notate as `0x0B1100`.  To distinguish
these two (outside the use of the prefix), simply keep in mind that the letters
used in hex numbers are always capitalized!

## Introduction To Bitwise Operations
If you aren't familiar with logical operations, check out the Wikipedia page on
[Logical Connectives](https://en.wikipedia.org/wiki/Logical_connective) for a
good introduction.  As you'll see, logical connectives deal with two truth
values at a time, but our registers are 32 bits long.  These are therefore
implemented by pairing the bits in the two registers (hence why they are called
*bitwise* operators).

As a quick example, taking the bitwise AND of `0b0110` and `0b0011` gives
`0b0010`.  We'll write the two operands vertically to make this more clear.  The
up carrot is the logical AND operator

```
0 ∧ 0 = 0
1 ∧ 0 = 0
1 ∧ 1 = 1
0 ∧ 0 = 0

```

## Shift Operations
There are three kinds of shifts that we want you to implement: shift left
logical ([`sll`](#sll)), shift right logical ([`srl`](#srl)), and shift right
arithmetic ([`sra`](#sra)).

Shift left logical means you shift each of the bits in the target by some
amount, filling on the right with 0.  For example, shifting `0b1111` left by 2
leaves us with `0b1100`.  In this case we assumed we only had 4 bits to work
with, in which case the top two bits got shifted off the top.

Shift right logical means the reverse of this.  You shift all the bits to the
right by some amount, filling with 0 from the left.  Therefore, our previous
example of `0b1111` shifted right logically by 2 would yield `0b0011`.

Lastly, there's the arithmetic right shift.  This is the odd-instruction-out.
The difference is that it treats the number as signed so when it shifts in new
bits, they match the sign bit.  In this way it's very close to integer division
by two (rounded towards −∞).  In this way, −1 arithmetic shift right by 1 is
still −1 but 1 arithmetic shift right by 1 is 0.  We can see this in the
following way, starting with the −1 case.  For all of these we assume 4 bits for
simplicity.

```
−1 = 0b1111
0b1111 >> 1 = 0b1111
```

Where `>>` is the symbol for arithmetic shift right.  We see that a new 1 is
shifted in to replace the old one.  For another example, consider −2

```
−2 = 0b1110
0b1110 >> 1 = 0b1111
```

Now it's more obvious what is happening.  For the positive versions of these
examples, we see:

```
1 = 0b0001
0b0001 >> 1 = 0b0000
```

```
2 = 0b0010
0b0010 >> 1 = 0b0001
```

### R-Format Instructions Revisited
We kept saying we would talk about the "shift amount" part of the R-Format
instruction.  Now is the time for this!  The shift amount is exactly what it
sounds like: It's the number of bits to shift when executing a shift
instruction.  Even though the shift instructions look much more like I-Format
instruction, they are still R-Format.  It is unclear precisely why, but we
believe it's because there was space left in the R-Format instruction binary
format.

To get into the weeds quickly, the R-Format instruction requires 5 bits for each
of the register, and a combined 11 bits for the operation (we'll talk more about
the binary format in Lesson 2); this leaves 5 bits left-over.  Since shifts are
meaningless after 32 positions (try to convince yourself of this fact), then all
we need is 5 bits!  Since the R-Format instruction had space, it got used for
shifts as well.

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
