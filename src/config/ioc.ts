import { Container as InversifyContainer } from 'inversify';
import { AppConfig } from "./app-config";

export class Container {
  private static instance: InversifyContainer;

  static getInstance(): InversifyContainer {
    if (this.instance) {
      return this.instance;
    }

    const container = new Container();

    container.init();

    this.instance = container.inversifyContainer;

    return this.instance;
  }

  private readonly inversifyContainer: InversifyContainer;

  constructor() {
    this.inversifyContainer = new InversifyContainer({
      defaultScope: "Singleton",
    });
  }

  private init() {
    this.inversifyContainer.bind(AppConfig).toDynamicValue(() => AppConfig.load()).inSingletonScope();
  }
}
