import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
  profile: {
    skills,
    bio,
    user: { name },
  },
}) => {
  return (
    <Fragment>
      <div className='profile-about bg-light p-2'>
        {bio && <h2 className='text-primary'>Bio</h2>}

        <p>{bio}</p>
        <div className='line'></div>
        <h2 className='text-primary'>Skill Set</h2>
        <div className='skills'>
          {skills.map((skill, index) => (
            <div className='p-1' key={index}>
              <i className='fa fa-check'></i> {skill}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
