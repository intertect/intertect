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
