import { Adapter } from "../adapters/adapter";
import Workflow from "../workflow/workflow";
import { Icmd } from "./icmd";
import Adapters from "../adapters";
import redaxios from '../libs/redaxios'

export default class Translate implements Icmd {
    configs: { key: string, secret: string, platform: string };
    constructor(configs: any) {
        this.configs = configs;
    }
    public async execute(query: string): Promise<any> {
        const key = this.configs.key;
        const secret = this.configs.secret
        const platform = this.configs.platform
        return new Translator(key, secret, platform).translate(query);
    }
}

interface ITranslator {
    adapter: Adapter;
    translate: (word: string) => Promise<any>;
}

class Translator implements ITranslator {

    adapter: Adapter;

    constructor(key: string, secret: string, platform: string) {
        this.adapter = new Adapters[platform](key, secret);
    }

    public async translate(query: string): Promise<any> {
        // camel case to space case
        const word = query.replace(/([A-Z])/g, ' $1').toLowerCase();
        // url
        const url = this.adapter.url(word);
        // fetch
        const response = await redaxios.create().get(url);
        // parse
        const result = this.adapter.parse(response.data);
        // compose
        return new Workflow().compose(result).output();
    }
}