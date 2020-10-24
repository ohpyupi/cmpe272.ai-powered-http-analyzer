import React from 'react';
import { SampleComponent } from '../../components/sample';

export const SampleContainer = () => (
  <section id="sample" className="section">
    <div className='container'>
      <h1 className='title'>Sample Container</h1>
      <div className='content'>
        <SampleComponent />
      </div>
    </div>
  </section>
);