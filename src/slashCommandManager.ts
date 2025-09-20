import { SlashCommandBuilder, REST, Routes, ChatInputCommandInteraction, Client } from "discord.js";
import { config } from "dotenv";
import initialise from "./commands/slash/initialise.js";

config();

const commands = [
    new SlashCommandBuilder()
        .setName("initialise")
        .setDescription("Initialises the event by setting up the Player and Organizer roles.")
        .setDefaultMemberPermissions("0")
        .toJSON()
]

export async function registerSlashCommands() {
    const token = process.env.BOT_TOKEN;
    const applicationID = process.env.APPLICATION_ID;
    const guildID = process.env.GUILD_ID;

    if (!token || !applicationID) {
        console.error('Missing BOT_TOKEN or CLIENT_ID in environment variables');
        return;
    }

    const rest = new REST().setToken(token);

    try {
        console.log("Currently registering slash commands");

        if (guildID) {
            await rest.put(
                Routes.applicationGuildCommands(applicationID, guildID),
                {body: commands}
            );
            console.log("Successfully registered guild slash commands");
        } else {
            await rest.put(
                Routes.applicationCommands(applicationID),
                {body: commands}
            );
            console.log("Successfully register global slash commands");
        }
    } catch (error) {
        console.error("Error during slash command registration", error);
    }
}

export async function handleSlashCommands(interaction: ChatInputCommandInteraction): Promise<void> {
    const { commandName } = interaction;

    if (commandName === "initialise") {await initialise(interaction);}
}