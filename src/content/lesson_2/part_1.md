# Part 1: Binary Representations

Welcome to the second lesson about computer architecture! Great work completing the
first one! In this lesson, we're going to starting unpeeling the layers of abstraction
we used to veil some of the complexity in lesson 1. But don't worry: we'll take it one 
step at a time! In this lesson, we'll focus specifically on understanding the underlying
representation of instructions as they are passed around in the processor.

## Binary vs. Assembly 
Computer processors understand one thing and one thing only: binary values. We touched
on them briefly throughout the first lesson, but they were backgrounded for the most part
in those parts. This has one major ramification in your program: while we as humans find
assembly a much more expressive way of describing what is going on in a program, these
instructions mean nothing to processors. In other words, a processor will have no idea
what to do if we passed "addu $t5, $t0, $t0" to it. But, it will understand something like
"00000001001010000111100000100011." This, in fact, is how instructions are passed around
under the hood. While it may look like a jumbled mess, we'll see how understanding
instructions like this is no more complicated than parsing the assembly instruction!

## Your Task
This lesson will revolve around you changing your execute function to take the 
**binary** instruction rather than the **assembly**. That being said, nearly all the code
you wrote in lesson 1 **should** be transferrable to your final output from this lesson. The
best way to approach this lesson is to change how you structure your switch statement to
parse out what the instruction is and its corresponding arguments. *Refer to the section
[below](#binary)* to get the full set of details you'll need to complete the implementation!
Some points to keep in mind about implementation:

- We've laid out a template of a potential way to organize your code. That being said, feel
free to scrap our boilerplate and write something of your own instead!
- Your implementation **should** separate between I, R, and J instructions: this will keep
your code organized and easier to debug
- Instructions are passed in as **numbers**. Be careful! When doing bitwise operations, you
should almost **always** (except in the implementation of `sra`) use the logical shift operation
```>>>```. ``>>`` is the **arithmetic** shift operator, which has some subtle differences!
- `functMap` and `opcodeMap` serve as clean ways to interface between the binary instruction
and the code you wrote for the previous lesson. Again, feel free to not use them if you think
you can do it more cleanly yourself!

---
<a id="binary"></a>
# MIPS Binary Encodings

Below is a **binary** implementation guide for MIPS, similar to what we provided in Lesson 1.
This was all graciously taken from: [MIPS Reference](http://www2.engr.arizona.edu/~ece369/Resources/spim/MIPSReference.pdf).

## Instruction Encodings

Where:

- `s`: `$rs` register
- `t`: `$rt` register
- `d`: `$rd` register
- `f`: funct
- `o`: opcode
- `i`: immediate value

| Instruction | Encoding |
| :--- | :--- |
| Register | 000000ss sssttttt dddddaaa aaffffff |
| Immediate | ooooooss sssttttt iiiiiiii iiiiiiii |
| Jump | ooooooii iiiiiiii iiiiiiii iiiiiiii |

## Syntax Table

| Syntax | Template |
| :--- | :--- |
| ArithLog | f $d, $s, $t |
| DivMult | f $s, $t |
| Shift | f $d, $t, a |
| ShiftV | f $d, $t, $s |
| JumpR | f $s |
| MoveFrom | f $d |
| MoveTo | f $s |
| ArithLogI | o $t, $s, i |
| LoadI | o $t, immed32 |
| Branch | o $s, $t, label |
| BranchZ | o $s, label |
| LoadStore | o $t, i($s) |
| Jump | o label |
| Trap | o i |

## Opcode Table

| Instruction | Opcode/Function | Syntax |
| :--- | :---- | :--- |
| add | 100000 | ArithLog |
| addu | 100001 | ArithLog |
| addi | 001000 | ArithLogI |
| addiu | 001001 | ArithLogI |
| and | 100100 | ArithLog |
| andi | 001100 | ArithLogI |
| div | 011010 | DivMult |
| divu | 011011 | DivMult |
| mult | 011000 | DivMult |
| multu | 011001 | DivMult |
| nor | 100111 | ArithLog |
| or | 100101 | ArithLog |
| ori | 001101 | ArithLogI |
| sll | 000000 | Shift |
| sllv | 000100 | ShiftV |
| sra | 000011 | Shift |
| srav | 000111 | ShiftV |
| srl | 000010 | Shift |
| srlv | 000110 | ShiftV |
| sub | 100010 | ArithLog |
| subu | 100011 | ArithLog |
| xor | 100110 | ArithLog |
| xori | 001110 | ArithLogI |
| lhi | 011001 | LoadI |
| llo | 011000 | LoadI |
| slt | 101010 | ArithLog |
| sltu | 101001 | ArithLog |
| slti | 001010 | ArithLogI |
| sltiu | 001001 | ArithLogI |
| beq | 000100 | Branch |
| bgtz | 000111 | BranchZ |
| blez | 000110 | BranchZ |
| bne | 000101 | Branch |
| j | 000010 | Jump |
| jal | 000011 | Jump |
| jalr | 001001 | JumpR |
| jr | 001000 | JumpR |
| lb | 100000 | LoadStore |
| lbu | 100100 | LoadStore |
| lh | 100001 | LoadStore |
| lhu | 100101 | LoadStore |
| lw | 100011 | LoadStore |
| sb | 101000 | LoadStore |
| sh | 101001 | LoadStore |
| sw | 101011 | LoadStore |
| mfhi | 010000 | MoveFrom |
| mflo | 010010 | MoveFrom |
| mthi | 010001 | MoveTo |
| mtlo | 010011 | MoveTo |
| trap | 011010 | Trap |
