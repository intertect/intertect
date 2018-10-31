/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';

import LandingPage from './LandingPage.js'
import LessonPage from './LessonPage.js'

import '../styles/intro.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

class Terminal extends Component {
  constructor(props) {
    super(props);

    // Validate localStorage
    localStorage.clear()
    if (localStorage.getItem('completedLessons') > 4) {
      localStorage.setItem('completedLessons', 4);
    }

    var completedLessons = localStorage.getItem('completedLessons');
    this.state = {
      loadedLesson: false,
      completedLessons: completedLessons || 3,
      lesson: null,
      lessonPart: null
    };

    this.selectHandler = this.selectHandler.bind(this);
    this.toggleLoadedLesson = this.toggleLoadedLesson.bind(this);
  }

  toggleLoadedLesson() {
    this.setState({
      loadedLesson: !this.state.loadedLesson
    });
  }

  selectHandler(lesson) {
    this.setState({
      loadedLesson : true,
      lesson: lesson,
      lessonPart: 1
    })
  }

  render() {
    return (
      this.state.loadedLesson ?

      <LessonPage
        completedLessons={this.state.completedLessons}
        lesson={this.state.lesson}
        lessonPartNum={this.state.lessonPart}
        toggleLoadedLesson={this.toggleLoadedLesson} />
      :
      <LandingPage
        completedLessons={this.state.completedLessons}
        selectHandler={this.selectHandler} />
    );
  }
}

export default Terminal;
