/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';

import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

class Implement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: this.props.theme,
      studentProgram: this.props.studentProgram
    };
  }

  render() {
    return (
      <div className="lesson__implement" id="implement">
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
