const { MongoClient } = require('mongodb');
const config = require('../config.json');
const { nameId, idName } = require('../consts/memberList.js')
const members = require('./members.js')

const mongoURL = config.mongoURL;
const dbName = 'test'; // Change this to your database name
const collectionName = 'members'; // Change this to your collection name


// insertMany takes in an "array of objects"
async function insertMembers() {
  const memberArray = []

  for (const id in idName) {
    const member = {
      memberId: String(id),
      slimes: 0,
      slimeList: [],
      zooms: 0,
      zoomList: []
    }

    memberArray.push(member)
  }

  const client = new MongoClient(mongoURL)

  try {
    await client.connect()
    console.log('Connected to the database')

    const database = client.db(dbName)
    const collection = database.collection(collectionName)

    const insertResult = await collection.insertMany(memberArray)
    console.log('Inserted documents:', insertResult)

    const findResult = await collection.find({})
    console.log('Found documents:', findResult)

  } finally {
    await client.close()
    console.log('Connection closed')
  }
}

/*************************************/
/*************************************/

// Insert multiple documents in a single database operation
async function insertRecords() {
  // To insert multiple documents at once, by putting documents into an array
  const recordsToInsert = [
    { slimeRecord: [] },
    { zoomRecord: [] }
  ]

  const client = new MongoClient(mongoURL)
  try {
    const startTime = new Date()
    await client.connect()
    console.log('Connected to the database')

    const database = client.db(dbName)
    const collection = database.collection(collectionName)

    const insertResult = await collection.insertMany(recordsToInsert)
    console.log('Inserted documents:', insertResult)

    const endTime = new Date()
    const executionTime = endTime - startTime
    console.log('Execution time:', executionTime, 'ms')
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}


/*************************************/
/*************************************/

async function insertSlimerecordAndZoomrecord() {
  const array = []
  const insertResult = await collection.insert({ slimeRecord: []})

  const filter = { slimeRecord: { $exists: true}} // To filter for the document that has the field slimeRecord

  // To push one exampleRecord
  const exampleRecord = { slimeId: '1', summonedAt: 'time', summonedBy: 'memberId' } // slimeId starts from 1; time from "interaction.createdTimestamp"; memberId accessed from idSearch
  const update = { $push: { slimeRecord: exampleRecord}}
  const updateResult = await colleciton.updateOne(filter, update)

  // To push multiple exampleRecords, use $each
  const exampleRecords = [
    { slimeId: '2', summonedAt: 'time', summonedBy: 'memberId' },
    { slimeId: '3', summonedAt: 'time', summonedBy: 'memberId' }
  ]
  const updates = { $push: { slimeRecord: { $each: exampleRecords } } }
  const updateResults = await collection.updateOne(filter, updates)

  /*************************************/
  const updateUsingEach = { $push: {slimeRecord: exampleRecordArray.length === 1 ? exampleRecordArray : { $each: exampleRecordArray } } }
  const updateResultUsingEach = await colleciton.updateOne(filter, updateUsingEach)
  /*************************************/

  const client = new MongoClient(mongoURL)

  try {
    const startTime = new Date()
    await client.connect()
    console.log('Connected to the database')

    const database = client.db(dbName)
    const collection = database.collection(collectionName)

    const insertResult = await collection.insertMany(memberArray)
    console.log('Inserted documents:', insertResult)

    const endTime = new Date()
    const executionTime = endTime - startTime
    console.log('Execution time:', executionTime, 'ms')
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}

/*************************************/
/*************************************/

async function printout() {
  const client = new MongoClient(mongoURL)

  try {
    await client.connect()
    console.log('Connected to the database')

    const database = client.db(dbName)
    const collection = database.collection(collectionName)

    const findResult = await collection.find({}).toArray()
    console.log('Found documents:', findResult)
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}

/*************************************/
/*************************************/

async function addName() {
  const client = new MongoClient(mongoURL)

  try {
    await client.connect()
    console.log('Connected to the database')

    const database = client.db(dbName)
    const collection = database.collection(collectionName)

    // "Cursor", indicating the variable holds the result of a query and implies that it can be itereated over to acess individual documents in the result set

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

    // Print the updated documents
    const findResult = await collection.find({}).toArray()
    console.log('Found documents:', findResult)
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}

/*************************************/
/*************************************/

async function addSlime(memberId, value) {
  const client = new MongoClient(mongoURL)

  try {
    const startTime = new Date()

    await client.connect()
    console.log('Connected to the database')

    const database = client.db(dbName)
    const collection = database.collection(collectionName)

    // Find the document with the specified memberId before the update
    const originalDoc = await collection.findOne({ memberId: memberId })
    // THINK, under what conditions does memberId not match to a document in the database?
    if (!originalDoc) {
      console.log(`No doc found with memberId:`, memberId, ' .Perhaps you will need to create a doc for this member first')
      return
    }

    // Update the slime field
    const filter = { memberId: memberId }
    const update = { $inc: { slime: value }}
    const updateResult = await collection.updateOne(filter, update)
    
    if (updateResult.modifiedCount > 0) {
      console.log(`Successfully updated slime for member ${originalDoc.memberName}`)
      console.log(`Updated slime value for ${originalDoc.memberName}, from ${originalDoc.slime} to ${originalDoc.slime + value}`)
    } else {
      console.log(`No document found with memberId ${memberId}`)
      return
    }

    // Find the document with the specified memberId after the update
    //const updatedDoc = await collection.findOne({ memberId: memberId })
    //console.log(`Updated slime value for ${originalDoc.memberName}, from ${originalDoc.slime} to ${updatedDoc.slime}`)

    const endTime = new Date()
    const executionTime = endTime - startTime
    console.log('Execution time:', executionTime, 'ms')
  } finally {
    await client.close()
    console.log('Database connection closed')
  }
}

/*************************************/
/*************************************/

async function testHasOwnProperty() {
  const client = new MongoClient(mongoURL)

  try {
    const startTime = new Date()

    await client.connect()
    console.log('Connected to the database')

    const database = client.db(dbName)
    const collection = database.collection(collectionName)

    const cursor = collection.find({})
    let count = 0
    for await (const document of cursor) {
      if (document.hasOwnProperty('memberId')) {
        count += 1
      }

      if (document.hasOwnProperty("slimeRecord")) [
        console.log("document that has the field slimeRecord:", document._id)
      ]
    }

    console.log("member count: ",count)

    const endTime = new Date()
    const executionTime = endTime - startTime
    console.log('Execution time:', executionTime, 'ms')
  } finally {
    await client.close()
    console.log('Database connection closed')
  }
}

/*************************************/
/*************************************/

async function insertSlimerecord(slimeRecord) {
  const client = new MongoClient(mongoURL)

  try {
    const startTime = new Date()
    await client.connect()
    console.log('Connected to the database')
    const database = client.db(dbName)
    const collection = database.collection(collectionName)

    const filter = { slimeRecord: { $exists: true } } 
    //const update = { $push: {slimeRecord: slimeRecordArray.length === 1 ? slimeRecordArray : { $each: slimeRecordArray } } }
    const update = { $push: {slimeRecord: slimeRecord}}
    const updateResult = await collection.updateOne(filter, update)
    console.log('Update result:', updateResult)

    const endTime = new Date()
    const executionTime = endTime - startTime
    console.log('Execution time:', executionTime, 'ms')
  } finally {
    await client.close()
    console.log('Database connection closed')
  }
}

const record = {'slimeId': '2', 'summonedAt': 'time', 'summonedBy': 'memberId'}
//insertSlimerecord(record)

/*************************************/
/*************************************/

async function setRecordsToBeEmptyObject() {
  
}