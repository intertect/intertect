/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
import PropTypes from 'prop-types';

import { lessonParts } from '../utils/lessonItems.js';

class PreviousLessons extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var completedLessons = [];
    var lessons = Array.range(1, 5)
    lessons.map((lesson) => {
      if (lesson <= this.props.completedLessons) {
        completedLessons.push(<DropdownItem header>
          Lesson {lesson}
        </DropdownItem>);

        var numPartsForLesson = lesson < this.props.completedLessons ?
          lessonParts[lesson] : this.props.completedParts;
        var parts = Array.range(1, numPartsForLesson + 1)
        parts.map((part) => {
          if (part > lessonParts[lesson]) {
            return;
          }
          completedLessons.push(
            <DropdownItem onClick={() => {
              this.props.toggleIntroPanel();
              this.props.loadLesson(lesson, part, true);
              }} style={{whiteSpace: "normal"}}>
              Part { part }
            </DropdownItem>)
          });
        }
      }
    )

    return (
      <Dropdown>
        <DropdownToggle nav caret className="landing-navbar__animated-link">Lessons</DropdownToggle>
        <DropdownMenu className="landing-navbar__dropdown-menu">
          {completedLessons}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

PreviousLessons.propTypes = {
  completedLessons: PropTypes.number,
  completedParts: PropTypes.number,
  toggleIntroPanel: PropTypes.func,
  loadLesson: PropTypes.func,
  revealCompletedLevels: PropTypes.func,
  toggleCompletedLevels: PropTypes.func,
}

export default PreviousLessons;
