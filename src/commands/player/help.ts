import { EmbedBuilder, Message } from "discord.js";

function help(msg: Message) {
    const cmdList = new EmbedBuilder()
    .setTitle("Help!")
    .setDescription("A list of all currently available commands.")
    .setColor("#0099ff")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "$welcome",
        value: "Provides you with a welcome message that contains the outlines of the event.",
        inline: false,
    },{
        name: "$join",
        value: "Registers you into the event\nNote: Be sure to run this command before doing anything else!!!",
        inline: false,
    },{
        name: "$leave",
        value: "Removes you from the event.\nNote: All progress will be lost and cannot be recovered.",
        inline: false,
    },{
        name: "$reset",
        value: "Resets your event progress.\nNote: This command cannot be used while in a team.",
        inline: false,
    },{
        name: "$phase",
        value: "Provides you with the challenge content for the specified phase.\nUsage: $phase <x>\nReplace <x> with the number for the phase you'd like to access.",
        inline: false,
    },{
        name: "$submit",
        value: "Allows you to submit your flag.\nUsage: $submit <flag>\nReplace <flag> with the flag you'd like to submit.",
        inline: false,
    });

    msg.reply({embeds: [cmdList]});
}

export default help;