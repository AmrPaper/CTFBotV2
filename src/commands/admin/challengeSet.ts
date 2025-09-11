import { Message, EmbedBuilder } from "discord.js";

const challengeSetIndex = import("../../../config/index.json", {assert: {type: "json"}});
type Fields = {
        name: string;
        value: string;
        inline: boolean;
    }[]

let activeSetID = (await challengeSetIndex).default.activeSetID;
let availableSets = (await challengeSetIndex).default.availableSets;

export async function browseLibrary(msg: Message): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    const user = await msg.guild.members.fetch(msg.author.id)
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to use library commands.");
        return console.log(`User ${user.displayName} does not have permission to use library commands.`);
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
        {name: "Current Active Set", value: challengeLibrary[activeSetID].name},
        {name: "\u200B", value: "\u200B"},// the \u200B values here are used to form a spacer between the description and the fields.
        ...fields);

    msg.reply({embeds: [challengeLibraryMessage]});
}

export async function selectChallengeSet(msg: Message, args: string[]): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    const user = await msg.guild.members.fetch(msg.author.id)
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to use library commands.");
        return console.log(`User ${user.displayName} does not have permission to use library commands.`);
    }

    if (Number(args[0])>availableSets) {
        msg.reply("Please select a valid challenge set.");
        return console.log("User attempted to select an unavailable challenge set.")
    } else if (Number(args[0]) == (activeSetID+1)) {
        msg.reply("This challenge set is already active.");
        return console.log("User attempted to select the currently active challenge set.")
    }

    activeSetID = Number(args[0])-1;
    let newChallengeSetName = (await challengeSetIndex).default.sets[activeSetID].name;
    msg.reply(`You've now selected ${newChallengeSetName} as the active challenge set, all player progress will be reset.`)
}