#!/bin/sh

if [ $# != 1 ]; then
  echo "usage: $(basename $0) LESSON_DIR"
  exit 1
fi

find "$1" -name *.s -print0 | xargs -0 -L1 sh -c 'OUTPUT_NAME=${1%.s}.bin; mipsel-linux-gnu-as -EB -o $OUTPUT_NAME.elf $1; mipsel-linux-gnu-objcopy $OUTPUT_NAME.elf -j .text -O binary $OUTPUT_NAME; rm $OUTPUT_NAME.elf' sh
