/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';

import LandingPage from './LandingPage.js'
import LessonPage from './LessonPage.js'

import '../styles/shared.css';
import '../styles/landing.css';
import '../styles/lesson.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedLesson: false
    };

    this.selectHandler = this.selectHandler.bind(this);
    this.toggleLoadedLesson = this.toggleLoadedLesson.bind(this);
  }

  toggleLoadedLesson() {
    this.setState({
      loadedLesson: !this.state.loadedLesson
    });
  }

  selectHandler() {
    this.setState({
      loadedLesson : true
    })
  }

  render() {
    var newUser = localStorage.getItem('completedLessons') == null;
    return (
      this.state.loadedLesson ?

      <LessonPage
        toggleLoadedLesson={this.toggleLoadedLesson} />
      :
      <LandingPage
        selectHandler={this.selectHandler}
        newUser={newUser} />
    );
  }
}

export default App;
