# Part 1: Starting Slowly

Welcome to the first lesson about computer architecture! You've already read a
boatload of introduction (unless you skipped it), so now it's time for us to get
started by implementing the [`addu`](#addu) instruction.  We've already implemented this
for you in order to give you a base to build on.  If you don't like our code,
feel free to delete all of it and do this however you want.  In future lessons,
you'll be implementing functionality on your own (with only written instructions
like this).

## Your Task
We think there's a bug in our implementation.  You're task is to find it and fix
it.

For better or worse, in this lesson you won't be implementing much.  We want to
make sure you're comfortable with the interface before we starting throwing too
much at you.

### The [`addu`](#addu) Instruction
The [`addu`](#addu) instruction is one of the most straightforward instructions in this
architecture.  It takes its second two operands, adds them, and writes the
result into the first operand.  You can click on any instance of the [`addu`](#addu)
instruction to be taken to a glossary about it.

#### What's In A Name?
Why is this instruction called [`addu`](#addu) and not `add`? I'll let you in on a little
secret: There *is* an `add` instruction, but we're not making you implement
it. [`addu`](#addu) stands for Add Unsigned.  However, signed (using two's-complement)
and unsigned additions and subtractions are completely identical.  The only
difference between the two instructions is that `add` checks for signed integer
overflow while [`addu`](#addu) does not.  Specifically, `add` traps (calls into the
kernel) if there is an overflow.  Since we most certainly do not have a kernel
running on this emulator, these two instructions are exactly the same, and we
felt it pointless for you to implement the same functionality twice.
