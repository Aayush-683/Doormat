const Discord = require("discord.js");
const canvas = require("discord-canvas");
const client = new Discord.Client();
const { Token, LeaveMsg, WelMsg, WelImg, LeaveImg, WelChan, LeaveChan } = require("./config.js");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.on("ready", async () => {
  console.log(`Bot Is Ready To Go!\nTag: ${client.user.tag}`);
  client.user.setActivity(`New Members!`, { type: "WATCHING" });
});

const keepAlive = require('./alive.js')
keepAlive();

client.on("guildMemberAdd", async member => {
  let Channel = WelChan
  if (!Channel) return;
  
  if (member.user.username.length > 25) member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15) member.guild.name = member.guild.name.slice(0, 15) + "...";
  
  let Msg = WelMsg.replace("<user>", `<@${member.user.id}>`) || `**<@${member.user.id}> just joined!**`
  let Welcomed = new canvas.Welcome();
  let Image = await Welcomed
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "jpg" }))
  .setMemberCount(member.guild.memberCount)
  .setBackground(WelImg || "https://i.redd.it/vda9rbt01en01.png")
  .toAttachment();
  
  let Attachment = new Discord.MessageAttachment(Image.toBuffer(), "Welcome.png");
  return client.channels.cache.get(Channel).send(Msg, Attachment);
});

client.on("guildMemberRemove", async member => {
  let Channel = LeaveChan
  if (!Channel) return;

  if (member.user.username.length > 25) member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15) member.guild.name = member.guild.name.slice(0, 15) + "...";
  
  let Msg = LeaveMsg.replace("<user>", member.user.tag) || `**${member.user.tag} just left the server :(**`
  let Leaved = new canvas.Goodbye();
  let Image = await Leaved
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "jpg" }))
  .setMemberCount(member.guild.memberCount)
  .setBackground(LeaveImg || "https://i.redd.it/vda9rbt01en01.png")
  .toAttachment();
  
  let Attachment = new Discord.MessageAttachment(Image.toBuffer(), "Welcome.png");
  return client.channels.cache.get(Channel).send(Msg, Attachment);
});

client.login(Token).catch(() => console.log(`Invalid Token Is Provided - Please Give Valid Token!`));
