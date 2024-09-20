/**
 * Checks whether the current file's status is "available"
 * @param {string} fileStatus - The status of the file.
 * @return {boolean} True if the file is available, otherwise false.
 */
export const isFileAvailable = (fileStatus) => fileStatus === 'available';

/**
 * Returns the paths for all available files from the given array of file objects.
 * @param {Array<{status: string, path: string}>} files - Array of file objects, each containing a status and path.
 * @return {Array<string>} An array of paths for files that are available.
 */
export const getPathsForAllAvailableFiles = (files) =>
  files.reduce((acc, file) => {
    if (isFileAvailable(file.status)) {
      acc.push(file.path);
    }
    return acc;
  }, []);

/**
 * Formats the path and device info for the given path, if found in the provided map.
 * @param {Map<string, Object>} filesByPaths - A map where the key is the file path and the value is the file object.
 * @param {string} currentPath - The current file path to lookup in the map.
 * @return {string} Formatted string "Path: {path}, Device: {device}" or an empty string if not found.
 */
export const formatPathAndDeviceInfo = (filesByPaths, currentPath) => {
  const foundFile = filesByPaths.get(currentPath);
  if (foundFile) {
    const { path, device } = foundFile;
    return `Path: ${path}, Device: ${device}`;
  }
  return '';
};
