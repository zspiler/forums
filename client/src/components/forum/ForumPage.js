import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

import { getForum } from '../../actions/forum';
import { deleteForum } from '../../actions/forum';

import { getForumPosts } from '../../actions/post';
import Spinner from '../layout/Spinner';

import Post from '../post/Post';

const ForumPage = ({
  history,
  deleteForum,
  match,
  getForum,
  getForumPosts,
  posts,
  auth,
  forum: { forum, loading }
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    getForum(match.params.forumName);
    getForumPosts(match.params.forumName);
  }, [getForum, getForumPosts, match.params.forumName]);

  if (!loading && forum === '') return <Redirect to="/NotFound" />;

  const renderDeleteButton = () => {
    if (forum.user === auth.user._id) {
      return (
        <div
          onClick={e => {
            deleteForum(forum._id, history);
          }}
          className="btn btn-danger btn-margin-left"
        >
          Delete Forum
        </div>
      );
    }
  };

  const renderFollowButton = () => {
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
        <Fragment>
          <div
            onClick={e => {
              unfollowForum();
            }}
            className="btn btn-outline-danger"
          >
            Unfollow
          </div>
          <Link to={`/f/${forum.name}/posts/create`}>
            <div className="btn btn-outline-success btn-margin-left">
              Create Post
            </div>
          </Link>
          {auth.isAuthenticated && renderDeleteButton()}
        </Fragment>
      );
    else {
      return (
        <Fragment>
          <div
            onClick={e => {
              followForum();
            }}
            className="btn btn-outline-primary"
          >
            Follow
          </div>
          <Link to={`/f/${forum.name}/posts/create`}>
            <div className="btn btn-outline-success btn-margin-left">
              Create Post
            </div>
          </Link>
          {auth.isAuthenticated && renderDeleteButton()}
        </Fragment>
      );
    }
  };

  const followForum = () => {
    axios.put('/api/users/follow/' + forum._id, {}).then(response => {
      window.location.reload();
    });
  };

  const unfollowForum = () => {
    axios.put('/api/users/unfollow/' + forum._id, {}).then(response => {
      window.location.reload();
    });
  };

  return loading || auth.loading ? (
    <Spinner />
  ) : (
    forum && (
      <div className="center">
        <div className="form-container center">
          <div className="row">
            <div className="comment width-40rem">
              <div className="card-body">
                <h4 className="card-title text-green">{forum.name}</h4>
                <p className="card-text small-text">{forum.description}</p>
                <p className="forum-link">{forum.followerCount} followers</p>
                <form>
                  <div>{renderFollowButton()}</div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="left">
          {posts.map(post => (
            <Post details={false} key={post._id} post={post} />
          ))}
        </div>
      </div>
    )
  );
};

ForumPage.propTypes = {
  forum: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  forum: state.forum,
  posts: state.post.posts,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getForum, getForumPosts, deleteForum }
)(ForumPage);
