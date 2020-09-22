module.exports = {
  name: 'tce-player',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/tce-player',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
