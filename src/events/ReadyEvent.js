import Event from '../structures/Event.js';
import { ActivityType } from "discord.js";
import chalk from 'chalk';

export default class extends Event {
	constructor(client) {
		super(client, {
			name: 'ready'
		});
	}

	async run() {
		const guild = this.client.guilds.cache.get(process.env.GUILD);
		guild.commands.set(this.client.commands);

		console.log(
			`[${chalk.bold.green('STARTED')}] - ${chalk.bold(this.client.user.username)} I WAS CONNECTED ON ${chalk.bold(guild.name)}`
		);

		this.client.user.setStatus("online")
		this.client.user.setActivity(`no Flame 🔥`, { type: ActivityType.Playing })
	}
}