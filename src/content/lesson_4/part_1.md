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
are executing instructions in **parallel.** Therefore, you must save the state of
the pipeline at each point and continue execution of previously run commands on the
following step of the pipeline. Here are some notes to help you through this:

- The `pipeline` variable is an array that should only have **three** variables stored.
This effectively acts as a global tracker of the results you've previously obtained
from running an execution step. While there are four stages, there is no return value
for the "write" step, meaning there's nothing to be stored from there.
- You should check the `pipeline` to see if anything has been previously executed and
stored in those locations, i.e. if the previous step fetched and instruction and 
wrote that into the pipeline, you should pull that information out, decode it now, and
write it back into the appropriate slot in the pipeline.
- You will **not** have to modify your `fetch`, `decode`, `execute`, or `write` functions:
simply call them with the appropriate arguments and save the results in the pipeline!
- The `pipeline` starts empty! This means, when you press `Step` on the UI, you will 
**NOT** see anything updating (other than the `pc`) until at least four steps in! After
that point, however, you should see updates on each click of `Step`, although the update
will correspond to the instruction three above your current spot.
