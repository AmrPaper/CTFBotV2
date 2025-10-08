import { ColorResolvable, EmbedBuilder, Message } from "discord.js";
import { getState } from "../../utils/lockState.js";
import { grabChallengeSet } from "../admin/challengeSet.js";
import { grabPlayerDB, syncTeamMembers, updatePlayerDB, updateTeamDB } from "../../utils/dbUtils.js";

async function phase(msg: Message, args: string[]): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    try {
        const challengeContent = await grabChallengeSet();
        if (!challengeContent) {
            throw new Error(`grabChallengeSet function has failed`);
        }

        if (!args[0] || isNaN(Number(args[0]))) {
            msg.reply("Please specify a valid phase.");
            return;
        }
        let requestedPhase: number = Number(args[0]);
        if (requestedPhase>challengeContent.phases.length - 1) {
            msg.reply("Phase Unavailable, please try again");
            return console.log("User requested a non-existent phase");
        }

        let eventLocked = getState(requestedPhase);
        if (eventLocked) {
            msg.reply("The CTF phase you have chosen is currently locked, please wait until an admin unlocks the challenge.");
            return console.log(`User has attempted to access phase ${requestedPhase}`);
        }

        const player = await grabPlayerDB(msg.author.id, {populateTeam: true, logIfNotFound: false});
        if (!player) {
            msg.reply("You are not registered in the event.");
            return console.log("User is not registered in the event.");
        }

        if (player.isPaused) {
            msg.reply("The event is currently paused, please try again after the break is over.");
            return;
        }

        let phaseContent = challengeContent.phases[requestedPhase];
        const challengeTxt = new EmbedBuilder()
        .setTitle(phaseContent.name)
        .setDescription(phaseContent.description)
        .setColor(phaseContent.color as ColorResolvable)
        .setFooter({text: "Powered by Paper 🧻",})
        .addFields({
            name: "Data",
            value: phaseContent.challengeText
        },{
            name: "Available Evidence",
            value: phaseContent.files.length > 0 ? phaseContent.files[0] : "No evidence files available"
        });

        if (player.currentPhase < requestedPhase) {
            msg.reply(`You do not yet have access to this phase. Complete Phase ${player.currentPhase} to move onto the next one.`);
            return console.log("Player attempted to fetch a future phase.");
        }

        msg.reply({embeds: [challengeTxt]});
    
    } catch (error) {
        console.error("An error has occured:", error);
        msg.reply("An internal error has occured");
    }
}

export default phase;