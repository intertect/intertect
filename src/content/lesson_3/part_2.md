# Part 2: Decode (ID)
Now that we have an understanding of how processor pipelining works, we'll move
on to implementing the second stage: ID! Similar to IF, ID stands for instruction
decode. Luckily, with each of these stages, the function
is pretty transparent from its name. So, the decode stage takes the binary 
instruction and extracts out the information that is wrapped up in it, i.e. what
instruction it is and its corresponding arguments. In other words, it determines
whether the instruction is an R, J, or I type instruction and extracts the 
corresponding arguments from the binary accordingly (i.e. `$rt`, `$rs`, `$rd` and such for R
instructions).

# Your Task
This code will be nearly identical to what you were doing in the cases of the 
switch statement in the initial implementation. Specifically, rather than extracting
the `$rs`, `$rd`, `$rt`, `$shamt`, and `$funct` (in the R case) in *each* case of the
switch statement (as you may have done initially), we will extract these instructions
in a separate pipeline stage. Some pointers to keep in mind:

- While it *is* technically possible to separate the decode into each instruction 
as you did in the previous implementation, it is much more true to form to separate it 
by the type of instruction (R, I, or J). With that in mind, you'll need to remember
that some instructions of a given type may *not* use all of the arguments packed into
the binary, i.e. some may not use the `$rd` even though you've decoded it. However,
this is more of something you'll need to remember in your implementation of execute.
- Once again, you're likely saving values in the IF/ID latch as **numbers**. 
Again, be careful! and use the **logical shift operation**
```>>>``` instead of the ``>>`` **arithmetic** shift operator

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
