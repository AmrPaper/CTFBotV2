import { ColorResolvable, EmbedBuilder, Message, resolveColor } from "discord.js";
import { getState } from "../../utils/lockState.js";
import { grabChallengeSet } from "../admin/challengeSet.js";

// const challengeContent = await import("../../../challenge_sets/etti.json", {assert: {type: "json"}});

async function phase(msg: Message, args: string[]): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    let eventLocked = getState();
    if (eventLocked) {
        msg.reply("The CTF phases are currently locked, please wait until an admin unlocks the challenges.");
        return console.log("User attempted to begin play.");
    }

    try {
        const challengeContent = await grabChallengeSet();
        if (!challengeContent) {
            throw new Error(`grabChallengeSet function has failed`);
        }

        let requestedPhase: number = Number(args[0]);
        if (requestedPhase>challengeContent.phases.length - 1) {
            msg.reply("Phase Unavailable, please try again");
            return console.log("User requested a non-existent phase");
        }
        let phaseContent = challengeContent.phases[requestedPhase];
        const challengeTxt = new EmbedBuilder()
        .setTitle(phaseContent.name)
        .setDescription(phaseContent.description)
        .setColor(resolveColor(phaseContent.color as ColorResolvable))
        .setFooter({text: "Powered by Paper 🧻",})
        .addFields({
            name: "Data",
            value: phaseContent.challengeText
        },{
            name: "Available Evidence",
            value: phaseContent.files[0]
        });

        msg.reply({embeds: [challengeTxt]});
    } catch (error) {
        console.error("Failed to load challenge set:", error);
        msg.reply("Error loading challenge data. Please contact an administrator.");
    }
}

export default phase;