import _ from 'lodash';
import React from 'react';
import { useQuery } from '@apollo/client';
import { ProfileCard } from '../../components/profile-card';
import { GET_APP_INFO } from './gql';
import { Spinner } from '../../components/spinner';

export const Home = () => {
  const { data, loading } = useQuery(GET_APP_INFO);
  const dependencies = _.get(data, 'appInfo.dependencies', []);
  const contributors = _.get(data, 'appInfo.contributors', []);
  const profileDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.';
  if (loading) {
    return <Spinner/>;
  }
  return (
    <section id='home' className='section'>
      <div className='container'>
        <h1 className='title'>{_.get(data, 'appInfo.name')}</h1>
        <div className='field is-grouped is-grouped-multiline'>
          <div className='control'>
            <div className="tags has-addons">
              <span className="tag is-dark">git</span>
              <span className="tag is-info">{_.get(data, 'appInfo.version')}</span>
            </div>
          </div>
        </div>
        <div className='content'>
          <h3>Description</h3>
          <p>{_.get(data, 'appInfo.description')}</p>
          <h3>Dependencies</h3>
          <ul>
            {dependencies.map((dep, idx) => <li key={idx}>{dep}</li>)}
          </ul>
          {contributors.map((author, idx) => <ProfileCard
            key={idx}
            name={author.name}
            username={author.email}
            description={profileDescription}
            url={author.url}
          />)}
        </div>
      </div>
    </section>
  );
};