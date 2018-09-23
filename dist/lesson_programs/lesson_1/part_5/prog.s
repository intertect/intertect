label1: 
j label4

label3:
jal label5

label4:
beq $zero, $t0, label4
nop
beq $zero, $zero, label3
nop

label5:
jr $ra

