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
