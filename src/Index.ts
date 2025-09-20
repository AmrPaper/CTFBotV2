import {Client, IntentsBitField, ActivityType} from "discord.js";
import mongoose from "mongoose";
import messageHandling from "./prefixedCommandManager.js";
import { config } from "dotenv";
import { handleSlashCommands, registerSlashCommands } from "./slashCommandManager.js";

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

client.on("clientReady", async (c) => {
    console.log(`${c.user.tag} is now online!`);
    c.user.setActivity({
        name: "الليلة بالليل 🌙",
        type: ActivityType.Listening
    });

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MongoDB uri is undefined, please revise the env file.");
        process.exit(1);
    }
    try {
        await mongoose.connect(uri);
        console.log("Successfully connected to mongoDB.");
    } catch (error) {
        console.error("Failed to connect to mongoDB");
        process.exit(1);
    }

    await registerSlashCommands();
});

(async () => {
    try {
        client.on("messageCreate", messageHandling);
        client.on("interactionCreate", async (interaction) => {
            if (interaction.isChatInputCommand()) {
                await handleSlashCommands(interaction);
            }
        });

        const token = process.env.BOT_TOKEN;
        if (!token) {
            console.error("Discord bot token is undefined, please revise the env file.");
            process.exit(1);
        }

        client.login(token);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();