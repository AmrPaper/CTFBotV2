import { Message, EmbedBuilder } from "discord.js";
import { Index, Fields, ChallengeSet } from "../../utils/jsonTypes.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.resolve(__dirname, "../../../config/index.json");
const indexURL = `file://${indexPath.replace(/\\/g, '/')}`;
const distIndexPath = path.resolve(__dirname, "../../../dist/config/index.json");

const {default: challengeSetIndex} = await import(indexURL, {with: {type: "json"}}) as {default: Index};

let activeSetID = challengeSetIndex.activeSetID;
const challengeLibrary = challengeSetIndex.sets;

function getCurrentActiveSetName(): string {
    const currentSet = challengeLibrary.find(set => set.id === activeSetID);
    return currentSet ? `${currentSet.name} (${activeSetID})` : "No active set";
}

export async function browseLibrary(msg: Message): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    const user = await msg.guild.members.fetch(msg.author.id)
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to use library commands.");
        return console.log(`User ${user.displayName} does not have permission to use library commands.`);
    }

    const fields: Fields = []
    challengeLibrary.forEach((challenge) => {
        fields.push({
            "name": `${challenge.name} (ID: ${challenge.id})`,
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
        {name: "Current Active Set", value: getCurrentActiveSetName()},
        {name: "\u200B", value: "\u200B"},// the \u200B values here are used to form a spacer between the description and the fields.
        ...fields);

    msg.reply({embeds: [challengeLibraryMessage]});
}

async function updateIndexFile(newActiveSetID: string): Promise<void> {
    try {
        const newActiveSet = challengeLibrary.find(set => set.id === newActiveSetID);

        if (!newActiveSet) {throw new Error(`Challenge set with ID ${newActiveSetID} not found`);}

        challengeSetIndex.activeSetID = newActiveSetID;
        challengeSetIndex.activeSetName = newActiveSet.name;
        await fs.writeFile(indexPath, JSON.stringify(challengeSetIndex, null, 4), "utf8");
        await fs.writeFile(distIndexPath, JSON.stringify(challengeSetIndex, null, 4), "utf8");
        console.log(`Successfully updated index.json with new active set ID: ${newActiveSetID}`);
    } catch (error) {
        console.error("Failed to update index.json", error);
        throw new Error("Failed to save challenge set selection.");
    }
}

export async function selectChallengeSet(msg: Message, args: string[]): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    const user = await msg.guild.members.fetch(msg.author.id)
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to use library commands.");
        return console.log(`User ${user.displayName} does not have permission to use library commands.`);
    }

    const selectedID = args[0];

    if (!selectedID) {
        msg.reply("Please provide a challenge set ID.");
        return console.log("User didn't provide a challenge set ID.");
    }

    const selectedSet = challengeLibrary.find(set => set.id === selectedID);

    if (!selectedSet) {
        const availableIDs = challengeLibrary.map(set => set.id).join(", ");
        msg.reply(`Invalid challenge set ID. Available IDs: ${availableIDs}`);
        return console.log("User attempted to select an unavailable challenge set.");
    } 
    
    if (selectedID === activeSetID) {
        msg.reply("This challenge set is already active.");
        return console.log("User attempted to select the currently active challenge set.");
    }

    try {
        activeSetID = selectedID;
        await updateIndexFile(activeSetID);
        msg.reply(`You've now selected ${selectedSet.name} as the active challenge set, all player progress will be reset.`);
        // ADD PLAYER PROGRESS RESET HERE
        //
        //
        //
        console.log(`Challenge set changed to: ${selectedSet.name} (ID: ${activeSetID})`);
    } catch (error) {
        activeSetID = challengeSetIndex.activeSetID;
        msg.reply("An error occurred, failed to save the challenge set selection.");
        console.error("Error updating challenge set:", error);
    }
}

export async function grabChallengeSet(): Promise<ChallengeSet> {
    const activeSet = challengeLibrary.find((challenge) => challenge.id === activeSetID);

    if (!activeSet) {
        throw new Error(`Challenge set with ID ${activeSetID} not found`);
    }

    const projectRootDir = path.resolve(__dirname, "../../../");
    const challengeSetPath = path.resolve(projectRootDir, activeSet.path);

    try {
        const fileURL = `file://${challengeSetPath.replace(/\\/g, '/')}`;
        const {default: challengeContent} = await import(fileURL, {with: {type: "json"}}) as {default: ChallengeSet};
        return challengeContent;
    } catch (error) {
        console.error(`Failed to load challenge set from ${challengeSetPath}:`, error);
        throw new Error(`Failed to load challenge set: ${activeSet.name}`)
    }
}