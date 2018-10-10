label1:
j label4
nop

label3:
jal label5
nop

label4:
beq $zero, $t0, label4
nop
beq $zero, $zero, label3
nop

label5:
jr $ra
nop

sw $t0, 100($zero)
sh $t0, 104($zero)
sb $t0, 108($zero)

lw $t1, 100($zero)
lh $t2, 104($zero)
lb $t3, 108($zero)
