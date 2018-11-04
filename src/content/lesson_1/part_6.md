# Part 6: Memory!
Up until now, we've been executing instructions and keeping their results in
registers.  However, in real programs we deal with main memory (RAM) since the
combined capacity of all the registers in our machine is 124 bytes (since the
zero register can't hold any value besides zero).

The instructions in the MIPS architecture (and other RISC architectures) only
operate on data that is stored in registers, so the only job for memory
instructions is to read data from memory or write data back to memory.  This
section will be straightforward since once you've gotten one of the operations,
the rest of them are quite similar.

## Addressing
In order to read/write a given number of bytes from/to memory, you're going to
have to know which addresses to read.  The simplest read/write is of a byte (8
bits).  The address to read is simply the address given in the instruction.  For
half-words (two bytes) and words (four bytes), you will need to read the address
given in memory as well as the next 2 or 4 bytes respectively.  Sounds simple
enough, right?  Thankfully it is, but endianness can make this more complicated.

## Endianness
When a computer writes bytes into memory, it has to decide what order it wants
to write them in.  For example, if you have the word `0xDEADBEEF`, should the
bytes be written as:

| address | 0x0 | 0x1 | 0x2 | 0x3 |
|---------|------|------|------|------|
| value | 0xDE | 0xAD | 0xBE | 0xEF |

Or perhaps like:

| address | 0x0 | 0x1 | 0x2 | 0x3 |
|---------|------|------|------|------|
| value | 0xEF | 0xBE | 0xAD | 0xDE |

The first one is called "Big-Endian" while the second one is called
"Little-Endian". "Big-Endian" means the bytes are written such that the most
significant byte is in the lowest address, while "Little-Endian" means the bytes
are written such that the most significant byte is in the largest address.
There is logic to both of these, and one is not inherently better than the
other.

If you're curious, these names come from *Gulliver's Travels* where there was an
island where one tribe cracked eggs on the big end and the other cracked them on
the small end.  They went to war over this.

MIPS can be either big- or little-endian and is either set by the processor
itself or customized by the operator, but once it has booted, the endianness
cannot change.  We have decided to use big-endian for these lessons because we
think it's mildly easier to learn.  If you want to learn more, the Wikipedia
page on [Endianness](https://en.wikipedia.org/wiki/Endianness) is fantastic.

## Code Structure
The way loads are stores are written is somewhat different from other
instructions.  Instead of coming last, the immediate operand comes before the
second register value, which is surrounded in parentheses.  The way to read a
load or store (e.g. `lw $rt, 0x10($rs)`) is "Load a word (32 bits) from the
address `$rs` + 0x10 and store that value in $rt".

The purpose of the offset from the register value is to implement data
structures!  We won't deal with those here but in a C-style struct, the offsets
of the members are known at compile time.  This means that the compiler can
hard-code the offsets in the immediate operands of loads and store, while using
a register to keep track of where in memory the struct began.

In order to implement the loads and stores, you will have to read the address
out of `rs`, sign-extend the offset (since it's a number), and add them to get
the address to read from.

Let us look at an example of a store.  We'll assume that we're storing the value
`0xDEADBEEF` to address `0x10`.  We also assume that memory is initialized to 0
to begin with.

The value in the register looks like this:

| 0x0 | 0x1 | 0x2 | 0x3 |
|------|------|------|------|
| 0xDE | 0xAD | 0xBE | 0xEF |

We start by writing to the first byte after the address and then write
subsequent bytes to subsequent addresses:

| 0x10 | 0x14 | 0x18 | 0x1C |
|------|------|------|------|
| 0xDE | 0x0 | 0x0 | 0x0 |

And the next byte

| 0x10 | 0x14 | 0x18 | 0x1C |
|------|------|------|------|
| 0xDE | 0xAD | 0x0 | 0x0 |

etc.

| 0x10 | 0x14 | 0x18 | 0x1C |
|------|------|------|------|
| 0xDE | 0xAD | 0xBE | 0x0 |

etc.

| 0x10 | 0x14 | 0x18 | 0x1C |
|------|------|------|------|
| 0xDE | 0xAD | 0xBE | 0xEF |

All other store operations work the same way, but with different number of bytes
to write.

Things will be slightly more complicated for `lhu`, `lbu`, `sh`, `sb`.  These
instructions operate on half-words (2 bytes) and single bytes respectively.  The
load instructions end in a `u` since they are unsigned; this means that you
should zero-extend the read values rather than sign-extend them.  The only
difficulties with these instructions is making sure you're operating on the
correct number of bytes.

For `lhu`, you must read two bytes starting at the address you just calculated
and zero-extend them to 32 bits before storing them in the low-order 16 bits of
the register (there should be 16 bits of 0s at the top).

`lb` is the same but you read only a single byte.

`sh` must store only the lower 16 bytes of `rt` at the two bytes starting with
the calculated address.

`sb` is the same but only stores 1.

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
