const { dbName } = require('../config.json')
const { idName } = require('../consts/memberList.js')
const members = require('../helpers/members.js')

const collectionName = 'slimeRecords'; // Change this to your collection name

let localSlimeRecords

/* example of slimeRecord
const slimeRecord = { 
  slimeId: "1",
  summonedAt: "time",
  summonedBy: String(memberId)
}
*/

/********************************/
/********************************/

// Input: slimeIdsToRemove (type: Array)
async function deleteSlimeRecords(slimeIdsToRemove, database) {
  try {
    // Update remote db
    const collection = database.collection(collectionName)
    await collection.deleteMany({ slimeId: { $in: slimeIdsToRemove } })

    // Update local db
    slimeIdsToRemove.forEach((slimeId) => {
      delete localSlimeRecords[slimeId]
    })
  } catch(err) {
    console.error('Encountered error in function \'deleteSlimeRecords\':', err)
  }
}

/********************************/
/********************************/

async function insertSlimeRecords(slimeRecordArray, database) {
  try {
    // Update remote db
    const collection = database.collection(collectionName)
    await collection.insertMany(slimeRecordArray)

    // Update local db
    localSlimeRecords = slimeRecordArray.reduce((obj, slimeRecord) => {
      obj[slimeRecord.slimeId] = slimeRecord
    }, localSlimeRecords)
  } catch(err) {
    console.error('Encountered error in function \'insertSlimeRecords\':', err)
  }
}


/********************************/
/********************************/

module.exports = {
  deleteSlimeRecords,
  insertSlimeRecords
}

/**
 * 
let object = {
  '3': { slimeId: "3", summonedAt: "12345", summonedBy: "abc" }
}
const slimeRecord1 = { slimeId: "1", summonedAt: "123", summonedBy: "abc" }
const slimeRecord2 = { slimeId: "2", summonedAt: "1234", summonedBy: "abc" }
const slimeRecord4 = { slimeId: "4", summonedAt: "123456", summonedBy: "abc" }
// To put a slimeRecord into the object
//object[slimeRecord1.slimeId] = slimeRecord1

// If we want to find out all the slimeRecords that belong to a member
function filterForSummonedBy(memberId, slimeRecordsObject) {
  const filteredSlimeRecords = Object.values(slimeRecordsObject).filter((slimeRecord) => slimeRecord.summonedBy === memberId)
  return filteredSlimeRecords
}

 How slimeRecords should look like
const slimeRecordsObject = {
  '1': { slimeId: '1', summonedAt: '123', summonedBy: 'abc' },
  '2': { slimeId: '2', summonedAt: '456', summonedBy: 'def' },
  '3': { slimeId: '3', summonedAt: '789', summonedBy: 'abc' },
}

console.log(`object before array.reduce:`, object)



const array = [slimeRecord1, slimeRecord2, slimeRecord4]
object = array.reduce((obj, slimeRecord) => {
  obj[slimeRecord.slimeId] = slimeRecord
  return obj
}, object)
console.log('object after array.reduce:', object)
 */