# Part 5: Jump Around!

Now it's time to implement control flow. With this, your emulator will
be Turing Complete. Congratulations! You will have a processor in the
JavaScript virtual machine, in your browser, on you Operating System,
running on a real physical processor. If you're running in a VM,
you've got even more levels in there. Isn't that exciting?

There are some strange things about jump instructions that we'll gloss
over for this lesson. Be prepared for strangeness starting in Lesson
2.

## Branch Instructions

We only have you implement beq since that's enough to do anything else
you might want to do. It's possible to emulate any other branch
instruction if you really want to. For example, to check if one number
is less than another, you can subtract and use some bit shifts. It's
not the most wonderful thing, but it works. <!-- Should we also have
them implement blt? -->

### How To Calculate Where To Go?

Branch instructions are immediate format where the operand is an
offset from the address of the *next* instruction. More specifically,
the immediate operand is the offset *divided by 4*. Since all
instructions are 32 bits, the bottom two bits are always 0. This
allows us to get four times greater coverage from a branch
instruction. Once the bits have been shifted, they are also sign
extended and then added to the address of the next instruction.

## Jump Instruction

Jump instructions are much more straightforward. `jr` resets the
program counter with the address contained in whatever register is
passed in. This allows us to go to any place in memory we could
possibly want.

`j` and `jal` use the same format, while their semantics are slightly
different. Both of them are an opcode followed by as many bits of
address as possible, which happens to be 26. They both use the same
divide-by-four trick as before, so we actually end up with 28 bits in
the end. Instead of using these as an offset, the target is instead
overlaid on the program counter. This means the new address is the top
4 bits of the program counter <!-- TODO: Must check if program counter
for current or next instruction --> and then 28 bits of address.

`j` is an unconditional jump, which means it always goes to its
target. `jal` is unconditional as well, but it also saves the address
of the next instruction into the `$ra` or Return Address
register. This allows the programmer to implement returning from
function calls.
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
