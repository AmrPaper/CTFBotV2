import { Message } from "discord.js";

async function init(msg: Message): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    const user = await msg.guild.members.fetch(msg.author.id);
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to initialise the event.");
        return console.log(`User ${user.displayName} does not have permission to use the Init command.`);
    }

    try {
        const Player = await msg.guild.roles.create({
            name: 'Player',
            color: '#c3b058',
            mentionable: true
        });

        const Organizer = await msg.guild.roles.create({
            name: 'Organiser',
            color: '#8cefae',
            mentionable: true,
            position: Player.position + 1
        });

        msg.react('👍');
        msg.reply('Player and Organizer roles created successfully!');
    } catch (error) {
        console.log(`Error: ${error}`);
        msg.reply("There was an error creating the roles, please try again.");
    }
}

export default init;