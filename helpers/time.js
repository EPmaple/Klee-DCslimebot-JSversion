// Input: timestamp (type: String) (acquired from interaction.createdTimestamp)
//    [example input: '1641495887000']
// Output: UTC string format (type: String)
//    [example output: 'Thu, 06 Jan 2022 19:04:47 GMT']
function getUTCString(timestamp) {
  const date = new Date(timestamp)
  return date.toUTCString()
}

/****
 * const interactionTimestamp = 1641495887000; // Example timestamp
const interactionDate = new Date(interactionTimestamp);

console.log(interactionDate)
console.log(interactionDate.toUTCString()); // Output in UTC string format
console.log(interactionDate.toLocaleString());

const backToTimestamp = interactionDate.getTime(); // Convert Date object back to timestamp

console.log(backToTimestamp); // Output: 1641495887000

 */