/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';

import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/chrome';
import 'brace/theme/dracula';
import 'brace/theme/eclipse';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/twilight';

class Implement extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="lesson__implement" id="implement">
        <AceEditor
          className="lesson-implement__editor d-flex"
          mode="javascript"
          theme={this.props.theme}
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
