import * as tfvis from '@tensorflow/tfjs-vis';
import dataset from '../data/dataset.json';
import trainLogs from '../data/trainLogs.json';

const abnormal = dataset.filter(data => data.label === 'abnormal');
const normal = dataset.filter(data => data.label === 'normal');

tfvis.visor();
tfvis.render.table(
    {
        name: 'Features',
        tab: 'Table',
    },
    {
        headers: [
            'label',
            'requestLength',
            'argumentLength',
            'argumentNumber',
            'pathLength',
            'specialCharNumberInPath',
        ],
        values: dataset.map(data => [
            data.label,
            data.requestLength,
            data.argumentLength,
            data.argumentNumber,
            data.pathLength,
            data.specialCharNumberInPath,
        ]),
    },
);

tfvis.render.scatterplot(
    { name: 'pathLength vs requestLength', tab: 'Charts' },
    {
        values: [
            normal.map(data => ({
                x: data.pathLength,
                y: data.requestLength,
            })),
            abnormal.map(data => ({
                x: data.pathLength,
                y: data.requestLength,
            })),
        ],
        series: ['Normal', 'Abnormal']
    },
    {
        xLabel: 'pathLength',
        yLabel: 'requestLength',
    },
);

tfvis.render.scatterplot(
    { name: 'specialCharNumbersInPath vs pathLength', tab: 'Charts' },
    {
        values: [
            normal.map(data => ({
                x: data.specialCharNumberInPath,
                y: data.pathLength,
            })),
            abnormal.map(data => ({
                x: data.specialCharNumberInPath,
                y: data.pathLength,
            })),
        ],
        series: ['Normal', 'Abnormal']
    },
    {
        xLabel: 'specialCharNumberInPath',
        yLabel: 'pathLength',
    },
);

tfvis.render.scatterplot(
    { name: 'argumentNumber vs requestLength', tab: 'Charts' },
    {
        values: [
            normal.map(data => ({
                x: data.argumentNumber,
                y: data.requestLength,
            })),
            abnormal.map(data => ({
                x: data.argumentNumber,
                y: data.requestLength,
            })),
        ],
        series: ['Normal', 'Abnormal']
    },
    {
        xLabel: 'argumentNumber',
        yLabel: 'requestLength',
    },
);

tfvis.show.history({
    name: 'Loss',
    tab: 'Training',
}, trainLogs, ["loss", "val_loss"]);
tfvis.show.history({
    name: 'Accuracy',
    tab: 'Training',
}, trainLogs, ["acc", "val_acc"]);