// The fs module is Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
// The path module is Node's native path utility module. path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,] });

/************************************************************/
/************************************************************/

// The following code regarding commands dynamically loads command modules from the 'commands' folder, checks if they have the required properties, and adds them to a Collection for later use in a Discord.js bot. It provides a flexible way to add or remove commands without modifying the main bot file for each new command

// Collection is used to store and efficiently retrieve commands for execution.
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath)

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

/*
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
}
*/

/************************************************************/
/************************************************************/

// After this, listening for other events is as easy as creating a new file in the events folder. The event handler will automatically retrieve and register it whenever you restart your bot.
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
    // The rest parameter collects these variable number of arguments into a single array, and the spread syntax then takes these elements and passes them to the execute function.
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

/************************************************************/
/************************************************************/

// Log in to Discord with your client's token
client.login(token);