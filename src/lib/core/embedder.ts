import { ColorResolvable, User, MessageEmbed } from 'discord.js';
import { ConfigManager } from '../../util/config_manager';

const config = new ConfigManager();

export class Embedder {
  public username: string;
  public userAvatarUrl: string;

  constructor(user: User | string, avatarUser?: string) {
    if (!avatarUser && !(user instanceof User)) {
      throw new Error(`No avatar URL received for ${config.bot.name} embedder`);
    }

    this.username = user instanceof User ? user.tag : user;

    this.userAvatarUrl =
      avatarUser || (user as User).displayAvatarURL({ dynamic: true });
  }

  public embed(
    title: string,
    text: string,
    color: ColorResolvable = '#25bc93'
  ): MessageEmbed {
    return new MessageEmbed()
      .setColor(color)
      .setTitle(title)
      .setAuthor({ name: this.username, iconURL: this.userAvatarUrl })
      .setDescription(text)
      .setTimestamp()
      .setFooter({ text: `${config.bot.name} v${config.bot.version}` });
  }

  public paginatedEmbed(
    title: string,
    text: string,
    currentPage: number,
    totalPages: number,
    color: ColorResolvable = '#25bc93'
  ): MessageEmbed {
    return new MessageEmbed()
      .setColor(color)
      .setTitle(title)
      .setAuthor({ name: this.username, iconURL: this.userAvatarUrl })
      .setDescription(text)
      .setTimestamp()
      .setFooter({
        text: `Page ${currentPage}/${totalPages} | ${config.bot.name} v${config.bot.version}`,
      });
  }
}
