/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';

import { Button, Card, CardBody, CardTitle, CardHeader,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Popover, PopoverHeader, PopoverBody,
  Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem,
  Navbar, NavItem, NavbarNav, NavbarBrand, Collapse } from 'mdbreact';

import '../styles/intro.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import {lessonParts, lessonContent, lessonRegisterInits, lessonAssembly,
  lessonStarterCode, lessonReferenceSolutions, lessonBinaryCode,
  lessonPipelineStudent} from '../utils/lessonItems.js';


class Terminal extends Component {
  constructor(props) {
    console.log(props)
    super(props);
  }

  render() {
    console.log(this.props.completedLessons)

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

export default Terminal;
