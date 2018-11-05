/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';

import { Button, Popover, PopoverHeader, PopoverBody } from 'mdbreact';

import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

class Implement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unviewedImplementExplanation: true,
      theme: this.props.theme,
      studentProgram: this.props.studentProgram
    };
  }

  render() {
    var pulsatingInterest =
      <div className="pulsating-dot__ripple">
        <span></span>
        <div></div>
        <div></div>
        <div></div>
      </div>;

    var implementExplanation;
    if (this.state.unviewedImplementExplanation) {
      implementExplanation =
        <Popover placement="right" component="a" popoverBody={pulsatingInterest}>
          <PopoverHeader></PopoverHeader>
          <PopoverBody>This is where you{"'"}ll be implementing your code for the lesson! We{"'"}ve provided
          you with a template to get started.
            <Button outline style={{width:"100%"}}
              onClick={() => this.setState({ unviewedImplementExplanation : false })}>
              <i className="fa fa-stop" aria-hidden="true"></i> Close Help
            </Button>
          </PopoverBody>
        </Popover>
    } else {
      implementExplanation = <div></div>
    }

    return (
      <div className="lesson__implement">
        {implementExplanation}
        <AceEditor
          className="lesson-implement__editor d-flex"
          mode="javascript"
          theme={this.state.theme}
          onChange={this.props.onChange}
          name="UNIQUE_ID"
          editorProps={{$blockScrolling: true}}
          value={this.props.studentProgram}
          tabSize="2"
        />
      </div>
    );
  }
}

Implement.propTypes = {
  theme: PropTypes.string,
  studentProgram: PropTypes.string,
  onChange: PropTypes.func
}

export default Implement;
