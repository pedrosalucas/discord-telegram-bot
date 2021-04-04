const mongo = require('../mongo');
const discordGuildSchema = require('../schemas/discord-guild-schema');

module.exports = {
	name: 'messageToDiscord',
	description: 'Send message from Telegram to Discord',
	async execute(botDiscord, msg, chatId) {

		let result;

		await mongo().then(async (mongoose) => {
			try {
				result = await discordGuildSchema.findOne({ chatIdTele: `${chatId}` });
				if (result) {
					const idDiscordChannel = result.channelIdDisc;
					const channelDiscord = botDiscord.channels.cache.get(idDiscordChannel);
					channelDiscord.send('-----------------------------------');
					channelDiscord.send(`Autor: ${msg.from.first_name} ${msg.from.last_name}\n\nContent: ${msg.text}`);
					channelDiscord.send('-----------------------------------');
				}
			} catch (err) {
				console.error(err);
			} finally {
				mongoose.connection.close();
			}
		});

	},
};