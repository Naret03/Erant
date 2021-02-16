console.log("main.js started");

const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

let prefix = ">";
const botSpamChannelID = "765162163181977610";
let botSpamChannel = null;
client.commands = [];

function readyDiscord(){
    console.log("Bot ready!");
    botSpamChannel = client.channels.cache.get(botSpamChannelID);
    botSpamChannel.send("I'm online :D");
}

function callCommand(msg){
  let givenCommand;
  let arguments;
  if(msg.content.startsWith(prefix)){
    index = msg.content.indexOf(" ");
    if(index === -1){
      index = msg.content.length;
    }
    givenCommand = msg.content.substr(prefix.length, index-1);
    arguments = msg.content.substr(index + 1);
    for(const command of client.commands){
      if("name" in command && command.name.indexOf(givenCommand) !== -1){
        command.execute(msg, arguments);
        break;
      }
    }
  }
}

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.push(command);
}

client.login(process.env.token);
client.on("ready", readyDiscord);
client.on("message", callCommand)