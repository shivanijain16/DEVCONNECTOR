import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Spinner from '../Layout/Spinner';
import { DashboardActions } from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import Alert from '../Layout/Alert';
const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile == null ? (
    <Spinner />
  ) : (
    <Fragment>
      <section className='container'>
        <h1 className='large text-primary'>Dashboard</h1>
        <p className='lead'>
          <i className='fas fa-user'>Welcome {user && user.name}</i>
        </p>

        {profile !== null ? (
          <Fragment>
            <DashboardActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div className='my-2'>
              <button className='btn btn-danger' onClick={deleteAccount}>
                <i className='fas fa-user-mnius'></i> Delete Account
              </button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <p>
              You haven't yet setup any profile , please add your profile by
              clicking below
            </p>
            <Link to='/create-profile' className='btn btn-primary my-1'>
              Create Profile
            </Link>
            <Alert />
          </Fragment>
        )}
      </section>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
  loading: state.auth,
  alerts: state.alert,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
