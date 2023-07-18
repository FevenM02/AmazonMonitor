import { Client, EmbedBuilder, Message } from 'discord.js'
import { trim } from '../common/utils'
import { getWatchlist } from '../common/watchlist'
import debug from '../common/debug'

export default {
  name: 'watchlist',
  description: 'Display a list of each Amazon link currenty being watched in this server',
  usage: 'watchlist',
  type: 'view',
  run
}

async function run(bot: Client, message: Message) {
  const rows = await getWatchlist()
  const links = rows.map((row, i) => {
    if (row.type === 'link') {
      // @ts-ignore This is fine
      let str = `**${i + 1}. ${trim(row.itemName, 100)}\n${row.link.substring(0, row.link.lastIndexOf('/')) + '/'}**`

      if (row.priceLimit) {
        str += `\nPrice must be below ${row.symbol || '$'}${row.priceLimit}`
      }

      if (row.pricePercentage) {
        str += `\nPrice must be more than ${row.pricePercentage}% off previous detected price`
      }

      if (row.difference) {
        str += `\nPrice must be more than ${row.symbol || '$'}${row.difference} off previous detected price`
      }

      return str
    }
    
    if (row.type === 'query') {
      // @ts-ignore This is fine
      let str = `**${i + 1}. ${trim(row.query, 100)}**`

      if (row.priceLimit) {
        str += `\nPrice must be below ${row.symbol || '$'}${row.priceLimit}`
      }

      if (row.pricePercentage) {
        str += `\nPrice must be more than ${row.pricePercentage}% off previous detected price`
      }

      if (row.difference) {
        str += `\nPrice must be more than ${row.symbol || '$'}${row.difference} off previous detected price`
      }

      return str
    }

    if (row.type === 'category') {
      // @ts-ignore This is fine
      let str = `**${i + 1}. ${trim(row.name, 100)}**`

      if (row.priceLimit) {
        str += `\nPrice must be below ${row.symbol || '$'}${row.priceLimit}`
      }

      if (row.pricePercentage) {
        str += `\nPrice must be more than ${row.pricePercentage}% off previous detected price`
      }

      if (row.difference) {
        str += `\nPrice must be more than ${row.symbol || '$'}${row.difference} off previous detected price`
      }

      return str
    }
  })

  debug.log('Raw watchlist output:', 'debug')
  debug.log(rows, 'debug')

  const embed = new EmbedBuilder()
    .setTitle('List of Amazon items currently being watched')
    .setColor('Blue')
    .setFooter({
      text: `Currently watching ${rows.length} items in this server`
    })

  const description = links.length > 0 ? links.join('\n\n') : 'You haven\'t added any items yet!'
  const maxLen = 2048
  const splitDescriptions = description.split('')

  const chunks = []

  // Split description into chunks of size maxLen
  while (splitDescriptions.length > 0) {
    chunks.push(splitDescriptions.splice(0, maxLen))
  }

  for (const desc of chunks) {
    embed.setDescription(desc.join(''))

    await message.channel.send({
      embeds: [embed]
    })
  }
}