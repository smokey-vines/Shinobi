import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ICommand, IParsedArgs, ISimplifiedMessage } from '../../typings'
import { MessageType, Mimetype } from "@adiwajshing/baileys";
export default class Command extends BaseCommand {
	constructor(client: WAClient, handler: MessageHandler) {
		super(client, handler, {
			command: "help",
			description:
				"Displays the help menu or shows the info of the command provided",
			category: "general",
			usage: `${client.config.prefix}help (command_name)`,
			aliases: ['h', 'menu', 'lord', 'boyka'],
			baseXp: 30,
		});
	}

	run = async (
		M: ISimplifiedMessage,
		parsedArgs: IParsedArgs
	): Promise<void> => {
		const user = M.sender.jid;
		const chitoge =
			"https://telegra.ph/file/1f8cc7abab89035d65c20.mp4";
		if (!parsedArgs.joined) {
			const commands = this.handler.commands.keys();
			const categories: { [key: string]: ICommand[] } = {};
			for (const command of commands) {
				const info = this.handler.commands.get(command);
				if (!command) continue;
				if (!info?.config?.category || info.config.category === "dev") continue;
				if (
					!info?.config?.category ||
					(info.config.category === "nsfw" &&
						!(await this.client.getGroupData(M.from)).nsfw)
				)
					continue;
				if (Object.keys(categories).includes(info.config.category))
					categories[info.config.category].push(info);
				else {
					categories[info.config.category] = [];
					categories[info.config.category].push(info);
				}
			}
			let text = `ππ» (πΈοΈΟπΈοΈ) Konichiwa! *@${
				user.split("@")[0]
			}*, I'm πYuri Boyka  A Whatsapp Bot Build to make your WhatsApp enyoyable.\n\nMy prefix is - "${
				this.client.config.prefix
			}"\n\nβββ°My  Command Listβ±ββ.\n\n`;
			const keys = Object.keys(categories);
			for (const key of keys)
				text += `*βββ°π${this.client.util.capitalize(
					key
				)}πβ±ββ*\nβ \`\`\`${categories[key]
					.map((command) => command.config?.command)
					.join(" , ")}\`\`\`\n\n`;
			return void this.client.sendMessage(
				M.from,
				{ url: chitoge },
				MessageType.video,
				{
					quoted: M.WAMessage,
					mimetype: Mimetype.gif,
					caption: `${text}*β­βγ WwE γ*

*ββ User:* *${M.sender.username}*

*ββ Prefix: #*

*ββ Name: Yuri Boyka*

*ββ Owner: use #mods*

*β°ββββββββββΫͺΫͺΰ½΄ΰ½»βΈ*

*βΒ»[Κα΄α΄ α΄ Ι’Κα΄α΄α΄ α΄α΄Κ]Β«β*
π *Note: Use ${this.client.config.prefix}help <command_name> to view the command info*`,
					contextInfo: { mentionedJid: [user] },
				}
			);
		}
		const key = parsedArgs.joined.toLowerCase();
		const command =
			this.handler.commands.get(key) || this.handler.aliases.get(key);
		if (!command) return void M.reply(`No Command of Alias Found | "${key}"`);
		const state = await this.client.DB.disabledcommands.findOne({
			command: command.config.command,
		});
		M.reply(
			`π *Command:* ${this.client.util.capitalize(
				command.config?.command
			)}\nπ *Status:* ${
				state ? "Disabled" : "Available"
			}\nβ© *Category:* ${this.client.util.capitalize(
				command.config?.category || ""
			)}${
				command.config.aliases
					? `\nβ¦οΈ *Aliases:* ${command.config.aliases
							.map(this.client.util.capitalize)
							.join(", ")}`
					: ""
			}\nπ *Group Only:* ${this.client.util.capitalize(
				JSON.stringify(!command.config.dm ?? true)
			)}\nπ *Usage:* ${command.config?.usage || ""}\n\nπ *Description:* ${
				command.config?.description || ""
			}`
		);
	};
}
