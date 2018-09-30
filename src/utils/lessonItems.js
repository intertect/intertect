import * as lesson_1_part_1_content from '../content/lesson_1/part_1.md';
import * as lesson_1_part_2_content from '../content/lesson_1/part_2.md';
import * as lesson_1_part_3_content from '../content/lesson_1/part_3.md';
import * as lesson_1_part_4_content from '../content/lesson_1/part_4.md';
import * as lesson_1_part_5_content from '../content/lesson_1/part_5.md';
import * as lesson_1_part_6_content from '../content/lesson_1/part_6.md';

import * as lesson_2_part_1_content from '../content/lesson_2/part_1.md';

const lesson_1_part_1_init = require('../lesson_programs/lesson_1/part_1/init.txt');
const lesson_1_part_2_init = require('../lesson_programs/lesson_1/part_2/init.txt');
const lesson_1_part_3_init = require('../lesson_programs/lesson_1/part_3/init.txt');
const lesson_1_part_4_init = require('../lesson_programs/lesson_1/part_4/init.txt');
const lesson_1_part_5_init = require('../lesson_programs/lesson_1/part_5/init.txt');
const lesson_1_part_6_init = require('../lesson_programs/lesson_1/part_6/init.txt');

const lesson_2_part_1_init = require('../lesson_programs/lesson_2/part_1/init.txt');

const lesson_1_part_1_assembly = require('../lesson_programs/lesson_1/part_1/prog.s');
const lesson_1_part_2_assembly = require('../lesson_programs/lesson_1/part_2/prog.s');
const lesson_1_part_3_assembly = require('../lesson_programs/lesson_1/part_3/prog.s');
const lesson_1_part_4_assembly = require('../lesson_programs/lesson_1/part_4/prog.s');
const lesson_1_part_5_assembly = require('../lesson_programs/lesson_1/part_5/prog.s');
const lesson_1_part_6_assembly = require('../lesson_programs/lesson_1/part_6/prog.s');

const lesson_2_part_1_assembly = require('../lesson_programs/lesson_2/part_1/prog.s');

// binary only starts becoming relevant in lesson 2, so no need to import for lesson 1
const lesson_2_part_1_binary = require('../lesson_programs/lesson_2/part_1/prog.bin');

const lesson_1_part_1_starter = require('../starter/lesson_1/part_1.txt');
const lesson_1_part_2_starter = require('../starter/lesson_1/part_2.txt');
const lesson_1_part_3_starter = require('../starter/lesson_1/part_3.txt');
const lesson_1_part_4_starter = require('../starter/lesson_1/part_4.txt');
const lesson_1_part_5_starter = require('../starter/lesson_1/part_5.txt');
const lesson_1_part_6_starter = require('../starter/lesson_1/part_6.txt');

const lesson_2_part_1_starter = require('../starter/lesson_2/part_1.txt');

const lesson_1_part_1_reference = require('../references/lesson_1/part_1.js');
const lesson_1_part_2_reference = require('../references/lesson_1/part_2.js');
const lesson_1_part_3_reference = require('../references/lesson_1/part_3.js');
const lesson_1_part_4_reference = require('../references/lesson_1/part_4.js');
const lesson_1_part_5_reference = require('../references/lesson_1/part_5.js');
const lesson_1_part_6_reference = require('../references/lesson_1/part_6.js');

const lesson_2_part_1_reference = require('../references/lesson_2/part_1.js');


export const lessonContent = {
  "lesson_1/part_1" : lesson_1_part_1_content,
  "lesson_1/part_2" : lesson_1_part_2_content,
  "lesson_1/part_3" : lesson_1_part_3_content,
  "lesson_1/part_4" : lesson_1_part_4_content,
  "lesson_1/part_5" : lesson_1_part_5_content,
  "lesson_1/part_6" : lesson_1_part_6_content,

  "lesson_2/part_1" : lesson_2_part_1_content
};

export const lessonRegisterInits = {
  "lesson_1/part_1" : lesson_1_part_1_init,
  "lesson_1/part_2" : lesson_1_part_2_init,
  "lesson_1/part_3" : lesson_1_part_3_init,
  "lesson_1/part_4" : lesson_1_part_4_init,
  "lesson_1/part_5" : lesson_1_part_5_init,
  "lesson_1/part_6" : lesson_1_part_6_init,

  "lesson_2/part_1" : lesson_2_part_1_init
};

export const lessonAssembly = {
  "lesson_1/part_1" : lesson_1_part_1_assembly,
  "lesson_1/part_2" : lesson_1_part_2_assembly,
  "lesson_1/part_3" : lesson_1_part_3_assembly,
  "lesson_1/part_4" : lesson_1_part_4_assembly,
  "lesson_1/part_5" : lesson_1_part_5_assembly,
  "lesson_1/part_6" : lesson_1_part_6_assembly,

  "lesson_2/part_1" : lesson_2_part_1_assembly
}

export const lessonBinaryCode = {
  "lesson_2/part_1" : lesson_2_part_1_binary
}

export const lessonStarterCode = {
  "lesson_1/part_1" : lesson_1_part_1_starter,
  "lesson_1/part_2" : lesson_1_part_2_starter,
  "lesson_1/part_3" : lesson_1_part_3_starter,
  "lesson_1/part_4" : lesson_1_part_4_starter,
  "lesson_1/part_5" : lesson_1_part_5_starter,
  "lesson_1/part_6" : lesson_1_part_6_starter,

  "lesson_2/part_1" : lesson_2_part_1_starter
};

export const lessonReferenceSolutions = {
  "lesson_1/part_1" : lesson_1_part_1_reference.solution,
  "lesson_1/part_2" : lesson_1_part_2_reference.solution,
  "lesson_1/part_3" : lesson_1_part_3_reference.solution,
  "lesson_1/part_4" : lesson_1_part_4_reference.solution,
  "lesson_1/part_5" : lesson_1_part_5_reference.solution,
  "lesson_1/part_6" : lesson_1_part_6_reference.solution,

  "lesson_2/part_1" : lesson_2_part_1_reference.solution
};
