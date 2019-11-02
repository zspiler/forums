import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { getTopForums } from '../../actions/forum';

const Communities = ({ getTopForums, forum: { topForums, loading }, auth }) => {
  useEffect(() => {
    getTopForums();
  }, [getTopForums]);

  // Scroll behavior on page refresh

  window.addEventListener(
    'scroll',
    function() {
      localStorage.setItem('scrollPosition', window.scrollY);
    },
    false
  );
  if (localStorage.getItem('scrollPosition') !== null) {
    setTimeout(function() {
      window.scrollTo(0, localStorage.getItem('scrollPosition'));
    }, 1);
  }

  const renderFollowButton = forum => {
    if (!auth.isAuthenticated) {
      return (
        <Link to="/login">
          <div className="btn btn-outline-primary">Follow</div>
        </Link>
      );
    }
    let follows = false;
    auth.user.forums.forEach(function(userForum) {
      if (userForum.forum === forum._id) {
        follows = true;
      }
    });
    if (follows)
      return (
        <div
          onClick={e => {
            unfollowForum(forum);
          }}
          className="btn btn-outline-danger"
        >
          Unfollow
        </div>
      );
    else {
      return (
        <div
          onClick={e => {
            followForum(forum);
          }}
          className="btn btn-outline-primary"
        >
          Follow
        </div>
      );
    }
  };

  const followForum = forum => {
    axios.put('/api/users/follow/' + forum._id, {}).then(response => {
      window.location.reload();
    });
  };

  const unfollowForum = forum => {
    axios.put('/api/users/unfollow/' + forum._id, {}).then(response => {
      window.location.reload();
    });
  };

  return (
    <Fragment>
      <div className="center">
        <div className="form-container">
          <div className="row">
            <div className="comment width-40rem">
              <div className="card-body">
                <h4 className="card-title text-green">List of all forums</h4>
                <p className="card-text small-text">
                  If you have an idea for an online community, don't hesitate to
                  create your own forum!
                </p>
                <form>
                  <div>
                    <button className="btn btn-outline-primary">
                      Create Forum
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {!loading &&
          topForums.map(forum => {
            return (
              <div key={forum._id}>
                <p></p>
                <div className="form-container">
                  <div className="row">
                    <div className="post width-40rem">
                      <div
                        className="card-body"
                        style={{ background: 'rgb(248,248,248)' }}
                      >
                        <Link to={`/f/${forum.name}`}>
                          <h6 className="card-title text-green">
                            {forum.name}
                          </h6>
                        </Link>
                        <p className="card-title">
                          {forum.followerCount} followers
                        </p>
                        <div>{renderFollowButton(forum)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  forum: state.forum,
  auth: state.auth
});

Communities.propTypes = {
  forum: PropTypes.object.isRequired,
  getTopForums: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { getTopForums }
)(Communities);
