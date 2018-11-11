# Part 1: Instruction Fetch (IF)
Welcome to the third lesson!  You've now graduated from the basics to the
meatier topics in computer architecture.  Now that you've got the fundamentals
under your belt, you're ready to start taking on some more complex ideas.  Strap
in and get ready!  We're about to tackle processor pipelining.

## Processor Pipelining
Processor pipelining is a key optimization found in nearly all processors today
(even many microcontrollers!) In short, instead of executing one instruction at
a time, once per clock-cycle, the processor breaks up each instruction into a
series of sub-tasks that can be executed simultaneously, leading to higher
utilization of the processor.

### Doing Some Laundry
The common analogy is to doing laundry.  Imagine you have 5 loads of laundry to
do (first imagine you have enough clothing to have that be necessary).  There
are three tasks for you to do: Washing, drying, and folding.  Further, imagine
that each load of laundry is one indivisible task, so that the load is washed,
dried, and folded as a unit.

Let's look at one possible way of performing the task of doing laundry.  You
take the first load, put it in the washer, wait for it to complete, dry the
clothes, fold the clothes, and then start over with the second load.  This is
obviously quite inefficient!  Every component of the system has terrible
utilization.  You would obviously want to have one load in the wash, one in the
dryer, and one being folded at all times.  This is exactly the same as with a
processor. There are many stages to instruction execution, and if only one
instruction is being executed at a time, then there are many parts of the
processor that aren't being properly utilized.

### Throughput vs. Latency
An interesting property of pipelining is that it **increases** both latency and
throughput.  Throughput is the number of instructions executed per unit time
(usually a second), while latency is the time it takes from the start of
execution of an instruction to the time it has finished.  This is a common
trade-off that you'll see in all areas of computer science.  In the case of
pipelining, it's obvious why we would get higher throughput since there is more
utilization on the processor.  However, it might not be as clear why latency
would go up.

There are a few reasons for this, but the primary reason is that since all the
pipeline stages are controlled by the same clock, the speed of that clock will
be fundamentally limited by the latency of the slowest pipeline stage.  Using
the laundry analogy again, if your washer takes 45 minutes, but the dryer takes
60, your washer is going to be unused while waiting for the next load of laundry
to leave the dryer.

Back to throughput though, after adding a pipeline, we will have drastically
sped up the pipeline.  Once we've reached steady state (since it will take a few
clock cycles to fill up the pipeline), we'll be executing approximately 1
instruction per clock-cycle (IPC), but the clock cycles will be multiple times
shorter since they each have less functionality.  As you can see, pipelining is
a huge win for performance.

## Pipeline Stages

We've talked a lot about pipelines, but what are the actual stages?  The MIPS
architecture uses the common RISC pipeline:

- **Instruction Fetch (IF)**: Fetches from memory the instruction being pointed
  at by the program counter (PC).
- **Instruction Decode (ID)**: Instruction is parsed and control lines set
  appropriately.  Values from registers are read from the register file during
  this stage and saved for future calculations.  However, if it is a branch or
  jump instruction, it is executed here and the PC updated.
- **Execute (EX)**: Performs arithmetic operations on the operands if the
  instruction was not a branch or jump.  If the instruction was a load or store
  address to read/write is calculated here.
- **Memory (MEM)**: Reads from, and writes to, memory are performed here using
  the addresses calculated in the EX stage.
- **Writeback (WB)**: Saves (writes back) results to registers **if appropriate**.

## Latches
**Important**: Do NOT skip this section, otherwise implementing this lesson and
all future ones will be impossible!

Naturally, as we divide the pipeline into separate blocks, we need a way to
communicate between the blocks.  The way a processor achieves this is through
what are called "latches." Latches effectively act as boxes for dumping
information between parts of the pipeline: at the beginning of a clock cycle,
each pipeline stage will look at the latch connecting it to the previous one to
pull input from there and execute on it.  For example, during one clock cycle,
IF will fetch an instruction and save it in the IF/ID latch.  During the next
cycle, ID will pull from this latch and perform the decode before saving its
result in the ID/EX latch and so on.  While this is implemented in hardware in
reality, we're emulating it as objects here.

- We **expect** all instructions to be decoded with the appropriate names.  If
any latch is set to `undefined`, we assume the pipeline stage reading from this
latch is to be skipped.  Object latch saves must match **exactly** these
names/types for these cases:

- `latches.if_id` (IF/ID latch): Must be the `unsigned 32-bit` binary
  instruction!  Remember once again to call `ToUint32(x)` on whatever binary
  result you get before storing it in the latch
- `latches.id_ex` (ID/EX latch): Construct an object that has the following
  fields/values:
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
- `latches.ex_mem` (EX/MEM latch): This is perhaps the most complicated latch,
  since execute only performs a subset of the instructions and must wrap up all
  others for MEM to continue
  - `instruction`: Instruction that was decoded during ID stage.  This is simply
  passed along in the cases where the decoded instruction is to be executed
  during MEM
  - `memory_address`: For load/store instructions, the final address is
  determined in the EX stage and stored before it is executed in the MEM stage.
  This is where the info is stored
  - `result`: If an instruction was executed, this is where the result is stored
  - `location`: Likewise, if execution was performed, this specifies whether the
  result is to be saved in memory or registers.  As a result, the value of this
  field should always either be `"memory"` or `"registers"`
  - `position`: Position in the final saving location where the result is to be
  saved, i.e. for `memory` this indicates an offset and for `registers` this
  indicates the particular register
- `latches.mem_wb` (MEM/WB latch):
  - `instruction`: Instruction that was decoded during ID stage.  This will not
  be used for further execution but will be critical later when parallelizing
  our pipeline
  - `result`: Value to be written/stored
  - `location`: Should either be `"memory"` or `"registers"` to indicate which
  stage of the pipeline saving should occur
  - `position`: Which register to be written to (if `location` is `"registers"`)

## Your Task
The first part of the pipeline is fetching the instruction.  It's typically
denoted just as IF, which stands for "instruction fetch." As we've seen in the
past, the `pc` dictate what in the program is being executed.  Unlike past
lessons, however, the program is now stored in memory.  So, in this lesson,
you'll have to figure out a way to pull the values from memory and return the
binary instruction.  We will be implementing the pipeline **one step at a
time**, which means you're only responsible for the implementation of fetch in
this part (i.e. we have decode, execute, and write already correctly implemented
for you).  You must return a **binary** value for the execution to work properly
per the API described above.  We've also taken care of updating `pc`, so you
don't have to worry about adjusting that!

**Notes** Remember the following common pitfalls:

- Instructions are **unsigned** 32-bit.  Make sure to use the `ToUint32(x)`
function to convert your return after any bit manipulation you do!
- Instructions are to be read from high bit to low (i.e. big-endian)
- The current instruction is pointed to by `pc`

## Hazards
While the ideal pipelined CPI is 1, there are some circumstances where this will
not be the case.  Specifically, when consecutive instructions depend on one
another in some way, i.e.  executing a jump instruction may result in the
following instruction being skipped entirely.  This is the focus of Lesson 4, so
we'll be putting this issue on the back burner temporarily, with the
understanding that it is resolved via communication between the pipeline stages,
much in the way data is handed off between them.
