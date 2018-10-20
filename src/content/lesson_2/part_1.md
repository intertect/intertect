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
what to do if we passed "addu $t5, $t0, $t0" to it. But, it will undestand something like
"00000001001010000111100000100011." This, in fact, is how instructions are passed around
under the hood. While it may look like a jumbled mess, we'll see how understanding
instructions like this is no more complicated than parsing the assembly instruction!

## Your Task
This lesson will revolve around you changing your execute function to take the 
**binary** instruction rather than the **assembly**. That being said, nearly all the code
you wrote in lesson 1 **should** be transferrable to your final output from this lesson. The
best way to approach this lesson is to change how you structure your switch statement to
parse out what the instruction is and its corresponding arguments. Some points to keep
in mind about implementation:

- We've laid out a template of a potential way to organize your code. That being said, feel
free to scrap our boilerplate and write something of your own instead!
- Your implementation **should** separate between I, R, and J instructions: this will keep
your code organized and easier to debug
- Instructions are passed in as **numbers**. Be careful! When doing bitwise operations, you
should almost **always** (except in the implementation of `sra`) use the logical shift operation
```>>>```. ``>>`` is the **arithmetic** shift operator, which has some subtle differences!
- functMap and opcodeMap serve as clean ways to interface between the binary instruction
and the code you wrote for the previous lesson. Again, feel free to not use them if you think
you can do it more cleanly yourself!

---
# The MIPS Instruction Set

Below is a **binary** implementation guide for MIPS, similar to what we provided in Lesson 1.

[Reference](http://www2.engr.arizona.edu/~ece369/Resources/spim/MIPSReference.pdf)
