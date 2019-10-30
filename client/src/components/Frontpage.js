import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPosts } from '../actions/post';
import Post from './post/Post';
import Spinner from './layout/Spinner';

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
          <Post key={post._id} post={post} />
        ))}
      </section>

      <div id="top5">
        <div className="title-container">
          <h6>Popular forums</h6>
        </div>
        <div className="card">
          <div className="card-body">
            <p>anime</p>
            <p>sports</p>
            <p>movies</p>
            <p>leagueoflegends</p>
            <p>konosuba</p>
          </div>
        </div>
      </div>
    </div>
  );
};

Frontpage.propTypes = {
  auth: PropTypes.object.isRequired,
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
