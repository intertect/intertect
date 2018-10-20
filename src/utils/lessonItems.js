import * as lesson_1_part_1_content from '../content/lesson_1/part_1.md';
import * as lesson_1_part_2_content from '../content/lesson_1/part_2.md';
import * as lesson_1_part_3_content from '../content/lesson_1/part_3.md';
import * as lesson_1_part_4_content from '../content/lesson_1/part_4.md';
import * as lesson_1_part_5_content from '../content/lesson_1/part_5.md';
import * as lesson_1_part_6_content from '../content/lesson_1/part_6.md';

import * as lesson_2_part_1_content from '../content/lesson_2/part_1.md';
import * as lesson_2_part_2_content from '../content/lesson_2/part_2.md';

import * as lesson_3_part_1_content from '../content/lesson_3/part_1.md';
import * as lesson_3_part_2_content from '../content/lesson_3/part_2.md';
import * as lesson_3_part_3_content from '../content/lesson_3/part_3.md';
import * as lesson_3_part_4_content from '../content/lesson_3/part_4.md';
import * as lesson_3_part_5_content from '../content/lesson_3/part_5.md';

import * as lesson_4_part_1_content from '../content/lesson_4/part_1.md';

/* ========================================================================= */
/* Register Inits */
/* ========================================================================= */

const lesson_1_part_1_init = require('../lesson_programs/lesson_1/part_1/init.txt');
const lesson_1_part_2_init = require('../lesson_programs/lesson_1/part_2/init.txt');
const lesson_1_part_3_init = require('../lesson_programs/lesson_1/part_3/init.txt');
const lesson_1_part_4_init = require('../lesson_programs/lesson_1/part_4/init.txt');
const lesson_1_part_5_init = require('../lesson_programs/lesson_1/part_5/init.txt');
const lesson_1_part_6_init = require('../lesson_programs/lesson_1/part_6/init.txt');

const lesson_2_part_1_init = require('../lesson_programs/lesson_2/part_1/init.txt');
const lesson_2_part_2_init = require('../lesson_programs/lesson_2/part_2/init.txt');

const lesson_3_part_1_init = require('../lesson_programs/lesson_3/part_1/init.txt');
const lesson_3_part_2_init = require('../lesson_programs/lesson_3/part_2/init.txt');
const lesson_3_part_3_init = require('../lesson_programs/lesson_3/part_3/init.txt');
const lesson_3_part_4_init = require('../lesson_programs/lesson_3/part_4/init.txt');
const lesson_3_part_5_init = require('../lesson_programs/lesson_3/part_5/init.txt');

const lesson_4_part_1_init = require('../lesson_programs/lesson_4/part_1/init.txt');

/* ========================================================================= */
/* Assembly Code */
/* ========================================================================= */

const lesson_1_part_1_assembly = require('../lesson_programs/lesson_1/part_1/prog.s');
const lesson_1_part_2_assembly = require('../lesson_programs/lesson_1/part_2/prog.s');
const lesson_1_part_3_assembly = require('../lesson_programs/lesson_1/part_3/prog.s');
const lesson_1_part_4_assembly = require('../lesson_programs/lesson_1/part_4/prog.s');
const lesson_1_part_5_assembly = require('../lesson_programs/lesson_1/part_5/prog.s');
const lesson_1_part_6_assembly = require('../lesson_programs/lesson_1/part_6/prog.s');

const lesson_2_part_1_assembly = require('../lesson_programs/lesson_2/part_1/prog.s');
const lesson_2_part_2_assembly = require('../lesson_programs/lesson_2/part_2/prog.s');

const lesson_3_part_1_assembly = require('../lesson_programs/lesson_3/part_1/prog.s');
const lesson_3_part_2_assembly = require('../lesson_programs/lesson_3/part_2/prog.s');
const lesson_3_part_3_assembly = require('../lesson_programs/lesson_3/part_3/prog.s');
const lesson_3_part_4_assembly = require('../lesson_programs/lesson_3/part_4/prog.s');
const lesson_3_part_5_assembly = require('../lesson_programs/lesson_3/part_5/prog.s');

const lesson_4_part_1_assembly = require('../lesson_programs/lesson_4/part_1/prog.s');

/* ========================================================================= */
/* Binary Code */
/* ========================================================================= */

function rawToBinaryArray(raw) {
  var array = [];

  for (var i = 0; i < raw.length; i++) {
    array[i] = parseInt(raw[i], 16);
  }

  return array;
}

// binary only starts becoming relevant in lesson 2, so no need to import for lesson 1
const lesson_2_part_1_binary_raw = require('../lesson_programs/lesson_2/part_1/prog.bin').split(' ');
const lesson_2_part_1_binary = rawToBinaryArray(lesson_2_part_1_binary_raw);

const lesson_2_part_2_binary_raw = require('../lesson_programs/lesson_2/part_2/prog.bin').split(' ');
const lesson_2_part_2_binary = rawToBinaryArray(lesson_2_part_2_binary_raw);

