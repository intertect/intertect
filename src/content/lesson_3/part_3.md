# Part 3: Execute (EX)
Now that we have fetched and decoded the instruction, we move onto the beefy
chunk of the processor's work.  This is the stage of the pipeline where the ALU
gets involved and starts to actually perform the computations that power the
computer.

# Code Structure
There are no significant changes between this and the previous part. Refer to
the Latch API below to see what is expected in your output of EX.

# Your Task
Luckily, you've already implemented most of the logic for this stage of the
processor in the first couple lessons!  The main difference is that you will no
longer be writing the results immediately into the registers or memory. Instead,
you will use the EX/MEM latch to save the location of the write for later.
Since the writes can end up in either memory or registers, you will have to have
a flag that indicates where to store the data.

That being said, you now have to account for any instructions that were already
executed in the ID stage, i.e. jumps/branches.  Per the implementation from the
last part, in these cases, EX will read an `undefined` value from the ID/EX
latch.  You **must** catch this case and respond appropriately (i.e. simply
`return`).  Here are some notes to keep in mind:

- You will not execute instructions directly manipulate memory in this stage,
  i.e. you will not implement loads/stores in EX.
- Memory writes are done in steps (i.e. byte-wise), so for any result that
  requires a memory write, the `result` is expected to be an array (even if just
  with a single element), arranged as big-endian.

# Latch API Reference
This is left here as a reference to refer to:

- For any latch set to `undefined`, we assume the pipeline stage reading from
  this latch is to be skipped.
- `latches.if_id` (IF/ID latch): Must be the `unsigned 32-bit` binary
  instruction!  Remember once again to call `ToUint32(x)` on whatever binary
  result you get before storing it in the latch.
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
  others for MEM to continue.
  - `instruction`: Instruction that was decoded during ID stage.  This is simply
  passed along in the cases where the decoded instruction is to be executed
  during MEM.
  - `memory_address`: For load/store instructions, the final address is
  determined in the EX stage and stored before it is executed in the MEM stage.
  This is where the info is stored.
  - `result`: If an instruction was executed, this is where the result is stored
  - `location`: Likewise, if execution was performed, this specifies whether the
  result is to be saved in memory or registers.  As a result, the value of this
  field should always either be `"memory"` or `"registers"`.
  - `position`: Position in the final saving location where the result is to be
  saved, i.e. for `memory` this indicates an offset and for `registers` this
  indicates the particular register.
- `latches.mem_wb` (MEM/WB latch):
  - `instruction`: Instruction that was decoded during ID stage.  This will not
  be used for further execution but will be critical later when parallelizing
  our pipeline.
  - `result`: Value to be written/stored
  - `location`: Should either be `"memory"` or `"registers"` to indicate which
  stage of the pipeline saving should occur.
  - `position`: Which register to be written to (if `location` is `"registers"`)
