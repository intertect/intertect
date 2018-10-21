# Part 4: Memory (MEM)
We've almost made it to the end of pipelining! With the desired function executed and result
in hand, all that is left to do is save the result at the location desired. As we've seen,
some of the instructions write the results of operations into registers and others into
memory. The reason memory write backs happen before registers, which is the final step of the
pipeline, will become apparent in the last lesson, where we talk about parallelizing the
operations of the pipeline. In any case, these remaining stages of the pipeline are perhaps
the most straightforward, assuming you wrapped everything cleanly in the previous stages!

# Your Task
Given the information you passed along from the execution stage, 
write it to memory if thej instruction you're executing has a memory write. If not,
simply pass along the information to the final stage of the pipeline to allow the
information to get written to a register instead! Some points to keep in mind:

- Remember that you passed in the memory results as an array, meaning you'll have to
write the results for those incrementally
- Remember you should simply ignore write values that are to be written to registers,
which you should have encoded in the output of the execute stage

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
