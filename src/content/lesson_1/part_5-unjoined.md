# Part 5: Jump Around!
Now it's time to implement control flow.  With this, your emulator will be
Turing Complete.  Congratulations! You will have a processor in the JavaScript
virtual machine, in your browser, on you Operating System, running on a real
physical processor.  If you're running in a VM, you've got even more levels in
there.  Isn't that exciting?

There are some strange things about jump instructions that we'll gloss over for
this lesson.  Be prepared for strangeness starting in Lesson 2.

## Branch Instructions
We only have you implement beq since that's enough to do anything else you might
want to do.  It's possible to emulate any other branch instruction if you really
want to.  For example, to check if one number is less than another, you can
subtract and use some bit shifts.  It's not the most wonderful thing, but it
works.

### How To Calculate Where To Go?
Branch instructions are immediate format where the operand is an offset from the
address of the *next* instruction.  More specifically, the immediate operand is
the offset *divided by 4*.  Since all instructions are 32 bits, the bottom two
bits are always 0.  This allows us to get four times greater coverage from a
branch instruction.  Once the bits have been shifted, they are also sign
extended and then added to the address of the next instruction.

## Jump Instruction

Jump instructions are much more straightforward. `jr` resets the program counter
with the address contained in whatever register is passed in.  This allows us to
go to any place in memory we could possibly want.

`j` and `jal` use the same format, while their semantics are slightly different.
Both of them are an opcode followed by as many bits of address as possible,
which happens to be 26.  They both use the same divide-by-four trick as before,
so we actually end up with 28 bits in the end.  Instead of using these as an
offset, the target is instead overlaid on the program counter.  This means the
new address is the top 4 bits of the program counter (for the next instruction)
and then 28 bits of address.

`j` is an unconditional jump, which means it always goes to its target. `jal` is
unconditional as well, but it also saves the address of the next instruction
into the `$ra` or Return Address register.  This allows the programmer to
implement returning from function calls.
