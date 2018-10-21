# Part 1: Parallelizing
Welcome to the final lesson on computer architecture! This lesson is going to be
concentrating on exploiting the pipelining you setup in Lesson 3 for speed. You'll
be specifically working on parallelizing the operations of the pipeline. Like we
mentioned, there could be complications when instructions depend upon one another,
but we're going to assume that that's not the case in this part of the lesson. In the
following part, we'll introduce these cases, called "hazards."

# Your Task
In the previous lesson, we had a mock `processMIPS` function that you could see
to get a sense of what was going on behind the scenes using your implementations of 
`fetch` and the remainder of the pipeline. Now, it's your turn to implement this
function! It's going to be different from the previous lesson, since this time we
are executing instructions in **parallel.** Therefore, you must continue execution 
of previously run commands whose results were saved in the latches at the
following step of the pipeline. Here are some notes to help you through this:

- The `latches` variable is an object that should maximally have its **four**
latch slots used. This will *only* **not** be the case at the beginning and end of the
program execution, i.e. where you are first loading things into an empty pipeline or
flushing out the remaining steps before program termination.
- You should execute a stage of the pipeline if a given `latch` slot acts as input to it
and is not `undefined.` In line with that, whenever you execute a stage of the pipeline,
make sure to `flush` it, i.e. set the corresponding latch from which you got the input
to `undefined`! If you don't, the program will never terminate.
- You will **not** have to modify your `IF`, `ID`, `EX`, `MEM` or `WB` functions:
simply call them with the appropriate arguments! You may look at what we called the `dummy`
pipeline in the parts of Lesson 3 as a guidance for what the function will look like.
- The `pipeline` starts empty! This means, when you press `Step` on the UI, you will 
**NOT** see anything updating (other than the `pc`) until at least four steps in! After
that point, however, you should see updates on each click of `Step`, although the update
will correspond to the instruction three above your current spot.