const lesson_3_part_1_binary_raw = require('../lesson_programs/lesson_3/part_1/prog.bin').split(' ');
const lesson_3_part_1_binary = rawToBinaryArray(lesson_3_part_1_binary_raw);

const lesson_3_part_2_binary_raw = require('../lesson_programs/lesson_3/part_2/prog.bin').split(' ');
const lesson_3_part_2_binary = rawToBinaryArray(lesson_3_part_2_binary_raw);

const lesson_3_part_3_binary_raw = require('../lesson_programs/lesson_3/part_3/prog.bin').split(' ');
const lesson_3_part_3_binary = rawToBinaryArray(lesson_3_part_3_binary_raw);

const lesson_3_part_4_binary_raw = require('../lesson_programs/lesson_3/part_4/prog.bin').split(' ');
const lesson_3_part_4_binary = rawToBinaryArray(lesson_3_part_4_binary_raw);

const lesson_3_part_5_binary_raw = require('../lesson_programs/lesson_3/part_5/prog.bin').split(' ');
const lesson_3_part_5_binary = rawToBinaryArray(lesson_3_part_5_binary_raw);

const lesson_4_part_1_binary_raw = require('../lesson_programs/lesson_4/part_1/prog.bin').split(' ');
const lesson_4_part_1_binary = rawToBinaryArray(lesson_4_part_1_binary_raw);

/* ========================================================================= */
/* Starter Code */
/* ========================================================================= */

const lesson_1_part_1_starter = require('../starter/lesson_1/part_1.txt');
const lesson_1_part_2_starter = require('../starter/lesson_1/part_2.txt');
const lesson_1_part_3_starter = require('../starter/lesson_1/part_3.txt');
const lesson_1_part_4_starter = require('../starter/lesson_1/part_4.txt');
const lesson_1_part_5_starter = require('../starter/lesson_1/part_5.txt');
const lesson_1_part_6_starter = require('../starter/lesson_1/part_6.txt');

const lesson_2_part_1_starter = require('../starter/lesson_2/part_1.txt');
const lesson_2_part_2_starter = require('../starter/lesson_2/part_2.txt');

const lesson_3_part_1_starter = require('../starter/lesson_3/part_1.txt');
const lesson_3_part_2_starter = require('../starter/lesson_3/part_2.txt');
const lesson_3_part_3_starter = require('../starter/lesson_3/part_3.txt');
const lesson_3_part_4_starter = require('../starter/lesson_3/part_4.txt');
const lesson_3_part_5_starter = require('../starter/lesson_3/part_5.txt');

const lesson_4_part_1_starter = require('../starter/lesson_4/part_1.txt');

/* ========================================================================= */
/* Reference Code */
/* ========================================================================= */

const lesson_1_part_1_reference = require('../references/lesson_1/part_1.js');
const lesson_1_part_2_reference = require('../references/lesson_1/part_2.js');
const lesson_1_part_3_reference = require('../references/lesson_1/part_3.js');
const lesson_1_part_4_reference = require('../references/lesson_1/part_4.js');
const lesson_1_part_5_reference = require('../references/lesson_1/part_5.js');
const lesson_1_part_6_reference = require('../references/lesson_1/part_6.js');

const lesson_2_part_1_reference = require('../references/lesson_2/part_1.js');
const lesson_2_part_2_reference = require('../references/lesson_2/part_2.js');

const lesson_3_part_1_reference = require('../references/lesson_3/part_1.js');

const lesson_4_part_1_reference = require('../references/lesson_4/part_1.js');

// number of parts for each lesson
export const lessonParts = {
  1 : 6,
  2 : 2,
  3 : 5,
  4 : 1,
}

// content (text) for each lesson
export const lessonContent = {
  "lesson_1/part_1" : lesson_1_part_1_content,
  "lesson_1/part_2" : lesson_1_part_2_content,
  "lesson_1/part_3" : lesson_1_part_3_content,
  "lesson_1/part_4" : lesson_1_part_4_content,
  "lesson_1/part_5" : lesson_1_part_5_content,
  "lesson_1/part_6" : lesson_1_part_6_content,

  "lesson_2/part_1" : lesson_2_part_1_content,
  "lesson_2/part_2" : lesson_2_part_2_content,

  "lesson_3/part_1" : lesson_3_part_1_content,
  "lesson_3/part_2" : lesson_3_part_2_content,
  "lesson_3/part_3" : lesson_3_part_3_content,
  "lesson_3/part_4" : lesson_3_part_4_content,
  "lesson_3/part_5" : lesson_3_part_5_content,

  "lesson_4/part_1" : lesson_4_part_1_content,
};

