addu $t5, $t0, $t0
addu $t6, $t0, $t2
addu $t7, $t3, $t0
addu $t8, $t4, $t0

subu $t7, $t1, $t0
subu $t8, $t2, $t1
subu $t9, $t0, $t1

and $t4, $t2, $t3
and $t5, $t0, $t1

or $t6, $zero, $t2
or $t7, $t0, $t1

xor $t8, $t0, $t1
xor $t9, $t2, $t3

sll $s0, $t0, 1
sll $s1, $t1, 1
sll $s2, $t2, 1

srl $s3, $t0, 1
srl $s4, $t1, 1

sra $s5, $t2, 1
sra $s6, $t3, 1
sra $s7, $a0, 1

addiu $s0, $t0, 1
addiu $s1, $t1, 5
addiu $s2, $t4, 1
addiu $s3, $t3, 1
addiu $s4, $zero, -1

andi $s5, $t0, 0
andi $s6, $t0, 1
andi $s7, $t4, 0xFFFF

ori $t9, $t0, 0xFFFF
ori $a0, $t0, 1
ori $a1, $t4, 0xFFFF

xori $a2, $t0, 0xFFFF
xori $a3, $t2, 1
xori $k0, $t0, 1
xori $k1, $t4, 0
xori $v0, $t4, 1

label1: 
j label4
addi $t0, $t0, 1

label3:
jal label5
nop

label4:
beq $zero, $t0, label6
nop
beq $zero, $t0, label4
addi $t0, $t0, -1

label5:
jr $ra
nop

label6:
sw $t0, 100($zero)
sh $t0, 104($zero)
sb $t0, 108($zero)

lw $t1, 100($zero)
lh $t2, 104($zero)
lb $t3, 108($zero)
