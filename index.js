console.log("index.js started");

require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client();
const https = require("https");
const botSpamChannelID = "765162163181977610";
let botSpamChannel = null;
const inspiroAPI = "https://inspirobot.me/api?generate=true"


function getInspirobotImageURL(action){
  https.get(inspiroAPI, response => {
  let data = "";
  response.on("data", chunk => {
    data += chunk;
  });
  
  response.on('end', () => {
    action(data);
  });
  }).on("error", (error) => {
    console.log("Error: " + error.message);
  });
}

function inspireCommand(msg){
  if (msg.channel.id == botSpamChannelID && msg.content === "-inspire"){
    getInspirobotImageURL((url)=>{
      console.log(url);
      msg.channel.send(url);
    });
  }
}


client.login(process.env.BOT_TOKEN);
client.on("ready", readyDiscord);
client.on("message", inspireCommand)

function readyDiscord(){
    console.log("Bot ready!")
    botSpamChannel = client.channels.cache.get(botSpamChannelID);
    botSpamChannel.send("I'm online :D");
}

setInterval(()=>{
  getInspirobotImageURL((url)=>{
    botSpamChannel.send(url);
  });
}, 60000);