import {Client, IntentsBitField, ActivityType} from "discord.js";
import messageHandling from "./CommandManager.js";
import { config } from "dotenv";

config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent
    ],
});

client.on("clientReady", (c) => {
    console.log(`${c.user.tag} is now online!`);
    c.user.setActivity({
        name: "الليلة بالليل 🌙",
        type: ActivityType.Listening
    });
});

(async () => {
    try {
        client.on("messageCreate", messageHandling);
        client.login(process.env.BOT_TOKEN);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();