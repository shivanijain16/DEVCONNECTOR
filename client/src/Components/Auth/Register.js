//eslint-disable-next-line
import React, { Fragment, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
//redux
import { connect } from 'react-redux';
// import { setAlert} from '../../actions/alert';
import register from '../../actions/auth';

const Register = ({ alerts, register, isAuthenticated }) => {
  console.log('register',alerts);
  const [formData, setformData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [nameError, setnameError] = useState('');
  const [password2Error, setpassword2Error] = useState('');

  const { name, email, password, password2 } = formData;
  let i = 0,
    j = 0;
  //validate errors
  const validate = async () => {
    // password validation
    // if(alerts.length===0||alerts.length<0){
    // if(password.length>0&& password2.length>0&&password!==password2){
    //   setAlert(
    //    "Password don't match",
    //   "danger");
    // console.log("Password don't match");
    // }}

    // name validation
    if (name === 'null') {
      setnameError("Name can't be null");
      i++;
    } else if (!name.match(/^[A-z]+( [A-z]+)*$/))
      setnameError('Name can have alphabets only');
    else if (name === 'undefined') setnameError("Name can't be undefined.");
    else {
      setnameError('');
      i = 0;
    }

    // password validation
    if (password2 !== password) {
      setpassword2Error("Passwords don't match");
      j++;
    } else {
      setpassword2Error('');
      j = 0;
    }
  };

  // event handler
  const onChange = (e) => {
    console.log(e);
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await validate();
    console.log(i, j);
    if (i === 0 && j === 0) {
      register({ name, email, password });
      console.log('success', isAuthenticated);
    }
  };
  if (isAuthenticated) return <Navigate to='/' />;
  return (
    <Fragment>
      <section className='container'>
        <h1 className='large text-primary'>Sign Up</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Create Your Account
        </p>
        <form className='form' onSubmit={(e) => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Name'
              name='name'
              value={name || ''}
              onChange={(e) => onChange(e)}
              required
            />
            {/* {errors.nameError.length>0? <div className="alert alert-danger">{errors.nameError}</div>:null} */}
            <span style={{ color: 'red' }}>{nameError}</span>
          </div>

          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email || ''}
              onChange={(e) => onChange(e)}
              required
            />
            <small className='form-text'>
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
          </div>

          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              minLength='6'
              value={password || ''}
              onChange={(e) => onChange(e)}
              required
            />
          </div>

          <div className='form-group'>
            <input
              type='password'
              placeholder='Confirm Password'
              name='password2'
              minLength='6'
              value={password2 || ''}
              onChange={(e) => onChange(e)}
              required
            />
            <span style={{ color: 'red' }}>{password2Error}</span>
          </div>
          <div className='alert-wrapper'>
            {alerts.map((alert) => (
              <div key={alert.id} className={`alert alert-${alert.alertType}`}>
                {alert.msg}
              </div>
            ))}
          </div>

          <input type='submit' className='btn btn-primary' value='Register' />

          <input
            type='reset'
            className='btn btn-secondary'
            value='Clear'
            onClick={(e) => setformData({ formData: '' })}
          />
        </form>

        <p className='my-1'>
          Already have an account? <Link to='/login'>Sign In</Link>
        </p>
      </section>
    </Fragment>
  );
};

Register.propTypes = {
  //  setAlert :PropTypes.func.isRequired,
  alerts: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  alerts: state.alert,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);
