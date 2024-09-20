import {
  formatPathAndDeviceInfo,
  getPathsForAllAvailableFiles,
  isFileAvailable,
} from './helpers';

describe('Helper functions', () => {
  describe('isFileAvailable', () => {
    it('returns true when the file status is "available"', () => {
      const result = isFileAvailable('available');
      expect(result).toBe(true);
    });

    it('returns false when the file status is not "available"', () => {
      expect(isFileAvailable('scheduled')).toBe(false);
      expect(isFileAvailable(null)).toBe(false);
    });
  });

  describe('getPathsForAllAvailableFiles', () => {
    const mockFiles = [
      { status: 'available', path: '/path/to/file1' },
      { status: 'scheduled', path: '/path/to/file2' },
      { status: 'available', path: '/path/to/file3' },
    ];

    it('returns only the paths of available files', () => {
      const result = getPathsForAllAvailableFiles(mockFiles);
      expect(result).toEqual(['/path/to/file1', '/path/to/file3']);
    });

    it('returns an empty array if no files are available', () => {
      const mockFilesNoAvailable = [
        { status: 'scheduled', path: '/path/to/file1' },
        { status: 'scheduled', path: '/path/to/file2' },
      ];
      const result = getPathsForAllAvailableFiles(mockFilesNoAvailable);
      expect(result).toEqual([]);
    });
  });

  describe('formatPathAndDeviceInfo', () => {
    const filesByPaths = new Map([
      [
        '/path/to/file1',
        {
          path: '/path/to/file1',
          device: 'Device1',
        },
      ],
      [
        '/path/to/file2',
        {
          path: '/path/to/file2',
          device: 'Device2',
        },
      ],
    ]);

    it('returns the formatted string when the file is found', () => {
      const result = formatPathAndDeviceInfo(filesByPaths, '/path/to/file1');
      expect(result).toBe('Path: /path/to/file1, Device: Device1');
    });

    it('returns an empty string when the file is not found', () => {
      const result = formatPathAndDeviceInfo(
        filesByPaths,
        '/path/to/nonexistentfile'
      );
      expect(result).toBe('');
    });
  });
});
