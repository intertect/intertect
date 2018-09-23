#!/usr/bin/env python3
"""
compiles unjoined lessons into final lessons
"""

import os

CONTENT_DIR = "src/content"
GLOSSARY_FN = "glossary.md"

def create_lesson_markdowns(folder):
  glossary_path = "{}/{}".format(folder, GLOSSARY_FN)

  with open(glossary_path, "r") as f:
    glossary = f.readlines()

  files = os.listdir(folder)
  for file in files:
    if "-unjoined.md" in file:
      print(file)
      unjoined_path = "{}/{}".format(folder, file)
      with open(unjoined_path, "r") as f:
        lesson = f.readlines()

      part_name = file.split("-unjoined.md")[0]
      final_name = "{}/{}.md".format(folder, part_name)
      with open(final_name, "w") as f:
        f.writelines(lesson)
        f.write("\n---\n")
        f.writelines(glossary)

if __name__ == "__main__":
  content_folders = os.listdir(CONTENT_DIR)
  for content_folder in content_folders:
    if "lesson_" in content_folder:
      full_path = "{}/{}".format(CONTENT_DIR, content_folder)
      create_lesson_markdowns(full_path)
