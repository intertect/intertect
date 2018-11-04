# Testing individual instructions in isolation

# addu
# PRE: $v1=0x10 $a0=0x1
addu $v1, $a0, $a0
nop
nop
nop
nop
# POST: $v1=0x11

# addiu
# PRE:
addiu $v1, $zero, 1
addiu $a0, $zero, -1
nop
nop
nop
nop
# POST: $v1=0x1 $a0=0xFFFFFFFF

# subu
# PRE: $a1=0x10 $a2=0x1
subu $v1, $a1, $a2
nop
nop
nop
nop
# POST: $v1=0xF

# and
# PRE: $a3=0xFF $t8=0xF
and $v1, $a3, $t0
nop
nop
nop
nop
# POST: $v1=0xF

# andi
# PRE: $a3=0xFF
andi $v1, $a3, 0xF
nop
nop
nop
nop
# POST: $v1=0xF

# or
# PRE: $t0=0xF $t1=0xF0
or $v1, $t0, $t1
nop
nop
nop
nop
# POST: $v1=0xFF

# ori
# PRE: $t0=0xF $t1=0xF0
ori $v1, $t0, 0xF0
nop
nop
nop
nop
# POST: $v1=0xFF

# xor
# PRE: $t1=0xF0 $t2=0xFF
xor $v1, $t1, $t2
nop
nop
nop
nop
# POST: $v1=0xF

# xori
# PRE: $t1=0xF0
xori $v1, $t1, 0xFF
nop
nop
nop
nop
# POST: $v1=0xF

# sll
# PRE: $t1=0xF0
sll $v1, $t1, 1
nop
nop
nop
nop
# POST: $v1=0x1E0

# srl
# PRE: $t1=0xF0
srl $v1, $t1, 1
nop
nop
nop
nop
# POST: $v1=0x78

# sra
# PRE: $t3=0x2 $t4=0xFFFFFFFE
sra $v1, $t3, 1
sra $a0, $t4, 1
nop
nop
nop
nop
# POST: $v1=0x1 $a0=0xFFFFFFFF

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
        beq $zero, $zero, beq_done
        nop
        j beq_label
        nop
beq_done:
        nop
        nop
        nop
        nop

# bne
        # PRE $t5=0x1
bne_label:
        bne $t5, $zero, bne_done
        nop
        j bne_label
        nop
bne_done:
        nop
        nop
        nop
        nop

# slt
# PRE $t5=0x1
slt $v1, $t5, $zero
slt $a0, $zero, $t5
nop
nop
nop
nop
# POST $v1=0x1 $a0=0x0

# sw
# PRE $t6=0xDEADBEEF
sw $t6, 0x0
nop
nop
nop
nop

# sh
# PRE $t6=0xDEADBEEF
sh $t6, 0x4
nop
nop
nop
nop

# sb
# PRE $t6=0xDEADBEEF
sb $t6, 0x6
nop
nop
nop
nop

# lw
lw $v1, 0x0
nop
nop
nop
nop
# POST $v1=0xDEADBEEF

# lhu
lw $v1, 0x4
nop
nop
nop
nop
# POST $v1=0xBEEF

# lhu
lw $v1, 0x6
nop
nop
nop
nop
# POST $v1=0xEF

# Forwarding EX => EX (1 Ahead)
addiu $v1, $zero, 1
addiu $v1, $v1, 0x10
nop
nop
nop
nop
# POST $v1=0x11

# Forwarding EX => DE (2 Ahead)
ex_de_2_label:
        addiu $v1, $zero, 0x0
        nop
        beq $v1, $zero, ex_de_2_done
        nop
        j ex_de_2_label
        nop
ex_de_2_done:
        nop
        nop
        nop
        nop

# Forwarding MEM => EX (2 Ahead)
lw $v1, 0x0
nop
addiu $v1, $v1, 0x1
nop
nop
nop
nop
# POST $v1=0xDEADBEF0

# Forwarding MEM => MEM (1 Ahead)
lw $v1, 0x4
sw $v1, 0x8
# 0x8 should contain 0xBE, 0xEF, 0xEF, 0x00

# Forwarding MEM => DE (3 Ahead)
        lw $a0, 0x0
        nop
        nop
        nop
        nop # Make sure we've cleared the pipeline
        lw $v1, 0x0
        nop
        nop
        beq $v1, $a0, mem_de_done
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
        addiu $v1, $zero, 0x0
        beq $v1, $zero, ex_de_1_done
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
lw $v1, 0x0
addiu $v1, $v1, 0x1
nop
nop
nop
nop
# POST $v1=0xDEADBEF0

# Forwarding MEM => DE (1 Ahead)
        # Requires 1 cycle of stalling
        lw $v1, 0x0
        nop
        nop
        nop
        nop
        lw $a0, 0x0
        nop
        beq $v1, $a0, mem_de_1_done
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
        lw $v1, 0x0
        nop
        nop
        nop
        nop
        lw $a0, 0x0
        beq $v1, $a0, mem_de_1_done
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
        addiu $v1, $zero, 0x1
        j done
        addiu $v1, $v1, 0x1
done:
        addiu $v1, $v1, 0x1
        # POST $v1=0x
