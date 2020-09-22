module.exports = {
  name: 'activity-player',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/activity-player',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
