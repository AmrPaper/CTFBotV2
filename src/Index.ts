import {Client, IntentsBitField, ActivityType} from "discord.js";

const prefix = "$";

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent
    ],
});

client.on("ready", (c) => {
    console.log(`${c.user.tag} is now online!`);
    c.user.setActivity({
        name: "الليلة بالليل 🌙",
        type: ActivityType.Listening
    });
});

(async () => {
    try {
        client.login(process.env.BOT_TOKEN);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();