/**
 * Promise Delay
 * @param delay default is 100
 * @returns
 */
export function delay(delay = 100) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}
