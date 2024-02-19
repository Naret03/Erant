const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads commands on the developer server.'),
	async execute(interaction) {
		const foldersPath = path.resolve(__dirname, '../../commands');
		const commandFolders = fs.readdirSync(foldersPath);
		for (const folder of commandFolders) {
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const filePath = path.join(commandsPath, file);
				delete require.cache[require.resolve(filePath)];
				const command = require(filePath);
				try {
					interaction.client.commands.delete(command.data.name);
					interaction.client.commands.set(command.data.name, command);
				} catch (error) {
					console.error(error);
					await interaction.reply('There was an error while reloading the command: ' + filePath);
				}
			}
		}
		await interaction.reply('All commands successfully reloaded');
	},
};