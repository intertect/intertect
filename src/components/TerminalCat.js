/* eslint-disable import/no-named-as-default */
import React from "react";

class TerminalCat extends React.Component {
  render() {
    return (
      <div id="cat_main_output" style={{display: 'none'}}>
        <br />{'#include &lt;stdio.h&gt;'} 
        <br />{'int main() {'}
        <br />&nbsp;&nbsp;&nbsp;&nbsp;{'printf("Hello, World!");'}
        <br />&nbsp;&nbsp;&nbsp;&nbsp;{'return 0;'}
        <br />{'}'}
        <br /> 
      </div>
    );
  }
}

export default TerminalCat;