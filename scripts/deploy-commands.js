const { REST, Routes } = require('discord.js');
require('dotenv').config();
const clientId = process.env.CLIENT_ID;
const token = process.env.DISCORD_TOKEN;
const guildID = process.env.TEST_GUILD_ID;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const devCommands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.resolve(__dirname, '../commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	//Ignoring developer commands
	///////if(folder == 'developer-tools') continue;
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			if (folder == 'developer-tools'){
				devCommands.push(command.data.toJSON());
			} else {
				commands.push(command.data.toJSON());
			}
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands`);

		// The put method is used to fully refresh all commands with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}

	try {
		console.log(`Started refreshing ${devCommands.length} developer (/) commands`);

		// The put method is used to fully refresh all commands with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildID),
			{ body: devCommands },
		);

		console.log(`Successfully reloaded ${data.length} developer (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
