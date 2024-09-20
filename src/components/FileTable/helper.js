/**
 * Checks whether the current status is "available" or not
 * @param {string} fileStatus
 * @return {boolean}
 */
export const isFileAvailable = (fileStatus) => fileStatus === 'available';

/**
 * Returns the paths for the given files, keeping the same order
 * @param {array[object]} files
 * @return {array[string]}
 */
export const getPathsForAllAvailableFiles = (files) =>
  files.reduce((acc, file) => {
    if (isFileAvailable(file.status)) {
      acc.push(file.path);
    }
    return acc;
  }, []);

/**
 * Formats the path and the device info related to the given path, if found in the given map
 * @param {Map<string, object>} filesByPaths
 * @param {string} currentPath
 * @return {`Path: ${*}, Device: ${*}` | ''}
 */
export const formatPathAndDeviceInfo = (filesByPaths, currentPath) => {
  const foundFile = filesByPaths.get(currentPath);
  if (foundFile) {
    const { path, device } = foundFile;
    return `Path: ${path}, Device: ${device}`;
  }
  return '';
};
