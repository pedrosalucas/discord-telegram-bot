/* eslint-disable no-unused-vars */
module.exports = {
	name: 'help',
	description: 'Listing all necessary settings',
	execute(client, message) {
		const recommendationMenssage = '- Set a text channel called "telegram-group" \n   In there the telegram messages appeared';

		message.channel.send(recommendationMenssage);
	},
};