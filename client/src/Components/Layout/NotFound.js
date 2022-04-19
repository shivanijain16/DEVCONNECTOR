import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const NotFound = (props) => {
  return (
    <Fragment>
      <section className='container'>
        <h1 className='x-large text-primary'>
          <i className='fas fa-exclamation-triangle'>Page Not Found</i>
        </h1>
        <p className='large'>Sorry , this page doesn't exist.!!</p>
      </section>
    </Fragment>
  );
};

NotFound.propTypes = {};

export default NotFound;
