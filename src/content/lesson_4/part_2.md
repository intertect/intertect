# Part 2: MIPS Hazards

Data (and control) hazards and forwarding are two very important topics
in the design of processors. A data hazard occurs when there is a
dependency between two registers. A control hazard occurs when the
processor might not know the result of a branch before the next
instruction must be fetched. For example, in the following program,
there is a data dependency between the first two lines since one writes
to `$t0` and the next reads from it.

``` asm
addi $t0, $zero, 10
addi $t1, $t0, 10
```

The perfect program for the CPU we've been building is one that has no
data dependencies since we could then keep the pipeline full at all
times. As we add data dependencies, however, our execution speed slows
way down since we have to wait for results to become available. Looking
back at the previous example, we would have to wait until the first
instruction completes the WB stage before the second instruction
can enter the EX stage. That's two cycles of stalling that have to
happen!

That's where forwarding comes into play. Forwarding is an optimization
performed by the processor that cuts down the number of stalled cycles.
In the previous case, the processor would take the result of the first
instruction's EX stage and forward it right back into the execute
stage for the next instruction. In this way, the processor has
completely eliminated the two cycles of stalls.

The way I like to think about forwarding is as follows: When is the
earliest pipeline stage after which the CPU knows the result of an
operation? From this, it is possible to derive all the possible
forwarding rules.

For example, since jumps and branches happen in the ID stage, an add
(which gets its result from the EX stage), followed by a branch
depending on the result of that add, must stall for one cycle since the
data cannot be available to the branch until after execute has finished.

# Data Hazards

There are three types of Data hazards:
  - Read After Write (RAW)
  - Write After Read (WAR)
  - Write After Write (WAW)

Let's go through them in order:

## Read After Write (RAW)

This is the case we used in the overview.

``` asm
addi $t0, $zero, 10
addi $t1, $t0, 10
```

In this case, the second instruction's **read** depends on the first
instruction's **write**. The processor must take care to make sure the
result of the write is seen by the second instruction

## Write After Read

This is the case where the second instruction writes to one of the
operands that the first instruction is reading. It may be apparent that
we don't have to worry about this. WAR data hazards are only an issue on
processors that execute instructions in parallel where it's entirely
possible that the second instruction will finish executing before the
first reads its data.

``` asm
addi $t0, $t1, 10
addi $t1, $zero, 10
```

## Write After Write

This is very similar to the previous case and we won't need to deal with
it. It is slightly more complicated since the ordering of writes must be
maintained instead of just making sure that the first instruction has
the right inputs.

``` asm
addi $t1, $zero, 10
addi $t1, $zero, 20
```

# Control hazards

As touched on at the end of the overview, a control hazard occurs when
the result of a branch comparison or the jump target is not known when
it comes time to fetch the next instruction.

``` asm
addi $t0, $zero, 1
beq $t0, $t1, target
```

The processor has to stall for one cycle since there is a RAW dependency
between the `addi` and the `beq` instructions that won't be resolved by
the time the `beq` instruction is in the ID stage. The stall can be
eliminated if the programmer or compiler can reorder instructions so
that there is an unrelated instruction between the `addi` and `beq`.

However, there is another problem: The processor doesn't resolve the
branch or jump until the ID stage, so there will always be a stall
in the IF stage when we encounter a jump or branch. This, finally, is
the explanation for the branch delay slot. By having flow control
resolve in the ID stage and an unconditional instruction execution
immediately following, this stall can be completely eliminated.

# Forwarding

A quick note before we get started with the forwarding rules: you must
always check all read registers for data dependencies. The rules below
only deal with one register at a time, but you must check both to make
sure data is available.

In order to derive the rules for forwarding, we are first going to
define two kinds of instructions by when their result become available:

1. EA instructions are those whose results are produced in the Execute
    (third) stage
      - Everything except loads, stores, and control flow
2. MA instructions are those whose results are produced in the Memory
    (fourth) stage
      - Loads and stores

Next, we define another two kinds of instructions based on when they
require the values of their arguments:

1. DR instructions require their arguments in the Decode (second) stage
      - Control flow instructions
2. ER instructions require their arguments in the Execute (third) stage
      - Everything else
      - Loads and stores are here because they calculate the target in
        the EX stage and merely read in the MEM stage.

Now that we have these definitions, we can see that there are a very
limited number of cases that we have to consider.

## DR instructions

We need to look at the EX, MEM, and WB stages since until
WB has finished the result won't be back in the register file.

### EX slot

There are three possible cases for the instruction in the execute slot:

1. No data dependencies\! Nothing to do here.
2. EA instruction so we must delay for one cycle
3. MA instruction so we must delay for two cycles

### MEM slot

1. No data dependencies.
2. EA instruction. In this case the value has already been computed and
    it can be forwarded to us
3. MA instruction. We have to delay one cycle for the result to become
    available.
      - In reality we'd have to wait longer since there are memory
        latencies, but we don't care about for the purposes of this
        lesson.

### WB slot

1. No data dependencies. Nothing to do
2. If there is a data dependency, then the result has already been
    computed and it should be forwarded to us

## ER instructions

In this case, we only have to look at the MEM and WB stages

### MEM slot

1. No data dependency.
2. EA instruction. We simply are forwarded the value
3. MA instruction. We must stall for one cycle for the result to become
    available

### WB slot

1. No data dependencies. Nothing to do
2. Same last last time: The value is available

# Your Task
The final part of this project is implementing all the hazards explained above. 
Here is a condensed view of the rules that we wish you to implement:

| F  | D  | E  | M  | W  | Operation        |
| -- | -- | -- | -- | -- | ---------------- |
| ?? | DR | EA | ?? | ?? | Delay one cycle  |
| ?? | DR | MA | ?? | ?? | Delay two cycles |
| ?? | DR | ?? | EA | ?? | Forward M -\> D  |
| ?? | DR | ?? | MA | ?? | Delay one cycle  |
| ?? | DR | ?? | ?? | EA | Forward W -\> D  |
| ?? | DR | ?? | ?? | MA | Forward W -\> D  |
| ?? | ?? | ER | EA | ?? | Forward M -\> E  |
| ?? | ?? | ER | MA | ?? | Delay one cycle  |
| ?? | ?? | ER | ?? | EA | Forward W -\> E  |
| ?? | ?? | ER | ?? | MA | Forward W -\> E  |
