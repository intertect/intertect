# Part 3: Bitwise Instructions

Bitwise instructions are the bread and butter of low-level
programming. They allow you to quickly manipulate binary data
efficiently. In very high-level languages like Python, JavaScript,
Perl, etc., you won't find these operators used much, but when dealing
with binary protocols and systems programming, they come up really
frequently. Not to make value judgments, but these are my favorite
instructions. You don't even need any of the other arithmetic
instructions! All you need is `nor` or `nand` and you can make all of
them (really slowly, of course).

If you aren't familiar with logical operations, check out the
Wikipedia page on [Logical
Connectives](https://en.wikipedia.org/wiki/Logical_connective) for a
good introduction. As you'll see, logical connectives deal with two
truth values at a time, but our registers are 32 bits long. These are
therefore implemented by pairing the bits in the two registers (hence
why they are called bitwise operators).

As a quick example, taking the bitwise AND of `0b0110` and `0b0011`
gives `0b0010`. We'll write the two operands vertically to make this
more clear. The up carrot is the logical AND operator

```
0 ∧ 0 = 0
1 ∧ 0 = 0
1 ∧ 1 = 1
0 ∧ 0 = 0

```

## Shift Operations

There are three kinds of shifts that we want you to implement. Shift
left logical (`sll`), shift right logical (`srl`), and shift right
arithmetic (`sra`).

Shift left logical means you shift each of the bits in the target by
some amount, filling on the right with 0. For example, shifting
`0b1111` left by 2 leaves us with `0b1100`. In this case we assumed we
only had 4 bits to work with, in which case the top two bits got
shifted off the top.

Shift right logical means the reverse of this. You shift all the bits
to the right by some amount, filling with 0 from the left. Therefore,
our previous example of `0b1111` shifted right logically by 2 would
yield `0b0011`.

Lastly, there's the arithmetic right shift. This is the
odd-instruction-out. The difference is that it treats the number as
signed so when it shifts in new bits, they match the sign bit. In this
way it's very close to integer division by two (rounded towards
−∞). In this way, −1 arithmetic shift right by 1 is still −1 but 1
arithmetic shift right by 1 is 0. We can see this in the following
way, starting with the −1 case. For all of these we assume 4 bits for
simplicity.

```
−1 = 0b1111
0b1111 >> 1 = 0b1111
```

Where `>>` is the symbol for arithmetic shift right. We see that a new
1 is shifted in to replace the old one. For another example, consider
−2

```
−2 = 0b1110
0b1110 >> 1 = 0b1111
```

Now it's more obvious what is happening. For the positive versions of
these examples, we see:

```
1 = 0b0001
0b0001 >> 1 = 0b0000
```

```
2 = 0b0010
0b0010 >> 1 = 0b0001
```
