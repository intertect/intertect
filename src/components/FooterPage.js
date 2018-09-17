import React from 'react';
import { Col, Container, Row, Footer } from 'mdbreact';

function FooterPage(props) {
  return(
    <Footer color="stylish-color-dark" className="page-footer font-small pt-4 mt-4">
        <div className="footer-copyright text-center py-3">
            &copy; {(new Date().getFullYear())} Copyright: Yash Patel and Peter DeLong. All rights reserved.
        </div>
    </Footer>
  );
}

export default FooterPage;
