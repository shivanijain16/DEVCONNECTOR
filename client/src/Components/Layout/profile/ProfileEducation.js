import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({
  education: {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    title,
    description,
  },
}) => {
  return (
    <Fragment>
      <div>
        <h3 class='text-dark'>{school}</h3>
        <p>
          {<Moment format='YYYY/MM/DD'>{from}</Moment>}
          {' - '}
          {current ? (
            <span>Now</span>
          ) : (
            <span>{<Moment format='YYYY/MM/DD'>{to}</Moment>}</span>
          )}
        </p>
        <p>
          <strong>Degree: </strong>
          {degree}
        </p>
        <p>
          <strong>Field of Study: </strong>
          {fieldofstudy}
        </p>
        {description && (
          <p>
            <strong>Description: </strong>
            {description}
          </p>
        )}
      </div>
    </Fragment>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
