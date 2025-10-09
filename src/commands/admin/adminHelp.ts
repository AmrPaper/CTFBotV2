import { EmbedBuilder, Message } from "discord.js";

async function adminHelp(msg: Message) {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}
        
    const user = await msg.guild.members.fetch(msg.author.id);
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to update the event's state.");
        return console.log(`User ${user.displayName} does not have permission to use the Unlock command.`);
    }

    const cmdList = new EmbedBuilder()
    .setTitle("Help!")
    .setDescription("A list of all the currently available admin commands.")
    .setColor("#0099ff")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "$browse",
        value: "Lists all the available challenge sets.",
        inline: false,
    },{
        name: "$select",
        value: "Allows you to select a challenge set.\nUsage: $select <ID>\nReplace <ID> with the challenge set ID found in the challenge set list provided by the $browse command.",
        inline: false,
    },{
        name: "$lock",
        value: "Allows you to lock your desired phases.\nUsage:\nCase 1: $lock <x>\nCase 2: $lock <x> <y>\nReplace <x> and <y> with the desired phase numbers, the command can be used to lock one or more phases at once but it will not work if one of the selected phases does not exist within the currently active challenge set.",
        inline: false,
    },{
        name: "$unlock",
        value: "Allows you to unlock your desired phases.\nUsage:\nCase 1: $unlock <x>\nCase 2: $unlock <x> <y>\nReplace <x> and <y> with the desired phase numbers, the command can be used to unlock one or more phases at once but it will not work if one of the selected phases does not exist within the currently active challenge set.",
        inline: false,
    },{
        name: "$leaderboard",
        value: "Displays a leaderboard with the top 5 Players/Teams sorted by Phase and Playtime.",
        inline: false,
    },{
        name: "$pause",
        value: "Pauses the event.",
        inline: false,
    },{
        name: "$resume",
        value: "Resumes the event.",
        inline: false,
    },{
        name: "$syncteams",
        value: "Syncs all of the registered teams progress within the database (sanity command, use if any players are having trouble accessing phases or submitting flags)",
        inline: false,
    },{
        name: "/initialise",
        value: "Initialises the event by setting up the Player and Organizer roles.",
        inline: false,
    },{
        name: "/register-team",
        value: "Register a team in the database, also creates a role and dedicated channel for the team.",
        inline: false,
    },{
        name: "/delete-team",
        value: "Deletes the mentioned team from the event.",
        inline: false,
    },{
        name: "/add-player-to-team",
        value: "Adds mentioned players to a selected team.",
        inline: false,
    },{
        name: "/remove-player-from-team",
        value: "Remove the mentioned player from their team.",
        inline: false,
    },{
        name: "/force-register-player",
        value: "Registers a player selected player into the event.",
        inline: false,
    },{
        name: "/force-remove-player",
        value: "Removes the mentioned player from the event.",
        inline: false,
    });

    msg.reply({embeds: [cmdList]});
}

export default adminHelp;