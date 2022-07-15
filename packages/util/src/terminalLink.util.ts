import * as terminal from 'terminal-link';
export function TerminalLink(key:string,url?:string){
  return terminal(key, url||key)
}
