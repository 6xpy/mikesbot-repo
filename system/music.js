const ytdlDiscord = require('ytdl-core-discord') 
const {MessageEmbed} = require("discord.js")

module.exports = {
  async play(song, message) {
  const queue = message.client.queue.get(message.guild.id)
  
  if(!song) {
    queue.channel.leave();
    message.client.queue.delete(message.guild.id)
    return queue.textChannel.send(`Queue has ended.`).catch(console.error)
  }
    
    try {
      var stream = await ytdlDiscord(song.url, {
        
        highWaterMark: 1 << 25,
      })
      
    } catch (error) {
      if(queue) {
        queue.songs.shift()
        module.exports.play(queue.songs[0], message)
      }
      
      if(error.message.includes === "copyright") {
        return message.channel.send(`Song has copyrighted audio. Cannot play this sorry.`)
      } else {
        console.error(error)
      }
    }
    
    const dispatcher = queue.connection
    .play(stream, {type: "opus"}).on("finish", () => {
      if(queue.loop) {
        let lastsong = queue.songs.shift()
        queue.songs.push(lastsong)
        module.exports.play(queue.songs[0], message)
      } else {
        queue.songs.shift()
        module.exports.play(queue.songs[0], message)
      }
    }).on("error", console.error)
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    
    
        const embed = new MessageEmbed()
            .setTitle("Now Playing")
            .setURL(song.url)
            .setDescription(`Now Playing - [${song.title}](${song.url})`)
            .setColor("RANDOM")
            .setThumbnail(song.url)
      queue.textChannel.send(embed)
      
    
    
    
    
}
}