import { Message, EmbedBuilder } from "discord.js";

function welcome(msg: Message) {
    const welcomeMessage = new EmbedBuilder()
    .setTitle("Welcome!")
    .setDescription("Welcome the first PaperCTF brought to you by ISS-SUDAN\n Please do try to be respectful throughtout the event and stick to the guidelines outlined below!")
    .setColor("#0099ff")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "CTF Guidelines",
        value: `**1.** Participate in the designated channels for general discussions and challenge-specific discussions.\n
        **2.** Submit flags in the correct format (that being PaperCTF={flag-text-here}).\n
        **3.** Respect Others' Progress. Communication is allowed between players though please avoid spoilers and don't share explicit solutions with others.\n
        **4.** Research on the go! You're allowed to google anything and everything you want, using AI tools is prohibited.\n
        **5.** Take it as an opportunity to learn something exciting though there is no harm in competition. Have fun!\n`,
        inline: false,
    },{
        name:"Need Help?",
        value:"You can always run the $help command for a list of all the available commands that Quigga is equipped with, though if you encounter any problems throughout your play or hit a wall, don't hesitate to contact any of the organizers about anything!"
    });

    msg.reply({embeds: [welcomeMessage]});
};

export default welcome;