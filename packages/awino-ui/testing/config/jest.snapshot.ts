const snapshotResolver = {
  // resolves from test file to snapshot path
  resolveSnapshotPath: (testPath: string, snapshotExtension: string) =>
    testPath.replace('/src/', '/testing/__snapshots__/') + snapshotExtension,
  // resolves from snapshot to test file path
  resolveTestPath: (snapshotFilePath: string, snapshotExtension: string) =>
    snapshotFilePath.replace('/testing/__snapshots__/', '/src/').slice(0, -snapshotExtension.length),
  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: '/src/components/shared/Link/Link.test.tsx',
};

export default snapshotResolver;
