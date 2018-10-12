#!/bin/sh

if [ $# != 1 ]; then
  echo "usage: $(basename $0) LESSON_DIR"
  exit 1
fi

find "$1" -name *.s -print0 | xargs -0 -L1 bash -c 'OUTPUT_NAME=${1%.s}.bin; scripts/mipsel-linux-gnu-as -EB --no-pad-sections -o $OUTPUT_NAME.elf <(echo ".set noreorder" | cat - $1); scripts/mipsel-linux-gnu-objcopy $OUTPUT_NAME.elf -j .text -O binary $OUTPUT_NAME; rm $OUTPUT_NAME.elf; xxd -p $OUTPUT_NAME | sed -e "s/\(..\)/\1 /g" | sed -e "s/ \+$//" | tr "\n" " " | sed -e "s/ $/\n/" > $OUTPUT_NAME.tmp; mv $OUTPUT_NAME.tmp $OUTPUT_NAME' bash
