const { nameId, idName } = require('../consts/memberList.js')

const UNKNOWN = '0';

// Input: memberId (type: String)
// Output: name (type: String)
const getName = (memberId) => idName[memberId];

// Input: None
// Output: idList (type: Array)
function idList() {
  return cachedIdListSortedbyName
}

// Input: interaction (type: interaction object), text (type: String)
// Output: id (type: String)
function idSearch(interaction, text) {

  // Accepts discord @mention from text
  if (text.startsWith('<@') && text.endsWith('>')) {
    let mentionId
    mentionId = text.slice(2, -1)

    if (mentionId.startsWith('!')) {
      mentionId = mentionId.slice(1)
    }
    return String(mentionId)
  }

  // StringOption of 'user' is required, therefore, a non-empty option would be passed into the function

  // Map free test to a known user

  // Consider first word of searched text only, for now
  const nameParts = text.split(' ')
  const namePart = nameParts[0]

  // Consider name part after any special character as irrelevant
  const cleanedNamePart = namePart.replace(/[^a-zA-Z0-9].*/, '');
  /************************************************/
  // To remove the first occurrence of non-alphanumeric characters
  // Consider input = 'John$ Doe#42', the above first regex would output: 'John'
  // To remove all non-alphanumeric characters globally
  // Consider input = 'John$ Doe#42', this second regex would output: 'JohnDoe42'
  // const namePartCleaned = namePart.replace(/[^a-zA-Z0-9]+/g, '');
  const namePartLower = cleanedNamePart.toLowerCase()

  // For a required option, discord.js slash command does not take in '' (empty string) or ' ' (space)
  // If you enter '   maple' or 'maple   ', discord.js would clean it up as 'maple'

  // Map 'me'
  if (namePartLower === 'me') {
    return String(interaction.user.id)
  }

  // Map if name matches the part
  for (const name in nameId) {
    if (namePartLower === name.toLowerCase()) {
      return String(nameId[name])
    }
  }

  // Map if name begins with the part
  for (const name in nameId) {
    if (name.toLowerCase().startsWith(namePartLower)) {
      return String(nameId[name])
    }
  }

  // Map if name contains the part
  for (const name in nameId) {
    if (name.toLowerCase().includes(namePartLower)) {
      return String(nameId[name])
    }
  }

  return UNKNOWN
}

// Input: None
// Output: idList (type: Array)
function getIdListSortedbyName() {
  const sortedName = Object.entries(idName).sort((a, b) => a[1].localeCompare(b[1]));
  return sortedName.map(([id, name]) => id);
}

const cachedIdListSortedbyName = getIdListSortedbyName()

module.exports = {
  UNKNOWN,
  getName,
  idList,
  idSearch
}