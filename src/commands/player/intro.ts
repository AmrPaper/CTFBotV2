import { Message, EmbedBuilder } from "discord.js";

function intro(msg: Message) {
    const storyIntro = new EmbedBuilder()
    .setTitle("Case Brief: Missing Person - Etti Morales")
    .setDescription("Detectives,\n\nYou’ve been assigned to investigate the disappearance of Etti Morales, a 21-year-old college student who hasn't been seen for days. Etti was known to stay in her room most of the time, rarely going out. Though when a friend of her's went to visit, her room's door was unlocked, and it room was empty, and there's been no sign of her since.\n\n Her phone is off, and there's no recent activity on her social media. Friends and professors describe her as a quiet, focused student with no history of trouble.\n\n Your first step is to investigate her dorm room and belongings. As of now, this appears to be a routine missing person’s case, but be thorough—details can easily be overlooked.\n Good luck, Detectives.")
    .setColor("#0099ff")
    .setFooter({text: "Powered by Paper 🧻",});

    msg.reply({embeds: [storyIntro]});
};