# Part 1: Fetch
Welcome to the third lesson on computer architecture! This lesson is going to be
concentrating on pipelining. You've already understood a lot about how processors
work at this point! You now know how instructions are relayed to the processor and
how it transforms these seemingly random string of bits into actions that we see.
That being said, processors have become more and more complex since they were
originally invented. One of the main innovations that led the processor to its
current state is something called "pipelining."

Like the key principle of modularity in software engineering, the functionality of
processors is separated into silos that talk to one another. Pipelining is one of the
key elements that allows processors to work on different tasks simultaneously, which
is the focus in Lesson 4. Here, we'll be effectively separating the processor you've
currently developed into well separated logical units, specifically:

- Fetch: Grabs the instruction being pointed at by the `pc`
- Decode: Determines the instruction along with its arguments from the binary
- Execute: Performs the operation determined via the decode
- Write: Saves the result from execution to the desired location

So, while there is no difference in capability that will result in our work in this lesson,
we'll be effectively "refactoring" your implementation to allow for clarity and (more 
importantly) significant speedup.

# Your Task
The first part of the pipeline is fetching the instruction. As we've seen in the past,
the `pc` dictate what in the program is being execute. Unlike past lessons, however,
the program is now actually being stored in memory. So, in this lesson, you'll have to
figure out a way to pull the values from memory and return the binary instruction. We
will be implementing the pipeline **one step at a time**, which means you're only
responsible for the implementation of fetch in this part (i.e. we have decode, execute, and
write already correctly implemented for you). You must return a **binary** value for the
execution to work properly. We've also taken care of updating `pc`, so you don't have to
worry about adjusting that after hitting step!

**Notes** Remember the following common pitfalls:

- Instructions are 32-bit
- Instructions are to be read from high bit to low
- Current instruction is pointed to by `pc`

[](../images/fetch.jpg)
<img src="https://media.giphy.com/media/5G98t8QjqBLK8/giphy.gif"/>
