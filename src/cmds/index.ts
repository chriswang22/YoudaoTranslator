import { Icmd } from "./icmd";
import Translate from "./translate";
import Anki from "./anki";

export default function command(type: string, configs: {}): Icmd {
  const cmdMap = {
    'translate': Translate,
    'anki': Anki,
  };
  if (cmdMap[type]) {
    return new cmdMap[type](configs);
  }
  return new Translate(configs);
}