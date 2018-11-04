# Testing individual instructions in isolation

# addu
# PRE: $3=0x10 $4=0x1
addu $3, $4, $4
nop
nop
nop
nop
# POST: $3=0x11

# addiu
# PRE:
addiu $3, $zero, 1
addiu $4, $zero, -1
nop
nop
nop
nop
# POST: $3=0x1 $4=0xFFFFFFFF

# subu
# PRE: $5=0x10 $6=0x1
subu $3, $5, $6
nop
nop
nop
nop
# POST: $3=0xF

# and
# PRE: $7=0xFF $t8=0xF
and $3, $7, $8
nop
nop
nop
nop
# POST: $3=0xF

# andi
# PRE: $7=0xFF
andi $3, $7, 0xF
nop
nop
nop
nop
# POST: $3=0xF

# or
# PRE: $8=0xF $9=0xF0
or $3, $8, $9
nop
nop
nop
nop
# POST: $3=0xFF

# ori
# PRE: $8=0xF $9=0xF0
ori $3, $8, 0xF0
nop
nop
nop
nop
# POST: $3=0xFF

# xor
# PRE: $9=0xF0 $10=0xFF
xor $3, $9, $10
nop
nop
nop
nop
# POST: $3=0xF

# xori
# PRE: $9=0xF0
xori $3, $9, 0xFF
nop
nop
nop
nop
# POST: $3=0xF

# sll
# PRE: $9=0xF0
sll $3, $9, 1
nop
nop
nop
nop
# POST: $3=0x1E0

# srl
# PRE: $9=0xF0
srl $3, $9, 1
nop
nop
nop
nop
# POST: $3=0x78

# sra
# PRE: $11=0x2 $12=0xFFFFFFFE
sra $3, $11, 1
sra $4, $12, 1
nop
nop
nop
nop
# POST: $3=0x1 $4=0xFFFFFFFF

# j
j jal_label
nop

# jr
jr_label:
          nop
          nop
          nop
          nop
          jr $ra
          nop

# jal
jal_label:
        nop
        nop
        nop
        nop
        jal jr_label
        nop
        nop # jr should return here
        nop
        nop

# beq
beq_label:
        beq $0, $0, beq_done
        nop
        j beq_label
        nop
beq_done:
        nop
        nop
        nop
        nop

# bne
        # PRE $13=0x1
bne_label:
        bne $13, $0, bne_done
        nop
        j bne_label
        nop
bne_done:
        nop
        nop
        nop
        nop

# slt
# PRE $13=0x1
slt $3, $13, $0
slt $4, $0, $13
nop
nop
nop
nop
# POST $3=0x1 $4=0x0

# sw
# PRE $14=0xDEADBEEF
sw $14, 0x0
nop
nop
nop
nop

# sh
# PRE $14=0xDEADBEEF
sh $14, 0x4
nop
nop
nop
nop

# sb
# PRE $14=0xDEADBEEF
sb $14, 0x6
nop
nop
nop
nop

# lw
lw $3, 0x0
nop
nop
nop
nop
# POST $3=0xDEADBEEF

# lhu
lw $3, 0x4
nop
nop
nop
nop
# POST $3=0xBEEF

# lhu
lw $3, 0x6
nop
nop
nop
nop
# POST $3=0xEF

# Forwarding EX => EX (1 Ahead)
addiu $3, $0, 1
addiu $3, $3, 0x10
nop
nop
nop
nop
# POST $3=0x11

# Forwarding EX => DE (2 Ahead)
ex_de_2_label:
        addiu $3, $0, 0x0
        nop
        beq $3, $0, ex_de_2_done
        nop
        j ex_de_2_label
        nop
ex_de_2_done:
        nop
        nop
        nop
        nop

# Forwarding MEM => EX (2 Ahead)
lw $3, 0x0
nop
addiu $3, $3, 0x1
nop
nop
nop
nop
# POST $3=0xDEADBEF0

# Forwarding MEM => MEM (1 Ahead)
lw $3, 0x4
sw $3, 0x8
# 0x8 should contain 0xBE, 0xEF, 0xEF, 0x00

# Forwarding MEM => DE (3 Ahead)
        lw $4, 0x0
        nop
        nop
        nop
        nop # Make sure we've cleared the pipeline
        lw $3, 0x0
        nop
        nop
        beq $3, $4, mem_de_done
        nop
mem_de_3_label:
        j mem_de_3_label
        nop
mem_de_3_done:
        nop
        nop
        nop
        nop

# Forwarding EX => DE (1 Ahead)
        # Requires 1 cycle of stalling
        addiu $3, $0, 0x0
        beq $3, $0, ex_de_1_done
        nop
ex_de_1_label:
        j ex_de_1_label
        nop
ex_de_1_done:
        nop
        nop
        nop
        nop

# Forwarding MEM => EX (1 Ahead)
# Requires 1 cycles of stalling
lw $3, 0x0
addiu $3, $3, 0x1
nop
nop
nop
nop
# POST $3=0xDEADBEF0

# Forwarding MEM => DE (1 Ahead)
        # Requires 1 cycle of stalling
        lw $3, 0x0
        nop
        nop
        nop
        nop
        lw $4, 0x0
        nop
        beq $3, $4, mem_de_1_done
        nop
mem_de_2_label:
        j mem_de_1_label
        nop
mem_de_2_done:
        nop
        nop
        nop
        nop

# Forwarding MEM => DE (1 Ahead)
        # Requires 2 cycles of stalling
        lw $3, 0x0
        nop
        nop
        nop
        nop
        lw $4, 0x0
        beq $3, $4, mem_de_1_done
        nop
mem_de_1_label:
        j mem_de_1_label
        nop
mem_de_1_done:
        nop
        nop
        nop
        nop

# Branch delay
        addiu $3, $zero, 0x1
        j done
        addiu $3, $3, 0x1
done:
        addiu $3, $3, 0x1
        # POST $3=0x
