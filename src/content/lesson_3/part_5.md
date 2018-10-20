# Part 5: Write Back (WB)
We've made it to the end of pipelining! As with the previous stage of the pipeline, we
simply want to store the results of our execution stage at this point, but we are
instead storing into registers.

# Your Task
Given the information you passed along from the execution and memory stages, determine 
where to write the results. The code should look nearly identical to that you wrote in
the previous part. Some notes to keep in mind:

- Remember that the writes you did for memory were over values stored as an array, whereas
the register writeback will only have a single value to be stored
