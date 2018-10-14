# Part 4: Write
We've made it to the end of pipelining! We have now executed the function and know
exactly what is to be written as the result and where. All that is left to do is 
save the result at the location desired. This stage is probably the most straightforward,
assuming you wrapped everything cleanly in the previous stages!

# Your Task
Given the information you passed along from the execution stage, determine where
to write the result and write it as you did in previous lessons (i.e. `.write` for the
`memory` and `registers` appropriately). Some notes to keep in mind:

- Remember that you passed in the memory results as an array, meaning you'll have to
write the results for those incrementally (will be slightly different from register writes)
