import { StateManager } from './state_manager';

export type Secrets = {
  botToken: string;
  canvasTokenRemovedgroup1: string;
  canvasTokenRemovedgroup2: string;
};

export class ConfigManager {
  public readonly secrets: Secrets;
  public readonly bot: any;
  public readonly school: any;

  constructor() {
    this.secrets = {
      botToken: process.env.BOT_TOKEN,
      canvasTokenRemovedgroup1: process.env.CANVAS_TOKEN_REMOVEDGROUP1,
      canvasTokenRemovedgroup2: process.env.CANVAS_TOKEN_REMOVEDGROUP2,
    };
    const botManager = new StateManager('../config/bot.json');
    const schoolManager = new StateManager('../config/school.json');
    this.bot = botManager.readSync();
    this.school = schoolManager.readSync();
  }
}
