# Part 1: Binary Representations

Welcome to the second lesson.  Great work on completing lesson 1!  In this
lesson, we'll take one step down the stack of abstraction by moving from
assembly language to the binary representation that the processor deals with.

# Code Structure
Since we will no longer be parsing the instruction for you, you will need to
"decode" the instruction yourself and figure out what the operation behind the
binary is. To do this, we have provided you with two maps that you will need
to call into:

- `functMap`: For R-Format instructions (as you can see in the reference table
below), the operations are differentiated by the `funct`, since all the `opcodes`
are identical.
- `opcodeMap`: For J/I-Format instructions, the operation is determined by the
`opcode`, so you will directly look up the opcode in this table to switch into
the appropriate case for execution.

Since how the interpretation of R, J, and I format instructions vary but are
relatively uniform within each category, we have prestructured all the code to
reflect this. Each part has variables that you now either have to simply extract
from the binary *or* compute. All your implementations for the instructions
themselves will remain the same **except** jump/branch instructions, i.e. `j`,
`jal`, and `beq`: now that we are no longer parsing the assembly directly,
the instructions are provided as numeric offset rather than labels. This means you
will have to directly compute the `$pc` value, for which you should refer back to
the MIPS instructions glossary. Note that you don't need to change `jr`, since this
did not rely on the `labelToLine` lookup as the others did!

# Your Task
This lesson will revolve around translating your code from the previous lesson
to deal with **binary** rather than the textual **assembly**.  Lucky for you,
the structure will be quite similar, and none of the functionality will change.
The best way to approach this task will be to split you switch statement up into
three parts, to handle the three different instruction formats (R, I, and J).
Once you've extracted the arguments, the code will be the same as the last
lesson!

Refer to the section [below](#binary) to get the full set of details you'll need
to complete the implementation.  Some points to keep in mind:

- We've laid out a template of a potential way to organize your code.  That
  being said, feel free to scrap our boilerplate and write something of your own
  instead!
- Your implementation should separate between I, R, and J instructions: this
  will keep your code organized and easier to debug.
- Keep in mind your bitwise operations!  They are very useful when extracting
  values from a number.  Remember, though, `>>>` is **logical** right shift,
  while `>>` is **arithmetic** right shift.  Unless you're implementing the
  `sra` instruction, `>>` is going to give you surprising results.
- `functMap` and `opcodeMap` serve as clean ways to interface between the binary
  instruction and the code you wrote for the previous lesson.  Again, feel free
  to not use them if you think you can do it more cleanly yourself.  There isn't
  one right way to do this!

## Binary vs. Assembly
Modern processors only understand one thing: binary.  A simple circuit can be
either on or off, and processors are built up of billions of these simple
elements.  This has one major ramification in your program: assembly language
means absolutely nothing to processors.  The processor has no concept of the
string "addu $t5, $t0, $t0".  Rather, it would understand the binary sequence
"00000001001010000111100000100011."  This, in fact, is how instructions are
passed around under the hood. (And that binary string is how the processor
represents that previous `addu` instruction).  While it may at first look like a
jumbled mess, you'll soon see that it's entirely straightforward!  Remember that
no matter how complex they are, processors are fundamentally made of simple
components.

---
<a id="binary"></a>
# MIPS Binary Encodings

## Instruction Encodings

Where:

- `s`: `$rs` register
- `t`: `$rt` register
- `d`: `$rd` register
- `f`: funct
- `o`: opcode
- `i`: immediate value

| Instruction | Encoding                              |
| :---        | :---                                  |
| Register    | `000000ss sssttttt dddddaaa aaffffff` |
| Immediate   | `ooooooss sssttttt iiiiiiii iiiiiiii` |
| Jump        | `ooooooii iiiiiiii iiiiiiii iiiiiiii` |

My preferred way of accessing those fields is to shift the bits until the
desired field occupies the low-order bits, and then use the bitwise AND (`&`)
operator to "mask" the other bits, and leave us with just the ones we want.  As
a quick example, consider trying to extract the `$rt` register of an R-Format
instruction:

1. Shift **logically** right by 16 bits to bring the `$rt` field to the bottom.
   The bits now look like `00000000 00000000 000000ss sssttttt`.
2. Extract the `$rs` bits by ANDing with a number that has 1s in the `s`
   positions: `00000000 00000000 00000000 00011111`.
3. Done!  We're now left with `00000000 00000000 00000000 000ttttt`.

## Decoding Instructions
There are only a few steps to decoding an instruction in the MIPS architecture.
First, we must look at the opcode of the instruction where there are three
cases:

1. opcode = 0: R-Format instruction
2. opcode = 2 or 3: J-Format instruction
3. Otherwise: I-Format instruction

### R-Format Decoding
Once we know an instruction is R-Format, we must extract the components of the
instruction.  Using the method described above, we can easily extract `$rs`,
`$rt`, `$rd`, the shift amount, and the "funct."  All the pieces besides the
last one are operands, so we can ignore them for now.  Since the opcode is
always 0 for an R-Format instruction, differentiation comes from the funct
field.  In the table below, you can see the mapping from funct value to
operation.

| Instruction | Function |
| :---        | :----    |
| `addu`      | `100001` |
| `and`       | `100100` |
| `nor`       | `100111` |
| `or`        | `100101` |
| `sll`       | `000000` |
| `sra`       | `000011` |
| `srl`       | `000010` |
| `subu`      | `100011` |
| `xor`       | `100110` |
| `slt`       | `101010` |
| `sltu`      | `101001` |
| `jr`        | `001000` |

### J-Format Instructions
J-Format instructions are quite simple to decode.  After looking at the opcode,
the target address just needs to be masked off and we're all set in terms of
operands.  Since the opcode told us which instruction to execute, we just have
to perform that execution.

| Instruction | Opcode   |
| :---        | :----    |
| `j`         | `000010` |
| `jal`       | `000011` |

### I-Format Instructions
By now, you should be an expert in instruction decoding!  I-Format instructions
require slightly more effort to decode than J-Format instructions, but they're
still quite straightforward.

| Instruction | Opcode/Function |
| :---        | :----           |
| `addiu`     | `001001`        |
| `andi`      | `001100`        |
| `ori`       | `001101`        |
| `beq`       | `000100`        |
| `bne`       | `000101`        |
| `lbu`       | `100100`        |
| `lhu`       | `100101`        |
| `lw`        | `100011`        |
| `sb`        | `101000`        |
| `sh`        | `101001`        |
| `sw`        | `101011`        |
