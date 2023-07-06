declare var tjs
import command from './cmds';

const main = async () => {
  const args = Array.from(tjs.args);
  const word: string = args.pop() as string;
  const type: string = args.pop() as string;
  //replace your key and secret
  const key = getenvOrDefault('key', '***')
  const secret = getenvOrDefault('secret', '***')
  const platform = getenvOrDefault('platform', '***')
  const configs = { key, secret, platform }
  const result = await command(type, configs).execute(word)
  console.log(result);
}

const getenvOrDefault = (key: string, defaultValue: string) => {
  try {
    return tjs.getenv(key);
  } catch {
    return defaultValue;
  }
}

main();