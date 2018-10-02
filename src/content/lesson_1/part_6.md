# Part 6: Memory!
Up until now, we've been executing instructions and keeping their results in
registers.  However, in real programs we deal with memory because we can't hold
nearly as much data in registers.  This part will be straightforward since loads
and stores are generally quite similar.

## Addressing
In order to read/write a given number of bytes from/to memory, you're going to
have to know which addresses to read.  The simplest read/write is of a byte.
The address to read is simply the address given in the instruction.  For
half-words (two bytes) and words (four bytes), you will need to read the address
given in memory as well as the next 2 or 4 bytes respectively.  Sounds simple
enough, right?  Thankfully it is, but endianness can make this more complicated.

## Endianness
When a computer writes bytes into memory, it has to decide what order it wants
to write them in.  For example, if you have the word `0xDEADBEEF`, should the
bytes be written as:

+---------+------+------+------+------+
| address | 0x0  | 0x1  | 0x2  | 0x3  |
+---------+------+------+------+------+
| value   | 0xDE | 0xAD | 0xBE | 0xEF |
+---------+------+------+------+------+

Or perhaps like:

+---------+------+------+------+------+
| address | 0x0  | 0x1  | 0x2  | 0x3  |
+---------+------+------+------+------+
| value   | 0xEF | 0xBE | 0xAD | 0xDE |
+---------+------+------+------+------+

The first one is called "Big-Endian" while the second one is called
"Little-Endian".  "Big-Endian" means the bytes are written such that the most
significant byte is in the lowest address while "Little-Endian" means the bytes
are written such that the most significant byte is in the largest address.
There is logic to both of these and one is not particularly better than the
other.

If you're curious, these come from Gulliver's travels where there was an island
where one tribe cracked eggs on the big end and the other cracked them on the
small end.  They went to war over this.

MIPS can be either big- or little-endian and is either set by the processor
itself or customized by the operator, but once it has booted, the endianness
cannot change.  We have decided to use big-endian for these lessons because we
think it's mildly easier to learn.  If you want to learn more, the Wikipedia
page on [Endianness](https://en.wikipedia.org/wiki/Endianness) is fantastic.

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
