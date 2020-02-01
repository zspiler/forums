import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getTopForums } from '../../actions/forum';

const Top5forums = ({ getTopForums, forum: { topForums, loading } }) => {
  useEffect(() => {
    getTopForums();
  }, [getTopForums]);

  return (
    <div id="top5">
      <div className="title-container">
        <h6>Popular forums</h6>
      </div>
      <div className="card">
        <table className="table table-light">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">forum</th>
              <th scope="col">followers</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              topForums.slice(0, 5).map((forum, index) => {
                return (
                  <tr key={forum._id}>
                    <th scope="row" id="row">
                      {++index}
                    </th>
                    <td>
                      <Link to={`/f/${forum.name}`}>{forum.name}</Link>
                    </td>

                    <td>{forum.followerCount}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  forum: state.forum
});

Top5forums.propTypes = {
  forum: PropTypes.object.isRequired,
  getTopForums: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getTopForums })(Top5forums);
