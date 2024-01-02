const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello_there')
		.setDescription('such meme'),
	async execute(interaction) {
		interaction.reply('General Kenobi');
	},
};
