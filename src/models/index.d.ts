import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Crypto {
  readonly id: string;
  readonly title: string;
  readonly color?: string;
  readonly price?: number;
  constructor(init: ModelInit<Crypto>);
  static copyOf(source: Crypto, mutator: (draft: MutableModel<Crypto>) => MutableModel<Crypto> | void): Crypto;
}