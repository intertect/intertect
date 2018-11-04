main:
	addiu	$sp,$sp,-32
	sw	$ra,28($sp)
	sw	$fp,24($sp)
	addiu	$fp,$sp,0
	ori	$a0,$zero,10			# 0xa
	jal	fib
	nop

	addiu	$sp,$fp,0
	lw	$ra,28($sp)
	lw	$fp,24($sp)
	addiu	$sp,$sp,32
	jr	$ra
	nop
        .word   0xFAFAFA

fib:
	addiu	$sp,$sp,-32
	sw	$fp,28($sp)
	addiu	$fp,$sp,0
	sw	$a0,32($fp)
	sw	$zero,8($fp)
	ori	$v0,$zero,1			# 0x1
	sw	$v0,12($fp)
	sw	$zero,16($fp)
	sw	$zero,20($fp)
	j	$L2
	nop

$L5:
	lw	$v0,20($fp)
	nop
	bne	$v0,$zero,$L3
	nop

	sw	$zero,16($fp)
	lw	$v0,20($fp)
	nop
	addiu	$v0,$v0,1
	sw	$v0,20($fp)
	j	$L2
	nop

$L3:
	lw	$v1,20($fp)
	ori	$v0,1			# 0x1
	bne	$v1,$v0,$L4
	nop

	ori	$v0,$zero,1			# 0x1
	sw	$v0,16($fp)
	lw	$v0,20($fp)
	nop
	addiu	$v0,$v0,1
	sw	$v0,20($fp)
	j	$L2
	nop

$L4:
	lw	$v1,8($fp)
	lw	$v0,12($fp)
	nop
	addu	$v0,$v1,$v0
	sw	$v0,16($fp)
	lw	$v0,12($fp)
	nop
	sw	$v0,8($fp)
	lw	$v0,16($fp)
	nop
	sw	$v0,12($fp)
	lw	$v0,20($fp)
	nop
	addiu	$v0,$v0,1
	sw	$v0,20($fp)
$L2:
	lw	$v1,20($fp)
	lw	$v0,32($fp)
	nop
	bne	$v1,$v0,$L5
	nop

	lw	$v0,16($fp)
	addiu	$sp,$fp,0
	lw	$fp,28($sp)
	addiu	$sp,$sp,32
	jr	$ra
	nop
