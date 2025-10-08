import { Message, EmbedBuilder, ColorResolvable } from "discord.js";
import { getState, phaseCount } from "../../utils/lockState.js";
import { grabPlayerDB, syncTeamMembers, updatePlayerDB, updateTeamDB } from "../../utils/dbUtils.js";
import { grabChallengeSet } from "../admin/challengeSet.js";
import { IPlayerPopulated } from "../../models/Player.js";
import { Ending, Phase } from "../../utils/jsonTypes.js";

async function submit(msg: Message, args: string[]): Promise<void> {
    if (!msg.guild || !msg.member) {return console.log("Invalid Operation, no dms");}
    try {
        if (!args.length) {
            msg.reply("Please submit a valid flag!");
            return console.log("Args field is empty.")
        }

        const playerRoles = await msg.member.roles.cache.map(r => r.name);

        if (!playerRoles.includes("Player")) {
            msg.reply("You are not registered in the ongoing CTF, please contact one of the organisers for assistance!");
            return console.log(`An Unregistered player ${msg.author.displayName} attempted to submit a flag.`);
        }

        const player = await grabPlayerDB(msg.author.id, {populateTeam: true, logIfNotFound: false});
        if (!player) {
            throw new Error("Failed to fetch player data");
        }

        if (player.isPaused) {
            msg.reply("The event is currently paused, please try again after the break is over.");
            return;
        }

        const challengeContent = await grabChallengeSet();
        if (!challengeContent) {
            throw new Error("Failed to fetch challenge content.");
        }

        const playerPhase: number = player.currentPhase;
        if (playerPhase >= phaseCount) {
            msg.reply("You've already completed all the available phases, no more submissions will be accepted from you 😅");
            return console.log("Player already completed the event, no more submissions will be accepted from them.");
        }

        let eventLocked = getState(playerPhase);
        if (eventLocked) {
            msg.reply("The CTF phase you are currently on is locked, therefore submissions are currently unavailable. Please wait until an admin unlocks the challenge.");
            return console.log("User attempted to begin play.");
        }

        const relevantPhase = challengeContent.phases.find(phase => phase.id === playerPhase);
        if (!relevantPhase) {
            throw new Error("Failed to fetch a relevant phase.")
        }

        if (args.join(" ") !== relevantPhase.flag) {
            msg.reply("Incorrect flag, please try again 😉");
            return console.log("Player submitted an incorrect flag.");
        }   

        const phaseTime = player.phaseStartTime ? Date.now() - player.phaseStartTime : 0;
        if (playerPhase === phaseCount - 1) {
            const ending = fetchCorrectEnding(player, relevantPhase, challengeContent.endings)
            const endingMessage = new EmbedBuilder()
                .setTitle(ending.title)
                .setDescription(ending.description)
                .setColor(ending.color as ColorResolvable)
                .setFooter({text: "Powered by Paper 🧻",})
                .addFields({
                    name: "Final Outcome",
                    value: ending.message
                });

            if (!player.team) {
                const success = await updatePlayerDB(player.discordId, {currentPhase: playerPhase + 1, totalPlaytime: player.totalPlaytime + phaseTime})
                if (!success) {throw new Error("Failed to update player progress.");}
                msg.reply({embeds: [endingMessage]});
                return console.log(`${player.name} has achieved the ending: ${ending.title}`);
            } else {
                const success = await updateTeamDB(player.team.name, {currentPhase: playerPhase + 1, totalPlaytime: player.totalPlaytime + phaseTime});
                if (!success) {throw new Error("Failed to update team progress.");}
                await syncTeamMembers(player.team.name);
                msg.reply({embeds: [endingMessage]});
                return console.log(`Team ${player.team.name} has achieved the ending: ${ending.title}`)
            }
        } else if (playerPhase !== phaseCount) {
            const phaseSuccessMessage = new EmbedBuilder()
                .setTitle("Phase Passed Successfully")
                .setDescription(`You've completed phase ${relevantPhase.id}!`)
                .setColor("#FFF9FB")
                .setFooter({text: "Powered by Paper 🧻",})
                .addFields({
                    name: "Instructions",
                    value: `Enter the command $phase ${relevantPhase.id + 1} to proceed to the next phase!`
            },);

            if (!player.team) {
                const success = await updatePlayerDB(player.discordId, {currentPhase: playerPhase + 1, totalPlaytime: player.totalPlaytime + phaseTime, phaseStartTime: Date.now()});
                if (!success) {throw new Error("Failed to update player progress.");}
                msg.reply({embeds: [phaseSuccessMessage]});
                return console.log(`${player.name} has moved onto phase ${relevantPhase.id + 1}!`);
            } else {
                const success = await updateTeamDB(player.team.name, {currentPhase: playerPhase + 1, totalPlaytime: player.totalPlaytime + phaseTime, phaseStartTime: Date.now()});
                if (!success) {throw new Error("Failed to update team progress.");}
                await syncTeamMembers(player.team.name);
                msg.reply({embeds: [phaseSuccessMessage]});
                return console.log(`Team ${player.team.name} has moved onto phase ${relevantPhase.id + 1}!`)
            }
        }
    } catch (error) {
        console.error("Error occured during submission", error);
        msg.reply("An internal error occured, please contact an admin.");
    }
}

function fetchCorrectEnding(player: IPlayerPopulated, relevantPhase: Phase, endings: Ending[]): Ending {
    const currentTime = Date.now();
    const playerStartTime = player.phaseStartTime;
    const phaseTimeLimit = relevantPhase.timeLimit;
    if (!playerStartTime || !phaseTimeLimit) {
        throw new Error("Failed to fetch player start time and/or phase time limit");
    }
            
    const timeDifference = currentTime - playerStartTime;
    const elapsedMinutes = Math.floor(timeDifference / (1000 * 60));

    for (const ending of endings) {
        if (ending.condition === "LT" && elapsedMinutes < phaseTimeLimit) {
            return ending;
        }
        if (ending.condition === "GT" && elapsedMinutes >= phaseTimeLimit) {
            return ending;
        }
    }

    return endings[0]; //back up option.
}

export default submit;