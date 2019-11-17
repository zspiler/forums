import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { getFollowingPosts } from '../../actions/post';
import Post from '../post/Post';
import Spinner from '../layout/Spinner';
import Top5forums from '../forum/Top5Forums';

const Following = ({
  getFollowingPosts,
  auth: { isAuthenticated },
  post: { posts, loading }
}) => {
  useEffect(() => {
    getFollowingPosts();
  }, [getFollowingPosts]);

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return loading || posts === null ? (
    <Spinner />
  ) : (
    <div className="grid-mainpage">
      <section id="posts">
        <div className="title-container">
          <h6>Recent posts from Forums that you follow</h6>
        </div>
        {posts.map(post => (
          <Post details={false} key={post._id} post={post} />
        ))}
      </section>
      <Top5forums />
    </div>
  );
};

Following.propTypes = {
  getFollowingPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  post: state.post
});

export default connect(mapStateToProps, { getFollowingPosts })(Following);
