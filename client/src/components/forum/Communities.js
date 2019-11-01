import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getTopForums } from '../../actions/forum';

const Communities = ({ getTopForums, forum: { topForums, loading } }) => {
  useEffect(() => {
    getTopForums();
  }, [getTopForums]);

  return (
    <Fragment>
      <div class="center">
        <div class="form-container">
          <div class="row">
            <div class="comment width-40rem">
              <div class="card-body">
                <h4 class="card-title text-green">List of all forums</h4>
                <p class="card-text small-text">
                  If you have an idea for an online community, don't hesitate to
                  create your own forum!
                </p>
                <form>
                  <div>
                    <button class="btn btn-outline-primary">
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
              <div>
                <p></p>
                <div class="form-container">
                  <div class="row">
                    <div class="post width-40rem">
                      <div
                        class="card-body"
                        style={{ background: 'rgb(248,248,248)' }}
                      >
                        <Link to={`/f/${forum.name}`}>
                          <h6 class="card-title text-green">{forum.name}</h6>
                        </Link>
                        <p class="card-title">
                          {forum.followerCount} followers
                        </p>
                        <form>
                          <div>
                            <button class="btn btn-outline-primary">
                              Follow
                            </button>
                          </div>
                        </form>
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
  forum: state.forum
});

Communities.propTypes = {
  forum: PropTypes.object.isRequired,
  getForums: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { getTopForums }
)(Communities);
