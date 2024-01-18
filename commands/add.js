const { SlashCommandBuilder } = require('discord.js');
const members = require('../helpers/members.js')

const data = new SlashCommandBuilder()
  .setName('add')
  .setDescription('To add or subtract the desired # of slimes')
  .addIntegerOption(option =>
    option.setName('number')
      .setDescription('The number of slimes to add')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('username')
      .setDescription('The user to add slimes to')
      .setRequired(true))

async function execute(interaction) {
  const numberOfSlimes = interaction.options.getInteger('number');

  const username = interaction.options.getString('username');
  // console.log(`userInput: ${userInput}, of type: ${typeof userInput}`);

  const memberId = members.idSearch(interaction, username)

  if (memberId === members.UNKNOWN) {
    await interaction.reply('invalid member')
    return
  }

  /*************** */

  const action = numberOfSlimes > 0 ? 'added' : 'subtracted';
  const originalSlimes = 100; // REPLACE THIS!!!
  const currentSlimes = originalSlimes + numberOfSlimes;

  const responseMessage = `Klee has ${action} slimes for ${members.getName(memberId)}.\n Number of slimes changed from ${originalSlimes} to ${currentSlimes}.`;

  await interaction.reply(responseMessage);
}

module.exports = {
  data: data,
  execute
}