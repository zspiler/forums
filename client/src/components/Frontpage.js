import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getPosts } from '../actions/post';
import Post from './post/Post';
import Spinner from './layout/Spinner';
import Top5forums from './forum/Top5Forums';

const Frontpage = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return loading || posts === null ? (
    <Spinner />
  ) : (
    <div className="grid-mainpage">
      <section id="posts">
        <div className="title-container">
          <h6>Recent posts</h6>
        </div>
        {posts.map(post => (
          <Post details={false} key={post._id} post={post} />
        ))}
      </section>
      <Top5forums />
    </div>
  );
};

Frontpage.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPosts }
)(Frontpage);
