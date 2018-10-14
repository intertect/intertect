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

- **Fetch**: Grabs the instruction being pointed at by the `pc`
- **Decode**: Determines the instruction along with its arguments from the binary
- **Execute**: Performs the operation determined via the decode
- **Write**: Saves the result from execution to the desired location

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

## Why Pipeline
As we briefly alluded to above, separating the execution of an instruction into pipeline stages is primarily useful in allowing different isntructions to be executed "simultaneously." After all, the way we currently have the processor set up, a single instruction must execute in its entirety before the following one is even started. Specifically, that instruction must be fetched from memory, decoded to its type, executed, and written *all* before the next one is even considered. However, assuming consecutive instructions don't depend on one another (we'll get back to this later), they can go through the different stages of the pipeline without fear of resulting in an error in the execution of the other if the pipeline stages are developed as to be independent of one another. In this diagram:

[](https://upload.wikimedia.org/wikipedia/commons/c/cb/Pipeline%2C_4_stage.svg)

We see that one of the instructions can be going through a "decode" stage while the next instruction that is to be executed can be fetched and the previous executed. This means pipelining allows instructions to greatly improve throughput of the system. The typical metric for measuring processor throughput is referred to as CPI, or cycles per instruction. A clock cycle effectively captures one step through the pipeline, i.e. the time it would take to move from fetch to decode or decode to execute. 

Prior to pipelining, instructions would typically take 3-4 cycles to complete. After pipelining, this is *still* the case! Remember, pipelining is **not** increasing the speed of the execution of a single instruction. That is, if we had two processors, one pipelined and one not, that were being tested against a single instruction, they would perform identically. However, in those same 3-4 cycles, a pipelined processor will ideally execute 3-4 instructions, since at *each* clock cycle, there will be an instruction that is being written back, i.e. an instruction being completed, whereas this is only the case on the fourth cycle for a non-pipelined CPU. So, while the speed remains the same, the CPI drops to nearly 1, since we now have roughly an instruction being completed at each clock tick.

## Hazards
While the ideal pipelined CPI is 1, there are some circumstances where this will not be the case. Specifically, when consecutive instructions depend on one another in some way, i.e. executing a jump instruction may result in the following instruction being skipped entirely. This is the focus of Lesson 4, so we'll be putting this issue on the back burner temporarily, with the understanding that it is resolved via communication between the pipeline stages, much in the way data is handed off between them.
