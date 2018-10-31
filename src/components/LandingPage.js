import React, { Component } from 'react';
import { NavbarBrand, Navbar, NavbarNav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
import PropTypes from 'prop-types';

import '../styles/shared.css';
import '../styles/landing.css';

import yash from '../images/yash.png';
import peter from '../images/peter.png';
import lucy from '../images/lucy.png';
import cpu from '../images/cpu.png';
import desk from '../images/desk.svg';
import sand from '../images/sand.svg';

Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

class LandingPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="landing">
        <Navbar color="default-color" className="landing__navbar">
          <NavbarBrand className="landing-navbar__brand mx-3" href="/">
            Intertect
          </NavbarBrand>

          <NavbarNav right>
            <NavItem className="landing-navbar__item">
              <Dropdown className="landing-navbar__animated-link mx-3">
                <DropdownToggle nav caret>Lessons</DropdownToggle>
                <DropdownMenu className="landing-navbar__dropdown-menu">
                  <DropdownItem href="#" onClick={() => this.props.selectHandler(1)}>
                    1: MIPS Assembly
                  </DropdownItem>
                  <DropdownItem href="#" onClick={() => this.props.selectHandler(2)}>
                    2: MIPS Binary
                  </DropdownItem>
                  <DropdownItem href="#" onClick={() => this.props.selectHandler(3)}>
                    3: Pipelining
                  </DropdownItem>
                  <DropdownItem href="#" onClick={() => this.props.selectHandler(4)}>
                    4: Parallel Pipelining
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
          </NavbarNav>
        </Navbar>

        <div className="landing__section landing__section-1">
          <h1 className="landing-section__title">
            Learn Computer Architecture
          </h1>
          <div className="landing-section__desk">
            <img src={desk} className="img-fluid"/>
            <h5><a href="#" onClick={() => this.props.selectHandler(1)}>GET STARTED</a></h5>
          </div>
        </div>

        <div className="landing__section landing__section-2">
          <div className="landing-section__content">
            <div className="row">
              <div className="col-6 px-5">
                <h1 className="h1-responsive">Constructive</h1>
                <img src={cpu} className="img-fluid"/>
                <h5 className="pt-3 px-4">
                  Through a series of exercises, you will build a MIPS processor. But don&apos;t worry if you haven&apos;t the slightest clue how one works! Our exercises start with abstracted representations of the processor in Javascript, so that it&apos;s easy to understand for people of all technical backgrounds.
                </h5>
              </div>
              <div className="col-6 px-5">
                <h1 className="h1-responsive">Flexible</h1>
                <h5 className="pt-5 px-4">
                  During your journey of building this processor, you&apos;ll have plenty of opportunities to experiment and expand its functionality. Intertect gives you a sandbox to test out any program you can conjure up, so explore away!
                </h5>
                <img src={sand} className="img-fluid pt-3"/>
              </div>
            </div>
          </div>
        </div>

        <div className="landing__section landing__section-3">
          <h1 className="h1-responsive">Meet the Creators</h1>
          <div className="landing-section__content">
            <div className="row">
              <div className="col-4 p-3">
                <div className="p-4">
                  <img src={yash} className="landing-section-content__creator img-fluid"/>
                  <h5 className="landing-section-creator__bio">
                    Yash is a software developer at Oculus VR (Facebook), who&apos;s interested in computer vision, machine learning, and VR.
                  </h5>
                </div>
              </div>
              <div className="col-4 p-3">
                <div className="p-4">
                  <img src={peter} className="landing-section-content__creator img-fluid"/>
                  <h5 className="landing-section-creator__bio">
                    Peter is a software developer at Google Cloud. He really likes computer architecture, networks, and systems programming.
                  </h5>
                </div>
              </div>
              <div className="col-4 p-3">
                <div className="p-4">
                  <img src={lucy} className="landing-section-content__creator img-fluid"/>
                  <h5 className="landing-section-creator__bio">
                    Lucy is a software developer at LinkedIn. She likes making software that helps people and in her spare time also sings and creates art.
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LandingPage.propTypes = {
  completedLessons: PropTypes.number,
  selectHandler: PropTypes.func,
  toggleLoadedLesson: PropTypes.func
}

export default LandingPage;
