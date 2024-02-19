const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-emoji')
		.setDescription('Adds a given image as an emoji')
		// Subcommand for URL
		.addSubcommand(subcommand => 
			subcommand.setName('url')
				.setDescription('Add emoji using an image URL')
				.addStringOption( option => 
					option.setName('url')
						.setDescription('Image URL')
						.setRequired(true)
				)
		)
		// Subcommand for Image attachment
		.addSubcommand(subcommand => 
			subcommand.setName('attachment')
				.setDescription('Add an emoji using an image attachment')
				.addAttachmentOption(option => 
					option.setName('image-attachment')
						.setDescription('The image to be added as an emoji')
						.setRequired(true)
				)
		),
	async execute(interaction) {
		let URL;
		if(interaction.options._subcommand == 'attachment'){
			URL = interaction.options.data[0].options[0].attachment.attachment;
		}else if(interaction.options._subcommand == 'url'){
			URL = interaction.options.data[0].options[0].value;
		}else{
			URL = 'Error retrieving image';
		}
		interaction.reply(URL);
	},
};