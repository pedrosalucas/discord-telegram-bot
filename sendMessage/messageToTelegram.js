const mongo = require('../mongo');
const discordChatSchema = require('../schemas/discord-guild-schema');

module.exports = {
	name: 'messageToTelegram',
	description: 'Send message from Discord to Telegram',
	async execute(botTelegram, message) {

		let result;

		await mongo().then(async (mongoose) => {
			try {
				result = await discordChatSchema.findOne({ _id: `${message.guild.id}` });
				if (result) {
					const idTelegramChat = result.channelIdTele;
					botTelegram.sendMessage(idTelegramChat, `Autor: ${message.author.username}#${message.author.discriminator}\n\nContent: ${message.content}`);
				}
			} catch (err) {
				console.error(err);
			} finally {
				mongoose.connection.close();
			}
		});
	},
};