// initializations for registers
export const lessonRegisterInits = {
  "lesson_1/part_1" : lesson_1_part_1_init,
  "lesson_1/part_2" : lesson_1_part_2_init,
  "lesson_1/part_3" : lesson_1_part_3_init,
  "lesson_1/part_4" : lesson_1_part_4_init,
  "lesson_1/part_5" : lesson_1_part_5_init,
  "lesson_1/part_6" : lesson_1_part_6_init,

  "lesson_2/part_1" : lesson_2_part_1_init,
  "lesson_2/part_2" : lesson_2_part_2_init,

  "lesson_3/part_1" : lesson_3_part_1_init,
  "lesson_3/part_2" : lesson_3_part_2_init,
  "lesson_3/part_3" : lesson_3_part_3_init,
  "lesson_3/part_4" : lesson_3_part_4_init,
  "lesson_3/part_5" : lesson_3_part_5_init,

  "lesson_4/part_1" : lesson_4_part_1_init,
};

// assembly code to be displayed per lesson
export const lessonAssembly = {
  "lesson_1/part_1" : lesson_1_part_1_assembly,
  "lesson_1/part_2" : lesson_1_part_2_assembly,
  "lesson_1/part_3" : lesson_1_part_3_assembly,
  "lesson_1/part_4" : lesson_1_part_4_assembly,
  "lesson_1/part_5" : lesson_1_part_5_assembly,
  "lesson_1/part_6" : lesson_1_part_6_assembly,

  "lesson_2/part_1" : lesson_2_part_1_assembly,
  "lesson_2/part_2" : lesson_2_part_2_assembly,

  "lesson_3/part_1" : lesson_3_part_1_assembly,
  "lesson_3/part_2" : lesson_3_part_2_assembly,
  "lesson_3/part_3" : lesson_3_part_3_assembly,
  "lesson_3/part_4" : lesson_3_part_4_assembly,
  "lesson_3/part_5" : lesson_3_part_5_assembly,

  "lesson_4/part_1" : lesson_4_part_1_assembly,
}

// binary code to be execute (relevant for lessons 2 and on)
export const lessonBinaryCode = {
  "lesson_2/part_1" : lesson_2_part_1_binary,
  "lesson_2/part_2" : lesson_2_part_2_binary,

  "lesson_3/part_1" : lesson_3_part_1_binary,
  "lesson_3/part_2" : lesson_3_part_2_binary,
  "lesson_3/part_3" : lesson_3_part_3_binary,
  "lesson_3/part_4" : lesson_3_part_4_binary,
  "lesson_3/part_5" : lesson_3_part_5_binary,

  "lesson_4/part_1" : lesson_4_part_1_binary,
}

// JS assembly code students work with
export const lessonStarterCode = {
  "lesson_1/part_1" : lesson_1_part_1_starter,
  "lesson_1/part_2" : lesson_1_part_2_starter,
  "lesson_1/part_3" : lesson_1_part_3_starter,
  "lesson_1/part_4" : lesson_1_part_4_starter,
  "lesson_1/part_5" : lesson_1_part_5_starter,
  "lesson_1/part_6" : lesson_1_part_6_starter,

  "lesson_2/part_1" : lesson_2_part_1_starter,
  "lesson_2/part_2" : lesson_2_part_2_starter,

  "lesson_3/part_1" : lesson_3_part_1_starter,
  "lesson_3/part_2" : lesson_3_part_2_starter,
  "lesson_3/part_3" : lesson_3_part_3_starter,
  "lesson_3/part_4" : lesson_3_part_4_starter,
  "lesson_3/part_5" : lesson_3_part_5_starter,

  "lesson_4/part_1" : lesson_4_part_1_starter,
};

// reference solutions against which students' code is run
export const lessonReferenceSolutions = {
  "lesson_1/part_1" : lesson_1_part_1_reference.solution,
  "lesson_1/part_2" : lesson_1_part_2_reference.solution,
  "lesson_1/part_3" : lesson_1_part_3_reference.solution,
  "lesson_1/part_4" : lesson_1_part_4_reference.solution,
  "lesson_1/part_5" : lesson_1_part_5_reference.solution,
  "lesson_1/part_6" : lesson_1_part_6_reference.solution,

  "lesson_2/part_1" : lesson_2_part_1_reference.solution,
  "lesson_2/part_2" : lesson_2_part_2_reference.solution,

  // the below is NOT a typo: all the lesson 3 parts have same reference soln
  "lesson_3/part_1" : lesson_3_part_1_reference.solution,
  "lesson_3/part_2" : lesson_3_part_1_reference.solution,
  "lesson_3/part_3" : lesson_3_part_1_reference.solution,
  "lesson_3/part_4" : lesson_3_part_1_reference.solution,
  "lesson_3/part_5" : lesson_3_part_1_reference.solution,

  "lesson_4/part_1" : lesson_4_part_1_reference.solution,
};

// specifies (for pipelining implementation), which parts come from solution
// and which from the student for each part
export const lessonPipelineStudent = {
  "lesson_3/part_1": ["IF"],
  "lesson_3/part_2": ["IF","ID"],
  "lesson_3/part_3": ["IF","ID","EX"],
  "lesson_3/part_4": ["IF","ID","EX","MEM",],
  "lesson_3/part_5": ["IF","ID","EX","MEM","WB"],
}
