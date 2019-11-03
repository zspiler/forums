import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

import { createForum } from '../../actions/forum';

const CreateForum = ({ history, isAuthenticated, createForum }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const { name, description } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    createForum(formData, history);
  };

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <Fragment>
      <section className="signInContainer">
        <h2>Create a Forum</h2>
        <div className="form-container">
          <form onSubmit={e => onSubmit(e)}>
            <div className="form-group">
              <label>Forum Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter forum name"
                name="name"
                value={name}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                placeholder="Enter forum description"
                name="description"
                value={description}
                onChange={e => onChange(e)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </form>
        </div>
      </section>
    </Fragment>
  );
};

CreateForum.propTypes = {};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { createForum }
)(CreateForum);
