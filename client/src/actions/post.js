import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from './types';
import { setAlert } from './alert';
import axios from 'axios';

//get all posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('http://localhost:5000/api/posts');
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};

// add a like

export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/posts/like/${postId}`
    );
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};

//remove a like

export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/posts/unlike/${postId}`
    );
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};

// delete post

export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:5000/api/posts/${postId}`);
    dispatch({
      type: DELETE_POST,
      payload: postId,
    });
    dispatch(setAlert('POST REMOVED', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};

//add post
export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'Application/json',
    },
  };
  try {
    console.log(formData);

    const res = await axios.post(
      'http://localhost:5000/api/posts',
      formData,
      config
    );
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch(setAlert('POST created', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};

// get a post by id
export const getPostById = (id) => async (dispatch) => {
  try {
    console.log('get post by id');
    const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
    console.log(res.data);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};

// add comment

export const addComment = (postId, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'Application/json',
    },
  };
  try {
    console.log(formData);

    const res = await axios.post(
      `http://localhost:5000/api/posts/comment/${postId}`,
      formData,
      config
    );
    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert('Comment added', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};

// delete comment

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    console.log(
      `http://localhost:5000/api/posts/comment/${postId}/${commentId}`
    );
    const res = await axios.delete(
      `http://localhost:5000/api/posts/comment/${postId}/${commentId}`
    );
    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });
    dispatch(setAlert('Comment removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, errors: err.response.status },
    });
  }
};
