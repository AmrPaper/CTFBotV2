import { Message, EmbedBuilder } from "discord.js";

const challengeSetIndex = import("../../../config/index.json", {assert: {type: "json"}});
type Fields = {
        name: string;
        value: string;
        inline: boolean;
    }[]

export async function browseLibrary(msg: Message): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    const user = await msg.guild.members.fetch(msg.author.id)
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to use library commands.");
        return console.log(`User ${user.displayName} does not have permission to use the library commands.`);
    }
    const fields: Fields = []
    const challengeLibrary = (await challengeSetIndex).default.sets;
    challengeLibrary.forEach((challenge) => {
        fields.push({
            "name": challenge.name,
            "value": challenge.description,
            inline: false
        })
    })

    const challengeLibraryMessage = new EmbedBuilder()
    .setTitle("Challenge Set Library")
    .setDescription("A list of all currently available challenge sets.")
    .setColor("#0099ff")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields(
        {name: "\u200B", value: "\u200B"},// the \u200B values here are used to form a spacer between the description and the fields.
        ...fields);

    msg.reply({embeds: [challengeLibraryMessage]});
}