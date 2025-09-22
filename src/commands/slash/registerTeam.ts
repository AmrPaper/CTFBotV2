import { ChannelType, ChatInputCommandInteraction, ColorResolvable, MessageFlags } from "discord.js";
import { Team } from "../../models/Team.js";

async function registerTeam(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
        await interaction.reply({
            content: "This command can only be used within a server.",
            ephemeral: true
        });
        return;
    }

    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        
        const playerRole = interaction.guild.roles.cache.find(role => role.name === "Player");
        if (!playerRole) {
            await interaction.followUp("Failed to fetch player role for reference. Please ensure that the /initialise command has been used.");
            return;
        }


        const teamName = interaction.options.getString("teamname", true);
        const colorChoice = interaction.options.getString("color", true);
        const customHex = interaction.options.getString("customhex");

        let finalColor: ColorResolvable;

        if (colorChoice === "CUSTOM") {
            if (!customHex) {
                await interaction.followUp(
                    'You selected "Custom Color" but didn\'t provide a hex code!\n' +
                    '**Tip:** Use online color pickers like Google\'s "color picker" or coolors.co to get hex codes.\n' +
                    '**Format:** `#FF5733` (with the # symbol)'
                );
                return;
            }

            const match = customHex.match(/^#([A-Fa-f0-9]{6})$/);
            if (!match) {
                await interaction.followUp("Invalid color format, please use the following format: `#FF5733` (with the # symbol)");
                return;
            }
            finalColor = customHex as ColorResolvable;
        } else {
            finalColor = colorChoice as ColorResolvable;
        }

        const existingRole = interaction.guild.roles.cache.find(r => 
            r.name.toLowerCase() === teamName.toLowerCase()
        );
        const existingTeam = await Team.findOne({ name: teamName });

        if (existingTeam) {
            await interaction.followUp("A team with the same name already exists.");
        }
        if (existingRole) {
            await interaction.followUp("A discord role matching the team's name already exists.");
        }
        
        const teamRole = await interaction.guild.roles.create({
            name: teamName,
            colors: { primaryColor: finalColor},
            hoist: true,
            mentionable: true,
            position: playerRole.position + 1
        });

        const teamChannel = await interaction.guild.channels.create({
            name: teamName.toLowerCase().replace(/\s+/g, "-"),
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: ["ViewChannel"]
                },
                {
                    id: teamRole.id,
                    allow: ["ViewChannel", "SendMessages"]
                }
            ]
        })

        const DBTeam = await Team.create({
            name: teamName,
            members: [],
            roleID: teamRole.id,
            channelID: teamChannel.id,
            colour: finalColor,
        })

        await interaction.followUp("New team role and channel created successfully!")        
    } catch (error) {
        console.error(`Error occured during team registration:`, error);

        if (interaction.deferred) {
            await interaction.followUp("There was an error during team registration, please try again.");
        } else {
            await interaction.reply({
                content: "There was an error during team registration, please try again.",
                ephemeral: true
            });
        }
    }
}

export default registerTeam;