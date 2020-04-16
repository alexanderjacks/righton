import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Crypto {
  readonly id: string;
  readonly color1: string;
  readonly color2: string;
  readonly title?: string;
  constructor(init: ModelInit<Crypto>);
  static copyOf(source: Crypto, mutator: (draft: MutableModel<Crypto>) => MutableModel<Crypto> | void): Crypto;
}