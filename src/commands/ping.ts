import { SlashCommandBuilder } from '@discordjs/builders';
import { Embedder } from '../lib/core/embedder';
import { MillennioCommand } from '../lib/core/command';
import { ConfigManager } from '../util/config_manager';
import { MillennioTitle } from '../lib/core/title';

const config = new ConfigManager();

const cmdData = new SlashCommandBuilder()
  .setName('ping')
  .setDescription(`Tells you about ${config.bot.name_possessive} connection.`)
  .addBooleanOption((option) =>
    option
      .setName('invisible')
      .setDescription(
        `Only you will see ${config.bot.name_possessive} response if you set this to true.`
      )
  );

const cmdExecuter = async (i) => {
  const invisible: boolean = !!i.options.getBoolean('invisible');
  const title = new MillennioTitle(i);
  const embedder = new Embedder(i.user);

  const embedInitial = embedder.embed(title.response, 'Wait a moment!');

  await i.reply({ embeds: [embedInitial], ephemeral: invisible });
  const message = await i.fetchReply();

  const embedFinal = embedder.embed(
    title.response,
    `**♥:** ${i.client.ws.ping}ms\n` +
      `**Latency**: ${message.createdTimestamp - i.createdTimestamp}ms`
  );

  return i.editReply({ embeds: [embedFinal] });
};

export const cmd = new MillennioCommand(cmdData, cmdExecuter);
