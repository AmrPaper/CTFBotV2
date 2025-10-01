import type { Message } from "discord.js";
import phase from "./commands/player/phase.js";
import { lock, unlock } from "./commands/admin/flowControl.js"
import { browseLibrary, selectChallengeSet } from "./commands/admin/challengeSet.js";
import join from "./commands/player/join.js";
import resetProgress from "./commands/player/reset.js";
import leave from "./commands/player/leave.js";
import submit from "./commands/player/submit.js";
import leaderboard from "./commands/admin/leaderboard.js";
import pauseEvent from "./commands/admin/pauseEvent.js";
import resumeEvent from "./commands/admin/resumeEvent.js";

const prefix = "$";

type commandHandler = (msg: Message, args: string[]) => void | Promise<void>;

const commandHandlers: Record<string, commandHandler> = {
    "phase": phase,
    "submit": submit,
    "lock": lock,
    "unlock": unlock,
    "browse": browseLibrary,
    "select": selectChallengeSet,
    "join": join,
    "leave": leave,
    "reset": resetProgress,
    "leaderboard": leaderboard,
    "pause": pauseEvent,
    "resume": resumeEvent,
    "blip": async (msg) => {
        if (!msg.guild) {return console.log("Invalid Operation, no dms");}
        const user = await msg.guild.members.fetch(msg.author.id)
        const roles = user.roles.cache.map(r => r.name);
        console.log(roles);
        msg.reply("User roles logged!");
    },
    "bloop": (msg) => {
        console.log(msg.author);
        console.log(msg.author.id)
        msg.reply("User info logged!");
    }
}

function messageHandling(msg: Message) {
    if (msg.author.bot || !msg.content.startsWith(prefix)) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();
    if (cmd == null) {return console.log("No command called!");}
    
    const handler = commandHandlers[cmd];
    if (handler) {
        handler(msg, args);
    } else {
        msg.reply("Unknown command. Type $help for a list of commands.");
    };
};

export default messageHandling;