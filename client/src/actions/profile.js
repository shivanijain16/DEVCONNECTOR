import axios from 'axios';

import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_PROFILES,
  GET_REPOS,
} from './types';
import { setAlert } from './alert';

// get current logged in user profile
export const getCurrentProfile = () => async (dispatch) => {
  console.log('getCu');
  try {
    const res = await axios.get('http://localhost:5000/api/profile/me');
    console.log('action', res);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};

// get all profiles
export const getAllProfiles = () => async (dispatch) => {
  try {
    const res = await axios.get('http://localhost:5000/api/profile');
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};

//get profile by an userId
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/profile/userId/${userId}`
    );
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};

// get github repos of an user
export const getGitHubRepos = (userName) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/profile/github/${userName}`
    );
    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};
// to create profile for an user
export const createProfile =
  (profileData, navigate, edit = false) =>
  async (dispatch) => {
    console.log(profileData, 'coming');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify(profileData);
      console.log(body);
      const res = await axios.post(
        'http://localhost:5000/api/profile',
        body,
        config
      );
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });

      if (!edit) {
        navigate('/dashboard');
      }
      dispatch(
        setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
      );
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// ADD experience
export const addExperience = (profileData, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify(profileData);
    console.log(body);
    const res = await axios.put(
      'http://localhost:5000/api/profile/experience',
      body,
      config
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Experience Added', 'success'));

    navigate('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;
    console.log('errors', errors);

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// ADD education
export const addEducation = (profileData, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify(profileData);
    console.log(body);
    const res = await axios.put(
      'http://localhost:5000/api/profile/education',
      body,
      config
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Education Added', 'success'));

    navigate('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// DELETE education

export const deleteEducation = (del_id) => async (dispatch) => {
  console.log('deleteEd', del_id);
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    // const ids = String(id);
    const res = await axios.delete(
      `http://localhost:5000/api/profile/education/${del_id}`,
      config
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Edu Deleted', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// DELETE experience

export const deleteExperience = (del_id) => async (dispatch) => {
  console.log('deleteEx', del_id);
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    // const ids = String(id);
    const res = await axios.delete(
      `http://localhost:5000/api/profile/experience/${del_id}`,
      config
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Experience Deleted', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// delete an user account ( post &  profile)

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure you want to delete this account?')) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      await axios.delete(`http://localhost:5000/api/profile`, config);
      dispatch({ type: CLEAR_PROFILE });
      dispatch({
        type: ACCOUNT_DELETED,
      });
      dispatch(setAlert('Your acount has been deleted permananetly'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
