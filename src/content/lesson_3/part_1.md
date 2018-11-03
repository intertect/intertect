# Part 1: Fetch (IF)
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

- **Fetch (IF)**: Grabs the instruction being pointed at by the `pc` (program counter).
- **Decode (ID)**: Instruction is parsed and control lines set appropriately.  However, 
  if there is a branch or jump instruction, it is executed here and the PC updated.
- **Execute (EX)**: Performs the operation from the decode if it is *not* a branch/jump, 
  which was executed in the previous ID stage, or having to do with memory, which will
  be executed in the following MEM stage.
- **Memory (MEM)**: Executes operations dealing with memory, i.e. loads/stores. Also
  conditionally saves results of the EX stage to memory *if appropriate* for the
  instruction that was executed. Hands off all other results to the final stage to save 
  to registers.
- **Write Back (WB)**: Saves any results that were not stored to memory into registers
  *if appropriate* for the instruction.
  
So, while there will be no increase in your processor's capability after this lesson,
we'll have a highly "refactored" implementation of its functionality, which will 
allow for greater clarity and (more importantly) significant subsequent speedup.

# Latches
**Important**: Do NOT skip this section, otherwise implementing this lesson and all future ones
will be impossible! 

Naturally, as we divide the pipeline into separate blocks, we need a way to communicate between
the blocks. The way a processor achieves this is through what are called "latches." Latches
effectively act as boxes for dumping information between parts of the pipeline: at the beginning
of a clock cycle, each pipeline stage will look at the latch connecting it to the previous one
to pull input from there and execute on it. For example, during one clock cycle, IF will fetch
an instruction and save it in the IF/ID latch. During the next cycle, ID will pull from this 
latch and perform the decode before saving its result in the ID/EX latch and so on. While this 
is implemented in hardware in reality, we're emulating it as objects here. 

- We **expect** all instructions to be decoded with the appropriate names. Object latch saves must match **exactly** these names/types for these cases:
  
- `latches.if_id` (IF/ID latch): Must be the `unsigned 32-bit` binary instruction! Remember once
  again to call `ToUint32(x)` on whatever binary result you get before storing it in the latch
- `latches.id_ex` (ID/EX latch): Construct an object that has the following fields/values:
  - R instruction: 
    - `op_str`: Functional name for the instruction (i.e. `addu`)
    - `rs`: *Address* location for `$rs`
    - `rt`: *Address* location for `$rt`
    - `rd`: *Address* location for `$rd`
    - `shamt`: Value for `$shamt`
  - J instruction: 
    - `op_str`: Functional name for the instruction (i.e. `jal`)
    - `target`: Binary address value for destination
  - I instruction: 
    - `op_str`: Functional name for the instruction (i.e. `addiu`)
    - `rs`: *Address* location for `$rs`
    - `rt`: *Address* location for `$rt`
    - `imm`: Value for immediate to be used
- `latches.ex_mem` (EX/MEM latch): This is perhaps the most complicated latch, since execute
  only performs a subset of the instructions and must wrap up all others for MEM to continue
  - `instruction`: Instruction that was decoded during ID stage. This is simply passed along
  in the cases where the decoded instruction is to be executed during MEM
  - `memory_address`: For load/store instructions, the final address is determined in the EX
  stage and stored before it is executed in the MEM stage. This is where the info is stored
  - `result`: If an instruction was executed, this is where the result is stored
  - `location`: Likewise, if execution was performed, this specifies whether the result is
  to be saved in memory or registers. As a result, the value of this field should always either
  be `"memory"` or `"registers"`
  - `position`: Position in the final saving location where the result is to be saved, i.e. for
  `memory` this indicates an offset and for `registers` this indicates the particular register 
- `latches.mem_wb` (MEM/WB latch): 
  - `instruction`: Instruction that was decoded during ID stage. This will not be used for
  further execution but will be critical later when parallelizing our pipeline
  - `result`: Value to be written/stored
  - `location`: Should either be `"memory"` or `"registers"` to indicate which stage of the
  pipeline saving should occur
  - `position`: Which register to be written to (if `location` is `"registers"`)

# Your Task
The first part of the pipeline is fetching the instruction. It's typically denoted just as
IF, which stands for "instruction fetch." As we've seen in the past,
the `pc` dictate what in the program is being executed. Unlike past lessons, however,
the program is now stored in memory. So, in this lesson, you'll have to
figure out a way to pull the values from memory and return the binary instruction. We
will be implementing the pipeline **one step at a time**, which means you're only
responsible for the implementation of fetch in this part (i.e. we have decode, execute, and
write already correctly implemented for you). You must return a **binary** value for the
execution to work properly per the API described above. We've also taken care of updating `pc`, 
so you don't have to worry about adjusting that!

**Notes** Remember the following common pitfalls:

- Instructions are **unsigned** 32-bit. Make sure to use the `ToUint32(x)` function to convert
your return after any bit manipulation you do!
- Instructions are to be read from high bit to low (i.e. big-endian)
- The current instruction is pointed to by `pc`

## Why Pipeline
As we briefly alluded to above, separating the execution of an instruction into pipeline stages 
is primarily useful in allowing different instructions to be executed "simultaneously." After 
all, the way we currently have the processor set up, a single instruction must execute in its 
entirety before the following one is even started. Specifically, that instruction must be 
fetched from memory, decoded to its type, executed, and written *all* before the next one is 
even considered. However, assuming consecutive instructions don't depend on one another (we'll 
get back to this later), they can go through the different stages of the pipeline without fear 
of resulting in an error in the execution of the other if the pipeline stages are developed as 
to be independent of one another. In this diagram:

[](https://upload.wikimedia.org/wikipedia/commons/c/cb/Pipeline%2C_4_stage.svg)

We see that one of the instructions can be going through a "decode" stage while the next 
instruction that is to be executed can be fetched and the previous executed. This means 
pipelining greatly improves throughput of the system. The typical metric for measuring 
processor throughput is its CPI, or cycles per instruction. A clock cycle effectively captures 
one step through the pipeline, i.e. the time it would take to move from fetch to decode or 
decode to execute. 

Prior to pipelining, a single instruction would typically take 3-4 cycles to complete. After 
pipelining, this is *still* the case! Remember, pipelining is **not** increasing the speed of 
the execution of a single instruction. That is, if we had two processors, one pipelined and one 
not, that were being tested against a single instruction, they would perform identically. 
However, in those same 3-4 cycles, a pipelined processor will ideally execute 3-4 instructions, 
since at *each* clock cycle, there will be an instruction that is being written back, i.e. an 
instruction being completed, whereas this is only the case on the fourth cycle for a 
non-pipelined CPU. So, while the individual instruction speed remains the same with a pipelined 
processor, the CPI drops to nearly 1, since we now have roughly an instruction being completed 
at each clock tick.

## Hazards
While the ideal pipelined CPI is 1, there are some circumstances where this will not be the 
case. Specifically, when consecutive instructions depend on one another in some way, i.e. 
executing a jump instruction may result in the following instruction being skipped entirely. 
This is the focus of Lesson 4, so we'll be putting this issue on the back burner temporarily, 
with the understanding that it is resolved via communication between the pipeline stages, much 
in the way data is handed off between them.
