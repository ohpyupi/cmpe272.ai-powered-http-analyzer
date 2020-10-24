import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

export const ProfileCard = ({
  name, username, url, description,
}) => (
  <div className="profile-card card">
    <div className="card-content">
      <div className="media">
        <div className="media-left">
          <figure className="image is-48x48">
            <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image"/>
          </figure>
        </div>
        <div className="media-content">
          <p className="title is-4">{name}</p>
          <p className="subtitle is-6">{username}</p>
        </div>
      </div>
      <div className="content">
        {description}
        <br/>
        <a href={url} rel="noreferrer" target='_blank'>{url}</a>
      </div>
    </div>
  </div>
);

ProfileCard.propTypes = {
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  description: PropTypes.string,
};