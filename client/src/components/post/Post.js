import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { likePost, unlikePost, removePost } from '../../actions/post';

const Post = ({
  history,
  removePost,
  details,
  auth: { isAuthenticated, loading, user },
  post,
  likePost,
  unlikePost
}) => {
  return (
    <div className="container">
      <div className="row">
        <div className="center">
          {!loading && (
            <Fragment>
              {isAuthenticated ? (
                <Fragment>
                  <div onClick={e => likePost(post._id)}>
                    <i className="like fas fa-angle-up"></i>
                  </div>

                  <p>{post.likes.length}</p>

                  <div onClick={e => unlikePost(post._id)}>
                    <i className="like fas fa-angle-down"></i>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <Link to="/login">
                    <div>
                      <i className="fas fa-angle-up"></i>
                    </div>
                  </Link>
                  <p>{post.likes.length}</p>
                  <Link to="/login">
                    <div>
                      <i className="fas fa-angle-down"></i>
                    </div>
                  </Link>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>

        <div className="card post width-40rem">
          <div className="card-body">
            <Link to={`/f/${post.forumName}/${post._id}`}>
              <h5 className="card-title">{post.title}</h5>
            </Link>
            {details && <p className="card-text">{post.text}</p>}

            {!details && (
              <Link to={`/f/${post.forumName}`}>
                <span className="forum-link">f/{post.forumName}</span>
              </Link>
            )}
            <p className="post-date">
              Posted on <Moment format="MM/DD/YYYY">{post.date}</Moment> by{' '}
              <em>{post.username}</em>
            </p>
            <p className="post-date">{post.comments.length} comments</p>
          </div>
          {isAuthenticated && post.user === user._id && (
            <div
              onClick={e => {
                removePost(post._id, history);
              }}
              className="btn btn-outline-danger"
            >
              Remove Post
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  details: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(
  connect(
    mapStateToProps,
    { likePost, unlikePost, removePost }
  )(Post)
);
