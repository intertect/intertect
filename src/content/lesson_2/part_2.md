# Part 2: Branch Delay Slot

If you've been paying close attention, you might have been confused by all the
`nop`s littering the branching and jumping code.  Wonder no longer!  Those are
because of the **Branch Delay Slot**.  What is a branch delay slot?  I'm glad
you asked.

## What on Earth is a Branch Delay Slot?

The branch delay slot is the instruction immediately following a branch or a
jump which is executed **no matter what**.  For example, the following
instruction sequence:

```
addi $t0, $zero, 0x0
beq $zero, $zero, label1
addi $t0, $zero, 0xFAFA

label1:
sw $t0, 0x10($zero)

```

It would be reasonable to assume that since the branch must be taken, the value
stored at address `0x10` would be `0x0` since that's what `$t0` was equal to
before the branch.  However, the value that is actually written is `0xFAFA`.
The instruction immediately following a branch or jump is taken no matter what!

## Why on Earth is There a Branch Delay Slot?

The branch delay slot is simply an optimization.  We'll cover it more in the
next lesson, but simply put, branches and jumps force the processor to wait so
having an instruction that is always executed allows the processor to do
something in what would otherwise be dead time.

## Your Task
Implement the branch delay slot!  You have to keep track of whether or not
there's an instruction in the branch delay slot as well as the location to jump
to after the branch delay instruction has been executed.

The flow is something like this:
1. Encounter a branch or jump at instruction N.
2. Calculate and save the destination address, but don't jump there yet.
3. Perform instruction N+1 as normal.
4. Before finishing instruction N+1, set the program counter to the address you
   previously calculated.
