const mongo = require('../mongo');
const discordGuildSchema = require('../schemas/discord-guild-schema');

module.exports = {
	name: 'setToken',
	description: 'Setting token',
	async execute(botTelegram, msg, chatId, token) {
		if (!token) {
			botTelegram.sendMessage(chatId, 'Plesae insert a token at command.');
			return;
		}
		const guildId = token.split('-')[0];

		await mongo().then(async (mongoose) => {
			try {
				const result = await discordGuildSchema.findOneAndUpdate({
					_id: `${guildId}`,
				}, {
					chatIdTele: `${chatId}`,
					titleTele: msg.chat.title,
				}, {
					upsert: true,
				});
				if (result) {
					botTelegram.sendMessage(chatId, `You sync with ${result.titleDisc} Discord Guild.`);
				}
			} catch (err) {
				console.error(err);
				botTelegram.sendMessage(chatId, 'Sorry, the process failed.');
			} finally {
				mongoose.connection.close();
			}
		});

	},
};