import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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
      <nav className="navbar navbar-expand">
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
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home
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
          </ul>

          {user && isAuthenticated && (
            <div className="user-greeting">Welcome, {user.username}!</div>
          )}

          {!loading && (
            <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
          )}

          <form>
            {/* <button className="btn btn-outline-danger btn-margin-left">
              Logout
            </button> */}
            {/* 
            <Link to="/login">
              <button className="btn btn-outline-success">Login</button>
            </Link>

            <Link to="/register">
              <button className="btn btn-outline-success btn-margin-left">
                {' '}
                Register
              </button>
            </Link> */}
          </form>
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

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
