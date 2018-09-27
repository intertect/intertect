import * as lesson_1_part_1_content from '../content/lesson_1/part_1.md';
import * as lesson_1_part_2_content from '../content/lesson_1/part_2.md';
import * as lesson_1_part_3_content from '../content/lesson_1/part_3.md';
import * as lesson_1_part_4_content from '../content/lesson_1/part_4.md';
import * as lesson_1_part_5_content from '../content/lesson_1/part_5.md';

var lesson_1_part_1_init = require('../lesson_programs/lesson_1/part_1/init.txt');
var lesson_1_part_2_init = require('../lesson_programs/lesson_1/part_2/init.txt');
var lesson_1_part_3_init = require('../lesson_programs/lesson_1/part_3/init.txt');
var lesson_1_part_4_init = require('../lesson_programs/lesson_1/part_4/init.txt');
var lesson_1_part_5_init = require('../lesson_programs/lesson_1/part_5/init.txt');

var lesson_1_part_1_assembly = require('../lesson_programs/lesson_1/part_1/prog.txt');
var lesson_1_part_2_assembly = require('../lesson_programs/lesson_1/part_2/prog.txt');
var lesson_1_part_3_assembly = require('../lesson_programs/lesson_1/part_3/prog.txt');
var lesson_1_part_4_assembly = require('../lesson_programs/lesson_1/part_4/prog.txt');
var lesson_1_part_5_assembly = require('../lesson_programs/lesson_1/part_5/prog.txt');

var lesson_1_part_1_starter = require('../starter/lesson_1/part_1.txt');
var lesson_1_part_2_starter = require('../starter/lesson_1/part_2.txt');
var lesson_1_part_3_starter = require('../starter/lesson_1/part_3.txt');
var lesson_1_part_4_starter = require('../starter/lesson_1/part_4.txt');
var lesson_1_part_5_starter = require('../starter/lesson_1/part_5.txt');

var lesson_1_part_1 = require('../references/lesson_1/part_1.js');
var lesson_1_part_2 = require('../references/lesson_1/part_2.js');
var lesson_1_part_3 = require('../references/lesson_1/part_3.js');
var lesson_1_part_4 = require('../references/lesson_1/part_4.js');
var lesson_1_part_5 = require('../references/lesson_1/part_5.js');

export const lessonContent = {
  "lesson_1/part_1" : lesson_1_part_1_content,
  "lesson_1/part_2" : lesson_1_part_2_content,
  "lesson_1/part_3" : lesson_1_part_3_content,
  "lesson_1/part_4" : lesson_1_part_4_content,
  "lesson_1/part_5" : lesson_1_part_5_content
};

export const lessonRegisterInits = {
  "lesson_1/part_1" : lesson_1_part_1_init,
  "lesson_1/part_2" : lesson_1_part_2_init,
  "lesson_1/part_3" : lesson_1_part_3_init,
  "lesson_1/part_4" : lesson_1_part_4_init,
  "lesson_1/part_5" : lesson_1_part_5_init
};

export const lessonAssembly = {
  "lesson_1/part_1" : lesson_1_part_1_assembly,
  "lesson_1/part_2" : lesson_1_part_2_assembly,
  "lesson_1/part_3" : lesson_1_part_3_assembly,
  "lesson_1/part_4" : lesson_1_part_4_assembly,
  "lesson_1/part_5" : lesson_1_part_5_assembly
}

export const lessonStarterCode = {
  "lesson_1/part_1" : lesson_1_part_1_starter,
  "lesson_1/part_2" : lesson_1_part_2_starter,
  "lesson_1/part_3" : lesson_1_part_3_starter,
  "lesson_1/part_4" : lesson_1_part_4_starter,
  "lesson_1/part_5" : lesson_1_part_5_starter
};

export const lessonReferenceSolutions = {
  "lesson_1/part_1" : lesson_1_part_1.solution,
  "lesson_1/part_2" : lesson_1_part_2.solution,
  "lesson_1/part_3" : lesson_1_part_3.solution,
  "lesson_1/part_4" : lesson_1_part_4.solution,
  "lesson_1/part_5" : lesson_1_part_5.solution
};
