export interface Icmd {
  configs: {};
  execute: (query: string) => Promise<any>;
}

