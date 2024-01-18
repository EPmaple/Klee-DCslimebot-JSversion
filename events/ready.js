const { ActivityType, Events } = require('discord.js');
const { mongoURL, dbName } = require('../config.json');
const { MongoClient } = require('mongodb');
const { initializeMembersCollection } = require('../database/Members.js');

const pino = require('pino')
const logger = pino()

//const dbName = 'test'; // Change this to your database name
//const collectionName = 'members'; // Change this to your collection name
//const database = client.db(dbName)
//const collection = database.collection(collectionName)
//const client = new MongoClient(mongoURL)
//await client.connect()
//await client.close()

async function isDatabaseEmpty(database) {
  try {
    const collections = await database.listCollections().toArray()
    return (collections.length === 0)
  } catch(err) {
    console.error('Encountered error in function \'isDatabaseEmpty\':', err)
    return false; // Handle the error by assuming the database is not empty
  }
}

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
    try {
      client.user.setActivity({
        name: 'for slime pings',
        type: ActivityType.Watching,
      })
      //console.log(`Ready! Logged in as ${client.user.tag}`);
      logger.info(`Ready! Logged in as ${client.user.tag}`)
  
      /***********************************/
      
      const mongoDBclient = new MongoClient(mongoURL)
      await mongoDBclient.connect()
        .then(() => logger.info("MongoDB Connected ✓"))
        .catch((err) => logger.error("MongoDB connection error:", err))
  
      const database = mongoDBclient.db(dbName)
      const isDbEmpty = await isDatabaseEmpty(database)
  
      if (isDbEmpty) {
        logger.info(`Database is empty, members collection is going to be initialized in database ${dbName}`)
        initializeMembersCollection(database)
      } else {
        // copy the database data, membersCollection, slimeRecordsCollection, zoomRecordsCollection
      }
  
      // Handle the SIGINT signal (Ctrl+C) to close the MongoDB connection when shutting down
      process.on('SIGINT', async () => {
        await mongoDBclient.close();
        logger.info("\nMongoDB connection closed");
        process.exit();
      });
  
    } catch (err) {
      logger.error('Error in execute:', err);
    }
  }
};

