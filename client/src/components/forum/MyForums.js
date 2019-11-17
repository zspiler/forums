import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';

import { getOwnedForums } from '../../actions/forum';

const MyForums = ({
  getOwnedForums,
  forum: { ownedForums, loading },
  auth
}) => {
  auth.isAuthenticated && getOwnedForums(auth.user._id);

  if (!auth.isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <Fragment>
      <div className="center">
        <div className="form-container">
          <div className="row">
            <div className="comment width-40rem">
              <div className="card-body">
                <h4 className="card-title text-green">
                  Here are all the forums you own
                </h4>
                <form>
                  <div>
                    <Link to="/create-forum">
                      <div className="btn btn-outline-primary">
                        Create Forum
                      </div>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {!loading &&
          ownedForums.map(forum => {
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

MyForums.propTypes = {
  forum: PropTypes.object.isRequired,
  getOwnedForums: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { getOwnedForums }
)(MyForums);
