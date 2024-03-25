const { SlashCommandBuilder } = require('discord.js');
const sharp = require('sharp');
const maxEmojiSize = 256000;

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
				.addStringOption( option => 
					option.setName('emoji-name')
						.setDescription('Name of the emoji')
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
				.addStringOption( option => 
					option.setName('emoji-name')
						.setDescription('Name of the emoji')
						.setRequired(true)
				)
		),
	async execute(interaction) {
		// TODO: GIFs, Sanitizing inputs, handling all the errors
		let response = 'Response hasn\'t been configured yet...';
		await interaction.reply(response);
		// retrieving image URL and emoji name
		const emojiName = interaction.options.data[0].options[1].value;
		let URL;
		if(interaction.options._subcommand == 'attachment'){
			URL = interaction.options.data[0].options[0].attachment.attachment;
		}else if(interaction.options._subcommand == 'url'){
			URL = interaction.options.data[0].options[0].value;
		}

		// Getting the image as a buffer array
		let bufferArray;
		await (async () => {
			try {
				const response = await fetch(URL);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				bufferArray = await response.arrayBuffer();
			} catch (error) {
				console.error(error);
			}
		})();

		// Creating the sharp object
		let image;
		try {
			image = sharp(bufferArray).resize(128, 128);
			let currentSize = (await image.toBuffer()).length;
			let compressQuality = 90; // Current compression value
			let compressionStep = 10; // How fast does the comrpession quality drops for each iteration
			while (currentSize > maxEmojiSize){
				image.webp({
					quality: compressQuality, 
					force: true
				});
				compressQuality -= compressionStep;
				currentSize = (await image.toBuffer()).length;
				if(compressQuality <= 0){
					throw new Error('Image couldn\'t be compressed to the right size');
				}
			}
		} catch (error) {
			console.error(error);
		}

		// adding the emoji to the server
		await interaction.guild.emojis.create({
			name: emojiName,
			attachment: image
		});
	},
};