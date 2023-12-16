import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import Command from '../../structures/Command.js';
import axios from 'axios';

export default class extends Command {
  constructor(client) {
    super(client, {
      name: 'competitivo',
      description: 'Exibe informações do perfil de um jogador no modo competitivo.',
      options: [
        {
          name: 'nick',
          description: 'O nome do jogador.',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    });
  }

  async run(interaction) {
    const nick = interaction.options.getString('nick');

    try {
      const response = await axios.get(`https://www.flamemc.com.br/_next/data/RWXgROhcD2784TVAM8--L/player/${nick}.json?nick=${nick}`);
      const playerData = response.data.pageProps.player;
      const skinResponse = await axios.get(`https://visage.surgeplay.com/face/${nick}.png`, {
        headers: {
          'User-Agent': 'MyBot/1.0 (+https://mywebsite.com/bot; your_email@example.com)',
        },
      });
      const skinURL = skinResponse.request.res.responseUrl;
      const competitiveStats = playerData.realStats.competitive;

      const embed = new EmbedBuilder()
        .setAuthor({ name: `Competitivo ${nick}`, iconURL: skinURL })
        .setDescription(`\`•\` **Nick**: ${nick}.\n\`•\` **Banido**: ${playerData.banned ? 'Sim' : 'Não'}.\n# INFORMAÇÕES ⬇️\n\`•\` **Experiência**: ${competitiveStats ? competitiveStats.stats.find(stat => stat.statsMap.name === 'competitive_exp').value : 'N/A'}\n\`•\` **Vitórias**: ${competitiveStats ? competitiveStats.stats.find(stat => stat.statsMap.name === 'competitive_wins').value : 'N/A'}\n\`•\` **Kills**: ${competitiveStats ? competitiveStats.stats.find(stat => stat.statsMap.name === 'competitive_kills').value : 'N/A'}\n\`•\` **Mortes**: ${competitiveStats ? competitiveStats.stats.find(stat => stat.statsMap.name === 'competitive_deaths').value : 'N/A'}\n\`•\` **Derrotas**: ${competitiveStats ? competitiveStats.stats.find(stat => stat.statsMap.name === 'competitive_defeats').value : 'N/A'}`)
        .setThumbnail(skinURL)
        .setFooter({ text: `Desenvolvido por Awesoming`, iconURL: `https://cdn.discordapp.com/avatars/247032483193815040/9bdae387c22de3737a9cea2c8e337026.png?size=2048` })
        .setColor(process.env.COLOR)

      interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: '❌ Ocorreu um erro ao obter as informações do jogador.',
        ephemeral: true,
      });
    }
  }
}