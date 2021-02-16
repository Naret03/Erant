const topicAPI = "https://www.conversationstarters.com/random.php"
const https = require("https");

module.exports = {
    name: ["topic", "tp"], 
    description: "Creates a randomly generated topic",
    execute(msg, args){
        getTopicHTML(
            (html) => {
                let message = html.substr(html.indexOf(">") + 1);
                msg.channel.send(message);
            }
        );
    }
}

function getTopicHTML(action){
    https.get(topicAPI, response => {
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