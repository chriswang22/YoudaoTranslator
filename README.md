# YoudaoTranslate | 有道翻译

基于[YoudaoTranslate | 有道翻译](https://github.com/wensonsmith/YoudaoTranslator) 加入anki单词同步

### 更新说明

新增了同步[anki](https://ankiweb.net/about) 词汇的功能

同步Anki生词本 -  `ctrl` + `↩︎ Enter` 翻译结果同步到anki生词本

可以在变量中配置 deckName 和 modelName

模板中有以下字段可以根据需要再Card中自行配置

```
{
    "English": word,
    "Chinese": translationStr,
    "explain": explain,
    "webTranslate": webTransList,
    "phonetic": phonetic,
    "Audio": `[sound:youdao_${word}.mp3]`
}
```

### 代码运行

```
nvm use v16.11.1
npm install --force
## 打包
npm run build
## 测试翻译
npm run buildtest  'hello'
## 测试anki
npm run buildtest anki 'hello'
```
