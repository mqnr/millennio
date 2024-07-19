import { StateManager } from './state_manager';

export type Secrets = {
  botToken: string;
  canvasToken603: string;
  canvasToken604: string;
};

export class ConfigManager {
  public readonly secrets: Secrets;
  public readonly bot: any;
  public readonly school: any;

  constructor() {
    this.secrets = {
      botToken: process.env.BOT_TOKEN,
      canvasToken603: process.env.CANVAS_TOKEN_603,
      canvasToken604: process.env.CANVAS_TOKEN_604,
    };
    const botManager = new StateManager('../config/bot.json');
    const schoolManager = new StateManager('../config/school.json');
    this.bot = botManager.readSync();
    this.school = schoolManager.readSync();
  }
}
