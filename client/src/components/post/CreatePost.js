import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';

import { createPost } from '../../actions/post';

const CreatePost = ({
  history,
  createPost,
  isAuthenticated,
  forum: { forum }
}) => {
  const [formData, setFormData] = useState({
    title: '',
    text: ''
  });

  const { title, text } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    createPost(formData, forum._id, history, forum.name);
  };

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    !forum.loading && (
      <div>
        <section className="signInContainer">
          <h2>Create a Post on f/{forum.name}</h2>
          <div className="form-container">
            <form onSubmit={e => onSubmit(e)}>
              <div className="form-group">
                <label>Title</label>
                <input
                  name="title"
                  type="text"
                  className="form-control"
                  placeholder="Enter post title"
                  value={title}
                  onChange={e => onChange(e)}
                />
              </div>

              <div className="form-group">
                <label>Text</label>
                <textarea
                  name="text"
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  placeholder="Enter post text"
                  value={text}
                  onChange={e => onChange(e)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </form>
          </div>
        </section>
      </div>
    )
  );
};

CreatePost.propTypes = {
  createPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  forum: state.forum
});

export default connect(
  mapStateToProps,
  { createPost }
)(CreatePost);
