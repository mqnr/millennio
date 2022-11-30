export class MillennioEvent {
  name: string;
  once: boolean;

  constructor(name: string, once: boolean) {
    this.name = name;
    this.once = once;
  }
}
