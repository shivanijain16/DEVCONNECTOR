import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Layout/Navbar';
import Landing from './Components/Layout/Landing';
import Login from './Components/Auth/Login';
// import Alert from './Components/Layout/Alert';
import Register from './Components/Auth/Register';
import Dashboard from './Components/dashboard/Dashboard';
import PrivateRoute from './Components/routing/PrivateRoute';
import CreateProfile from './Components/Layout/profile-forms/CreateProfile';
import EditProfile from './Components/Layout/profile-forms/EditProfile';
import AddExperience from './Components/Layout/profile-forms/AddExperience';
import AddEducation from './Components/Layout/profile-forms/AddEducation';
import Profiles from './Components/Layout/profiles/Profiles';
import Profile from './Components/Layout/profile/Profile';
import Posts from './Components/Layout/posts/Post';
import Post from './Components/post/Post';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
//redux
import { Provider } from 'react-redux';
import store from './store';
import NotFound from './Components/Layout/NotFound';

const App = () => {
  useEffect(() => {
    if (localStorage.token) setAuthToken(localStorage.token);
    store.dispatch(loadUser());
  }, []); /////////// adding empty brakcet means that it wll only run once

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          {/* <Alert/> */}

          <Routes>
            <Route exact path='/' element={<Landing />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/profiles' element={<Profiles />} />
            <Route exact path='/profile/:id' element={<Profile />} />
            <Route
              exact
              path='/dashboard'
              element={<PrivateRoute component={Dashboard} />}
            />
            <Route
              exact
              path='/create-profile'
              element={<PrivateRoute component={CreateProfile} />}
            />
            <Route
              exact
              path='/edit-profile'
              element={<PrivateRoute component={EditProfile} />}
            />
            <Route
              exact
              path='/add-Experience'
              element={<PrivateRoute component={AddExperience} />}
            />
            <Route
              exact
              path='/add-Education'
              element={<PrivateRoute component={AddEducation} />}
            />
            <Route
              exact
              path='/posts'
              element={<PrivateRoute component={Posts} />}
            />
            <Route
              exact
              path='/posts/:id'
              element={<PrivateRoute component={Post} />}
            />
            <Route exact path='*' element={<NotFound />}></Route>
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
