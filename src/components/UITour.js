/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';

import PropTypes from 'prop-types';

import Tour from 'reactour'

class UITour extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const steps = [
      {
        selector: '#implement',
        content: `This is your main entrypoint into the app! All the Javascript code you write
        will be done through this editor. In each of the lessons, you should find the
        spots in the code marked with TODOs that identify where you will be working.`,
      },
      {
        selector: '#chooseTheme',
        content: `As with any (decent) code editor, you can change the theme to suit your tastes!
        Feel free to choose as you please (although Solarized Dark is the best).`,
      },
      {
        selector: '#saveCode',
        content: `If you want to take a break and resume later on, click
        here to save your progress!`,
      },

      {
        selector: '#startOver',
        content: `To restart the level with a clean program, click here. This will erase all the
        progress you've made so far in the level, so make sure there's nothing you want to keep
        that hasn't been copied elsewhere.`,
      },
      {
        selector: '#testing',
        content: `Once you think you've completed the lesson, either partially or in its entirety,
        it's time to test! No software development is complete without thorough testing, and that's
        certainly no different here.`
      },
      {
        selector: '#testSelect',
        content: `For each lesson, there will often be a number of test programs open to your
        disposal. Each lesson will have a fixed program we used to evaluate the correctness of
        your code, but feel free to use these other programs we make available to you to test
        specific parts of your implementation! Note that, as you add more and more features to your
        code, we can support more and more test programs, so many of the first couple lesson parts
        will have a limited number of tests for you to run.`,
      },
      {
        selector: '#run',
        content: `To run the program in its entirety, click here. This will execute each step,
        halting execution whenever we notice you're producing a value that's not what we would expect
        to see.`,
      },
      {
        selector: '#step',
        content: `To walk through the program one step at a time, click here. This will execute
        the step highlighted in the assembly program.`,
      },
      {
        selector: '#reset',
        content: `Click here to bring execution of the assembly program back to the first
        instruction. Note that, unlike "Restart Level", reset does not wipe the progress you've made
        in your code.`,
      },
      {
        selector: '#debugging',
        content: `When running the tests above, you'll see the "outputs" in this section. As you
        will learn, the outputs of processor instructions are always written to either memory or
        registers, which are displayed separately here.`,
      },
      {
        selector: '#registersTable',
        content: `As you run your program (with the Step or Run button in the test area), you will
        see the values of registers updated here. Rows highlighted in green are correct and red incorrect.
        When you encounter an incorrect value, hover over the value column to see what we expected to
        see instead. This should help you debug any problems you may have in your code!`,
      },
      {
        selector: '#memoryTable',
        content: `Similar to the registers table, the memory table holds values for any memory
        address you stored into. Note that memory doesn't become relevant for a couple more lessons,
        so this will remain empty until then!`,
      },
      {
        selector: '',
        content: `That's it: now you're ready to learn about computer architecture! Close this tour of the
        UI to see the instructions panel, which will provide all the material you'll need to get going!`
      }
    ]

    return (
      <Tour
          closeWithMask={false}
          steps={steps}
          isOpen={!this.props.completedTour && this.props.isTourOpen}
          onRequestClose={this.props.closeTour} />
    )
  }
}

UITour.propTypes = {
  completedTour: PropTypes.bool,
  isTourOpen: PropTypes.bool,
  closeTour: PropTypes.func
}

export default UITour;
