# Part 1: Starting Slowly

Welcome to the first lesson about computer architecture! You've
already had to read a boatload of introduction, so now it's time for
us to get started by implementing the `addu` instruction. We've
already implemented this for you in order to give you a base to build
on. If you don't like the code, feel free to delete all of it and do
this however you want. In future lessons, you'll be implementing
functionality on your own (with some written instructions like this).

## Your Task

In this lesson, you'll be implementing the `subu` instruction! We've
included relevant descriptions for the instructions in this lesson below.

### The `addu` instruction

The `addu` instruction is one of the most straightforward instructions
in this architecture. It takes its second two operands, adds them, and
writes the result into the first operand.

### The `subu` instruction

The `subu` similarly takes its second two operands, calculates the second 
minus the third, and writes the result into the first operand.

#### What's in a name?

Why is this instruction called `addu` and not `add`? I'll let you in
on a little secret: There *is* an `add` instruction, but we're not
making you implement it. `addu` stands for Add Unsigned. However,
signed (using two's-complement) and unsigned additions and
subtractions are completely identical. The only difference between the
two instructions is that `add` checks for signed integer overflow
while `addu` does not. Specifically, `add` traps (calls into the
kernel) if there is an overflow. Since we most certainly do not have a
kernel running on this emulator, these two instructions are exactly
the same, and we felt it pointless for you to implement the same
functionality twice.


<!--
Assumptions:

- The student already knows how assembly instructions are formatted
- The student already knows what signed unsigned numbers are (we
  might have to explain prior to this part, however)
- The student understands overflow? Perhaps this will require explanation.
-->
