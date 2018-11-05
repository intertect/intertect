/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem } from 'mdbreact';
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
      var numPartsForLesson = lesson <= this.props.completedLessons ? lessonParts[this.props.completedLessons] : this.props.completedParts;
      var parts = Array.range(1, numPartsForLesson + 1)
      if (lesson <= this.props.completedLessons + 1) {
        completedLessons.push(<ListGroupItem active>Lesson {lesson}</ListGroupItem>);
        parts.map((part) => {
          if (part > lessonParts[lesson]) {
            return;
          }
          completedLessons.push(
            <ListGroupItem>
              <div className="row align-middle">
                <div className="col-sm-3">Part {part}</div>
                <div className="col-sm-9">
                  <Button outline onClick={() => {
                    this.props.toggleShowPreviousLessons();
                    this.props.toggleIntroPanel();
                    this.props.loadLesson(lesson, part, true);
                    }} style={{width:"100%"}}>
                    Redo
                  </Button>
                </div>
              </div>
            </ListGroupItem>)
          });
        }
      }
    )

    return (
      <Modal isOpen={this.props.revealCompletedLevels} toggle={() => this.props.toggleCompletedLevels()} centered>
        <ModalHeader>Completed Levels</ModalHeader>
        <ModalBody>
          <ListGroup> {completedLessons} </ListGroup>
        </ModalBody>
        <ModalFooter>
          <div className="row">
            <div className="col-sm-12">
              <Button outline onClick={() => this.props.toggleShowPreviousLessons()} style={{width:"100%"}}>
                Close
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

PreviousLessons.propTypes = {
  completedLessons: PropTypes.number,
  completedParts: PropTypes.number,
  toggleShowPreviousLessons: PropTypes.func,
  toggleIntroPanel: PropTypes.func,
  loadLesson: PropTypes.func,
  revealCompletedLevels: PropTypes.func,
  toggleCompletedLevels: PropTypes.func,
}

export default PreviousLessons;
