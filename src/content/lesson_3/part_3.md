# Part 3: Execute (EX)
Now that we have fetched and decoded the instruction, we move onto the main beefy
chunk of the processor's work. This is the stage of the pipeline where the ALU gets
involved and starts to actually perform the computations that power a computer

# Your Task
Luckily, you've already implemented all the logic for this stage of the processor in the 
first couple lessons! That is, you already set up switch statement in which you execute a given instruction with the provided arguments. The only difference is that you will now **not**
be writing the results immediately into the registers or memory. Instead, we will return
a structure that specifies to the write stage where the results are to be written. However,
since results can be written in either memory *or* registers, the return structure must in some
way specify to the write back stage where these values are to be written. 

Therefore, for this part, here are some notes to keep in mind:

- The execution of instructions should be identical to how you previously implemented them, 
with the sole difference being in how you return values.
- The return structure must have these fields named **exactly** as specified:
  - `location`: What the final destination is for writing. This must be either `"memory"` 
  or `"registers"` (specifically the strings). 
  - `position`: Position in the location where the result is to be stored. If the location was specified as `"memory"`, this'll be the memory offset, whereas for `"register"` it'll be the
  binary representation of the destination register.
  - `result`: The actual value to be written (i.e. result from execution stage)
- Some instructions such as `jal` require **multiple** writes. In this case, consider which 
one is specifically the "result" and which is simply storing a placeholder for future use. 
Return the "result" in the structure described but write the placeholder as you did in 
*previous* lessons (i.e. write it directly in the execute function)
- Memory writes are done in steps (i.e. byte-wise), so for any result that requires a memory
write, the `result` is **expected** to be an array (even if just with a single element),
arranged assuming big-endian (as we did in previous lessons).
