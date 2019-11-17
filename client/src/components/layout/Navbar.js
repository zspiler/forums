import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const authLinks = (
    <Fragment>
      <a href="#!" onClick={logout}>
        <button className="btn btn-outline-danger btn-margin-left">
          Logout
        </button>
      </a>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <Link to="/login">
        <button className="btn btn-outline-success">Login</button>
      </Link>

      <Link to="/register">
        <button className="btn btn-outline-success btn-margin-left">
          {' '}
          Register
        </button>
      </Link>
    </Fragment>
  );

  return (
    <header id="pageHeader">
      <nav className="navbar navbar-expand-md">
        {/* <nav className="navbar navbar-expand"> */}

        <Link className="navbar-brand" to="/">
          Forums
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbafr-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/following">
                Following
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/communities">
                Communities
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create-forum">
                Create Forum
              </Link>
            </li>
            {user && isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-forums">
                  My Forums
                </Link>
              </li>
            )}
          </ul>

          {user && isAuthenticated && (
            <div className="user-greeting">Welcome, {user.username}!</div>
          )}

          {!loading && (
            <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
          )}
        </div>
      </nav>
    </header>
  );
};

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
