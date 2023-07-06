import { Icmd } from "./icmd";
import redaxios from '../libs/redaxios'
import Translator from "../translator";
import md5 from "../libs/md5";
export default class Anki implements Icmd {
    configs: { key: string, secret: string, platform: string };
    constructor(configs: any) {
        this.configs = configs;
    }
    public async execute(query: string): Promise<any> {
        const key = this.configs.key;
        const secret = this.configs.secret
        const platform = this.configs.platform
        const response = await new Translator(key, secret, platform).translateRaw(query)
        const data = response.data
        if (data.errorCode !== "0") {
            return this.parseError(data.errorCode);
        }
        const { translation, basic, web } = data;
        const translationStr = this.parseTranslation(translation)
        const webTransList = this.parseWeb(web)
        const explain = this.parseBasic(basic);
        const phonetic = this.parsePhonetic(basic)
        const res = addNotes(query, translationStr, explain, webTransList, phonetic)
        console.log(res)
        return 'success'
    }
    private parseTranslation(translation) {
        if (translation) {
            return translation.join(";")
        }
        return ''
    }

    private parseBasic(basic: any) {
        if (basic) {
            return basic.explains?.join('<p/>')
        }
        return ''
    }

    private parseWeb(web: any) {
        if (web) {
            return web.map((item) => {
                return `${item.key}   ${item.value.join(", ")}`
            }).join("<p/>");
        }
        return ''
    }

    private parseError(code: number) {
        const messages = {
            101: "缺少必填的参数",
            102: "不支持的语言类型",
            103: "翻译文本过长",
            108: "应用ID无效",
            110: "无相关服务的有效实例",
            111: "开发者账号无效",
            112: "请求服务无效",
            113: "查询为空",
            202: "签名检验失败,检查 KEY 和 SECRET",
            401: "账户已经欠费",
            411: "访问频率受限",
        };

        const message = messages[code] || "请参考错误码：" + code;
        return message
    }

    private parsePhonetic(basic: any): string {
        let phonetic: string = '';
        if (basic["us-phonetic"]) {
            phonetic += " [美: " + basic["us-phonetic"] + "] ";
        }
        if (basic["uk-phonetic"]) {
            phonetic += " [英: " + basic["uk-phonetic"] + "]";
        }
        return phonetic;
    }

}



async function addNotes(word, translationStr, explain, webTransList, phonetic) {
    const hash = md5(`youdao_${word}.mp3`);
    return await invokeAnki({
        "action": "addNotes",
        "version": 6,
        "params": {
            "notes": [
                {
                    "deckName": "note",
                    "modelName": "note",
                    "fields": {
                        "English": word,
                        "Chinese": translationStr,
                        "explain": explain,
                        "webTranslate": webTransList,
                        "phonetic": phonetic,
                        "Audio": `[sound:youdao_${word}.mp3]`
                    },
                    "audio": [{
                        "url": `https://dict.youdao.com/dictvoice?type=1&audio=${word}`,
                        "filename": `youdao_${word}.mp3`,
                        "skipHash": hash,
                        "fields": [
                            "Front", "Back"
                        ]
                    }],
                }
            ]
        }
    });
}

async function invokeAnki(params) {
    return invoke(params.action, params.version, params.params)
}
async function invoke(action, version, params = {}) {
    // url
    const url = "http://127.0.0.1:8765";
    // fetch
    const response = await redaxios({
        method: 'post',
        url: url,
        data: { action, version, params }
    })
    return JSON.stringify(response.data.result)
}





