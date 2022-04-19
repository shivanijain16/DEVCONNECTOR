import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({
  experience: { company, from, to, current, title, description },
}) => {
  return (
    <Fragment>
      <div>
        <h3 className='text-dark'>{company}</h3>
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
          <strong>Position: </strong>
          {title}
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

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired,
};

export default ProfileExperience;
