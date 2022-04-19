import React, { Fragment, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPostById } from '../../actions/post';
import Spinner from '../Layout/Spinner';
import PostItem from '../Layout/posts/PostItem';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';

const Post = ({ getPostById, post: { post, loading } }) => {
  const { id } = useParams();
  useEffect(() => {
    getPostById(id);
  }, [getPostById, id]);
  return loading || post == null ? (
    <Spinner />
  ) : (
    <Fragment>
      <section className='container'>
        <Link to='/posts'>Go back to posts</Link>
        <PostItem post={post} showActions={false}></PostItem>
        <CommentForm postId={post._id} />
        <div className='comments'>
          {post.comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={post._id}
            />
          ))}
        </div>
      </section>
    </Fragment>
  );
};

Post.propTypes = {
  getPostById: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  post: state.post,
  posts: state.post,
});
export default connect(mapStateToProps, { getPostById })(Post);
