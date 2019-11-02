import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import Post from './Post.js';
import Spinner from '../layout/Spinner';
import Top5forums from '../forum/Top5Forums';
import {
  getPost,
  addComment,
  removeComment,
  likeComment,
  unlikeComment
} from '../../actions/post';

const PostPage = ({
  likeComment,
  unlikeComment,
  addComment,
  removeComment,
  getPost,
  match,
  auth: { isAuthenticated, loading, user },
  post: { post }
}) => {
  useEffect(() => {
    getPost(match.params.postId);
  }, [match.params.postId, getPost]);

  const [text, setText] = useState('');

  return loading || post === null || post.loading ? (
    <Spinner />
  ) : (
    <div className="grid-mainpage">
      <section id="posts">
        <div className="title-container">
          <h4 className="text-green">f/sports</h4>
        </div>
        <Post details={true} key={post._id} post={post} />

        {isAuthenticated && (
          <Fragment>
            <div className="title-container">
              <h6>Leave a Comment</h6>
            </div>
            <div className="container">
              <div className="row">
                <div className="post width-25rem">
                  <div className="card-body">
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        addComment(post._id, { text });
                        setText('');
                        window.scroll(0, 0);
                      }}
                    >
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          name="text"
                          cols="40"
                          rows="3"
                          placeholder="Comment on this post"
                          value={text}
                          onChange={e => setText(e.target.value)}
                        ></textarea>
                      </div>
                      <input
                        type="submit"
                        className="btn btn-success"
                        value="Submit"
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        )}

        <div className="title-container">
          <h6>Comments:</h6>
        </div>

        {post.comments.map(comment => (
          <div className="container" key={comment._id}>
            <div className="row">
              <div className="center">
                {isAuthenticated ? (
                  <Fragment>
                    <div onClick={e => likeComment(post._id, comment._id)}>
                      <i className="like fas fa-angle-up"></i>
                    </div>
                    <p>{comment.likes.length}</p>
                    <div onClick={e => unlikeComment(post._id, comment._id)}>
                      <i className="like fas fa-angle-down"></i>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Link to="/login">
                      <i className="like fas fa-angle-up"></i>
                    </Link>
                    <p>{comment.likes.length}</p>
                    <Link to="/login">
                      <i className="like fas fa-angle-down"></i>
                    </Link>
                  </Fragment>
                )}
              </div>

              <div className="post width-40rem">
                <div className="card-body">
                  <p className="small-text">{comment.text}</p>
                  <p className="post-date">
                    <Moment format="MM/DD/YYYY HH:mm">{comment.date}</Moment>{' '}
                    <em>{comment.name}</em>
                  </p>
                </div>
              </div>
              {isAuthenticated && comment.user === user._id && (
                <div
                  onClick={e => {
                    removeComment(post._id, comment._id);
                    window.scroll(0, 0);
                  }}
                  className="btn btn-danger"
                >
                  Remove
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
      <Top5forums />
    </div>
  );
};

PostPage.propTypes = {
  addComment: PropTypes.func.isRequired,
  removeComment: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  unlikeComment: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPost, addComment, removeComment, likeComment, unlikeComment }
)(PostPage);
