import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileTop = ({
  profile: {
    user: { avatar, name },
    company,
    status,
    location,
    website,
    social,
  },
}) => {
  return (
    <Fragment>
      <div className='profile-top bg-primary p-2'>
        <img className='round-img my-1' src={avatar} alt='' />
        <h1 className='large'>{name}</h1>
        <p className='lead'>
          {status}
          {company && <span> at {company}</span>}
        </p>
        <p>{location}</p>

        <div className='icons my-1'>
          {website && (
            <a href={website} target='_blank' rel='noopener noreferrer'>
              <i className='fas fa-globe fa-2x'></i>
            </a>
          )}
          {social && social.twitter ? (
            <a href={social.twitter} target='_blank' rel='noopener noreferrer'>
              <i className='fab fa-twitter fa-2x'></i>
            </a>
          ) : null}
          {social && social.facebook ? (
            <a href={social.facebook} target='_blank' rel='noopener noreferrer'>
              <i className='fab fa-facebook fa-2x'></i>
            </a>
          ) : null}
          {social && social.linkedin ? (
            <a href={social.linkedin} target='_blank' rel='noopener noreferrer'>
              <i className='fab fa-linkedin fa-2x'></i>
            </a>
          ) : null}
          {social && social.youtube ? (
            <a href={social.youtube} target='_blank' rel='noopener noreferrer'>
              <i className='fab fa-youtube fa-2x'></i>
            </a>
          ) : null}
          {social && social.instagram ? (
            <a
              href={social.instagram}
              target='_blank'
              rel='noopener noreferrer'
            >
              <i className='fab fa-instagram fa-2x'></i>
            </a>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileTop;

/* {social
            ? Object.entries(social)
                .filter(([_, value]) => value)
                .map(([key, value]) => (
                  <a
                    key={key}
                    href={value}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className={`fab fa-${key} fa-2x`}></i>
                  </a>
                ))
            : null} */
