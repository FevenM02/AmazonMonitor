const { MessageEmbed } = require('discord.js')
const { trim } = require('../common/util')

exports = {
  name: "watchlist",
  desc: "Display a list of each Amazon link currenty being watched in this server",
  usage: "watchlist",
  type: "view"
}

exports.run = (bot, guild, message, args) => {
  return new Promise((resolve, reject) => {
    bot.con.query(`SELECT * FROM watchlist WHERE guild_id=?`, [guild.id], (err, rows) => {
      if (err) reject('Database error')
      var links = rows.map((x, i) => `${i+1}. ${trim(x.item_name, 100)}\n${x.link.substring(0, x.link.lastIndexOf('/')) + '/'}${x.priceLimit != 0 ? `\nMust be ${x.priceLimit}`:''}`)

      bot.debug.log('Raw database output:', 'debug')
      bot.debug.log(rows, 'debug')

      var embed = new MessageEmbed()
        .setTitle('List of Amazon items currently being watched')
        .setDescription(links.length > 0 ? links.join('\n\n'):'You haven\'t added any items yet!')
        .setColor('BLUE')
        .setFooter(`Currently watching ${rows.length} links in this server`)

      resolve(message.channel.send(embed))
    })
  })
}