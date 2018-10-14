# Part 2: Decode
Now that we have an understanding of how processor pipelining works, we'll move
on to implementing the second stage! Luckily, with each of these stages, the function
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
- We **expect** all instructions to be decoded with the appropriate names, i.e. the
`$rs` register value will be returned as a field named `"rs"` (**no $**) in an object.
Specifically, your return must match **exactly** these names for these cases:
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
