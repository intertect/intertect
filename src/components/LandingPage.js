import React, { Component } from 'react';
import { Button, Card, CardHeader, CardTitle, CardBody, Table  } from 'mdbreact';
import FadeIn from 'react-fade-in';

import '../styles/intro.css';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.props = {
    }
  }

  render() {
    var lessonMenuButtons = [];
    var lessons = Array.range(1, 5)
    var lessonTitles = [
      "MIPS Assembly",
      "MIPS Binary",
      "Pipelining",
      "Parallel Pipelining",
    ]
    lessons.map((lesson) => {
      lessonMenuButtons.push(
        <Button outline onClick={() => this.props.selectHandler(lesson)}
          className={(lesson <= this.props.completedLessons + 1) ? "enabled" : "disabled"}
          style={{width:"75%"}}>

          Lesson {lesson}: {lessonTitles[lesson-1]}
        </Button>)
      }
    )

    return (
      <div>
        <div className="row">
          <div className="col-sm-6" style={{position: "absolute", top:"25%", left:"25%"}}>
            <Card style={{ marginTop: '1rem'}} className="text-center">
              <CardHeader color="default-color">
                <CardTitle componentclassName="h1">Intertect</CardTitle>
              </CardHeader>
              <CardBody>
                <FadeIn>
                  <div className="text-left">
                    Welcome to Intertect, where you{"'"}ll be learning about computer architecture here! As computer science marches
                    ahead into higher and higher levels of abstraction, understanding the computer has become more of an
                    afterthought. We hope you{"'"}ll have a much better understanding of the computer and what{"'"}s going on
                    under the hood after going through our platform!
                  </div>

                  <hr />
                  {lessonMenuButtons}
                  <hr />

                  <Button outline
                    onClick={() => this.setState({ showAbout : true })} style={{width:"100%"}}>
                    Meet the Creators
                  </Button>
                </FadeIn>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingPage;
