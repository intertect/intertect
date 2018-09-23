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
