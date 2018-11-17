# Part 1: Parallelizing
Welcome to the final lesson on computer architecture! This lesson is going to be
concentrating on exploiting the modularization you did Lesson 3 for speed. You'll
be specifically working on parallelizing the operations of the pipeline. Like we
mentioned, there could be complications when instructions depend upon one another,
but we're going to assume that that's not the case in this part of the lesson. In the
following part, we'll introduce these cases, called "hazards."

# Code Structure
The Latch API that was exposed in the previous lesson remains largely the same here. 
However, there is a new addition: 

- `latches.term_if`: Boolean that sets whether to stop fetching instructions or not. If
set to true, execution of the program stops. As explained below, whenever you encounter
the binary  `0xFAFAFAFA`, program execution should terminate!

# Your Task
In the previous lesson, we had a mock `processMIPS` function that you could see
to get a sense of what was going on behind the scenes. Now, it's your turn to implement this
function! It's going to be different from the previous lesson, since this time we
are executing instructions in **parallel.** Therefore, you must continue execution 
of previously run commands whose results were saved in the latches at the
following step of the pipeline. Here are some notes to help you through this:

- Program termination is now denoted by an arbitrary sequence of binary that will never
appear otherwise in a program: `0xFAFAFAFA`. You **will** have to modify `ID` and set
the `latches.term_if` in this step if you encounter this binary!
- The `latches` variable is an object that should maximally have its **four**
latch slots used. The *only* times when this will **not** be the case are at the 
beginning and end of the program execution, i.e. where you are first loading things 
into an empty pipeline or flushing out the remaining steps before program termination.
- You should execute a stage of the pipeline if a given `latch` slot acts as input to it
and is not `undefined.` In line with that, whenever you execute a stage of the pipeline,
make sure to `flush` it, i.e. set the corresponding latch from which you got the input
to `undefined`! If you don't, the program will never terminate.
- You will **not** have to modify your `IF`, `EX`, `MEM` or `WB` functions:
simply call them with the appropriate arguments! You may look at what we called the `dummy`
pipeline in the parts of Lesson 3 as a guidance for what the function will look like.
- The `pipeline` starts empty! This means, when you press `Step` on the UI, you will 
**NOT** see anything updating (other than the `pc`) until at least four steps in! After
that point, however, you should see updates on each click of `Step`, although the update
will correspond to the instruction three above your current spot.

# Latch API Reference
This is left here as a reference to refer to:

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
  - `result`: Value to be written/stored
  - `location`: Should either be `"memory"` or `"registers"` to indicate which stage of the
  pipeline saving should occur
  - `position`: Which register to be written to (if `location` is `"registers"`)
