import _ from 'lodash';
import React, { useRef } from 'react';
import Chart from 'chart.js';
import { useQuery } from '@apollo/client';
import { HTTP_REQUEST_LOG } from './gql';
import { Spinner } from '../../components/spinner';
import 'chart.js/dist/Chart.min.css';
import './styles.scss';

export const Dashboard = () => {
  const pieChartRef = useRef(null);
  const { loading } = useQuery(HTTP_REQUEST_LOG, {
    onCompleted(data) {
      const ctx = pieChartRef.current.getContext('2d');
      const { abnormal, normal } = _.get(data, 'httpRequestLog', {});
      /* eslint-disable no-new  */
      new Chart(ctx, {
        type: 'pie',
        data: {
          datasets: [{
            data: [abnormal, normal],
            backgroundColor: [
              'rgb(54, 162, 235)',
              'rgb(255, 99, 132)',
            ],
          }],
          labels: [
            'Abnormal',
            'Normal',
          ],
        },
        options: {
          title: {
            display: true,
            text: 'HTTP Request Logs',
          },
        },
      });
    },
  });
  if (loading) {
    return <Spinner/>;
  }
  return (
    <section id="dashboard">
      <div id="pie-chart-container">
        <canvas ref={pieChartRef}></canvas>
      </div>
    </section>
  );
};
