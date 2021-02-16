const inspiroAPI = "https://inspirobot.me/api?generate=true"
const https = require("https");

module.exports = {
    name: ["inspire", "in"], 
    description: "Posts a computer generated image with a caption",
    execute(msg, args){
        getInspirobotImageURL(
            (url) => {
                msg.channel.send(url);
            }
        );
    }
}

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