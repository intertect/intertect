isBitPalindrome:
	addiu	$sp,$sp,-24
	sw	$fp,20($sp)
	addiu	$fp,$sp,0
	sw	$a0,24($fp)
	sw	$zero,8($fp)
	lw	$v0,24($fp)
	nop
	sw	$v0,12($fp)
	j	$L2
	nop

$L3:
	lw	$v0,8($fp)
	nop
	sll	$v1,$v0,1
	lw	$v0,12($fp)
	nop
	andi	$v0,$v0,0x1
	or	$v0,$v1,$v0
	sw	$v0,8($fp)
	lw	$v0,12($fp)
	nop
	sra	$v0,$v0,1
	sw	$v0,12($fp)
$L2:
	lw	$v0,12($fp)
	nop
	bgtz	$v0,$L3
	nop

	lw	$v1,8($fp)
	lw	$v0,24($fp)
	nop
	xor	$v0,$v1,$v0
	sltu	$v0,$v0,1
	andi	$v0,$v0,0x00ff
	addiu	$sp,$fp,0
	lw	$fp,20($sp)
	addiu	$sp,$sp,24
	jr	$ra
	nop

main:
	addiu	$sp,$sp,-32
	sw	$ra,28($sp)
	sw	$fp,24($sp)
	addiu	$fp,$sp,0
	lui	$v0, 0xda16
	ori	$v0, $v0, 0x685b
	ori	$a0,$v0,0x685b
	jal	isBitPalindrome
	nop

	addiu	$sp,$fp,0
	lw	$ra,28($sp)
	lw	$fp,24($sp)
	addiu	$sp,$sp,32
	jr	$ra
	nop

