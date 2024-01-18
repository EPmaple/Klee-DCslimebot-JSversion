const { dbName } = require('../config.json')
const { idName } = require('../consts/memberList.js')
const members = require('../helpers/members.js')
const { deleteSlimeRecords, insertSlimeRecords } = require('./SlimeRecords.js')
const pino = require('pino')
const logger = pino()

const collectionName = 'members'; // Change this to your collection name

/********************************/
/********************************/

async function findMember(memberId) {
  const startTime = new Date()

  try {
    const member = await collection.findOne({ memberId: memberId })
    console.log(`findOne result: ${member}`)

    const endTime = new Date()
    const executionTime = endTime - startTime
    console.log('Execution time of function \'findMember\':', executionTime, 'ms')
  } catch(err) {
    console.error('Encountered error in function \'findMember\':', err)
  }
}

/********************************/
/********************************/

async function findMembers() {
  const startTime = new Date()

  try {
    const members = await collection.find({})
    console.log('Found documents:', findResult)

    const endTime = new Date()
    const executionTime = endTime - startTime
    console.log('Execution time of function \'findMembers\':', executionTime, 'ms')

    return members
  } catch(err) {
    console.error('Encountered error in function \'findMembers\':', err)
  }
}

/* example object from "const members = await collection.find({})"
{
  _id: new ObjectId('65a1c8f8240e08492ad3bf8d'),
  memberId: '465942228791984149',
  slimes: 0,
  slimeList: [],
  zooms: 0,
  zoomList: [],
  memberName: 'GonBu'
},
*/

/********************************/
/********************************/

async function insertMember(memberId) {
  const startTime = new Date()
  const member = {
    memberId: String(id),
    memberName: members.getName(id),
    slimes: 0,
    slimeList: [],
    zooms: 0,
    zoomList: []
  }

  try {
    const insertResult = await collection.insert(member)
    console.log('Inserted document:', insertResult)

    const endTime = new Date()
    const executionTime = endTime - startTime
    console.log('Execution time of function \'insertMembers\':', executionTime, 'ms')
  } catch(err) {
    console.error('Encountered error in function \'insertMember\':', err)
  }
}

/********************************/
/********************************/

async function initializeMembersCollection(database) {
  const collection = database.collection(collectionName)
  const startTime = new Date()
  const memberArray = []

  for (const id in idName) {
    const member = {
      memberId: String(id),
      memberName: members.getName(id),
      slimes: 0,
      slimeList: [],
      zooms: 0,
      zoomList: []
    }

    memberArray.push(member)
  }

  try {
    const insertResult = await collection.insertMany(memberArray)
    console.log(`Insert result: ${insertResult}, \n Does array length and inserted count match: ${memberArray.length === insertResult.insertedCount}`)

    const endTime = new Date()
    const executionTime = endTime - startTime
    console.log('Execution time of function \'insertMembers\':', executionTime, 'ms')
  } catch(err) {
    console.error('Encountered error in function \'insertMembers\':', err)
  }
}

/********************************/
/********************************/

function updateHelper(memberId, value, interaction, database) {
  try {
    let update

    if (value > 0) { // Positive: add to slimes and slimeList
      const currentSlimeSum = 0 // gotten from outside function
      const summonedAt = interaction.createdTimestamp // ???
      let slimeIdArray = []
      let slimeRecordArray = []

      for (let i = 0; i < value; i++) {
        const slimeId = String(currentSlimeSum + i + 1)
        slimeIdArray.push(slimeId)

        const slimeRecord = { slimeId: slimeId, summonedAt: summonedAt, summonedBy: String(memberId) }
        slimeRecordArray.push(slimeRecord)
      }
      // To update MongoDB
      update = {
        $push: { slimeList: { $each: slimeIdArray } },
        $inc: { slimes: value }
      }
      insertSlimeRecords(slimeRecordArray, database)
      // To update local database
      AGEMembers[memberId]['slimeList'].push(...slimeIdArray)
      AGEMembers[memberId]['slimes'] += value
      slimeRecords = slimeRecordArray.reduce((obj, slimeRecord) => {
        obj[slimeRecord.slimeId] = slimeRecord
        return obj
      }, slimeRecords)

    } else { // Negative: subtract from slimes and remove from slimeList
      // Let's assume we have a local db that ideally should be the same and be always updated to be the same as mongoDB
      // slimeList of a member (type: Array)
      const slimeIdsToRemove = AGEMembers[memberId]['slimeList'].slice(value)
      //const slimeIdsToRemove = memberDoc.slimeList.slice(value)

      // To update MongoDB
      update = {
        $pull: { slimeList: { $each: slimeIdsToRemove } },
        $inc: { slimes: value }
      }
      deleteSlimeRecords(slimeIdsToRemove, database)
      // To update local database
      
    }
    return update // consider the condition where the above conditions may fail

  } catch(err) {
    console.error('Encountered error in function \'updateMemberSlime\':', err)
  }
}

async function updateMemberSlime(memberId, value, interaction, database) {
  try {
    const startTime = new Date()
    const collection = database.collection(collectionName)

    const filter = { memberId: memberId }
    const update = updateHelper(memberId, value, interaction, database)

    const updateResult = await collection.updateOne(filter, update)
    console.log(`Update result: ${updateResult}`)

    const endTime = new Date()
    const executionTime = endTime - startTime
    console.log('Execution time of function \'updateMemberSlime\':', executionTime, 'ms')
  } catch(err) {
    console.error('Encountered error in function \'updateMemberSlime\':', err)
  }
}

/********************************/
/********************************/

async function updateMemberZoom(memberId, value) {

}

module.exports = {
  initializeMembersCollection
}