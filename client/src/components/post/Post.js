import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { addLike, removeLike } from '../../actions/post';
import { connect } from 'react-redux';

const Post = ({
  auth: { isAuthenticated, loading },
  post,
  addLike,
  removeLike
}) => {
  return (
    <div className="container">
      <div className="row">
        <div className="center">
          {!loading && (
            <Fragment>
              {isAuthenticated ? (
                <Fragment>
                  <div onClick={e => addLike(post._id)}>
                    <i className="like fas fa-angle-up"></i>
                  </div>

                  <p>{post.likes.length}</p>

                  <div onClick={e => removeLike(post._id)}>
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
            <h5 className="card-title">{post.title}</h5>
            <p className="forum-link">f/{post.forumName}</p>
            <p className="post-date">
              Posted on <Moment format="MM/DD/YYYY">{post.date}</Moment> by{' '}
              <em>{post.username}</em>
            </p>
            <p className="post-date">{post.comments.length} comments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addLike, removeLike }
)(Post);
