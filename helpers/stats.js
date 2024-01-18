const { MongoClient } = require('mongodb');
const members = require('./members.js')
const config = require('../config.json');

const mongoURL = config.mongoURL

async function local

/* assume these have already been done and there is a stable connection between the bot and MongoDB
const dbName = 'test'; // Change this to your database name
const collectionName = 'members'; // Change this to your collection name
const client = new MongoClient(mongoURL)
await client.connect()
const database = client.db(dbName)
const collection = database.collection(collectionName)
await client.close()
*/

// Before every season starts, manully insert the current ragna members into MongoDB, so there is no discrepancy between MongoDB's memberlist and the local memberlist
async function localDb(){
  let AGEmembers = {}
  let slimeRecord = 

  const cursor = collection.find({})
  for await (const document of cursor) {
    if (document.hasOwnProperty('memberId')) {

      const { _id, memberId, slimes, slimeList, zooms, zoomList, memberName } = document;

      AGEmembers[memberId] = { "slimes": slimes, "slimeList": slimeList, 'zooms': zooms, 'zoomList': zoomList}
    }

    if (document.hasOwnProperty('zoomRecord')) {

    }

    if (document.hasOwnProperty('slimeRecord')) {

    }
  }
}

{"_id":{"$oid":"65a1c8f8240e08492ad3bf4e"},"memberId":"359361962414440449","slimes":{"$numberInt":"0"},"slimeList":[],"zooms":{"$numberInt":"0"},"zoomList":[],"memberName":"Cats On Mars"}



    // Iterate over documents and update each one
    const cursor = collection.find({})
    for await (const document of cursor){
      const memberId = document.memberId

      const memberName = members.getName(memberId)
      // Check if memberId exists in nameId mapping
      if (memberName) {
        // Update the document with the memberName
        await collection.updateOne({ memberId: memberId}, { $set: {memberName: memberName} })
      }
    }

    for (const memberId in members.idList()) {
      AGEmembers[memberId] = {}
  
      // Based on the above premise of no discrepancy between local memberlist and MongoDB memberlist
      const cursor = collection.find({})
    }

