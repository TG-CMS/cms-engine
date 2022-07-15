import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs-extra';
import {parseNpmName} from './name.util'
export type CommandName = 'start' | 'build' | 'sync'| 'generate'|'add';
export interface IArgs<T> {
  [name: string]: T;
};
export type CommandArgs = IArgs<any>;
export type ContextOptions={
  command:CommandName,
  commandArgs:CommandArgs,
  rootDir?:string,
};

export class Context {
  public options:ContextOptions;
  public command: CommandName;
  public commandArgs: CommandArgs;
  public rootDir: string;
  public sourceDir:string;
  public entry:string;
  public public:string;
  public packageJson:Record<string,any>;
  constructor(options: ContextOptions) {
    const {
      command,
      rootDir = path.join(process.cwd(), '.'),
      commandArgs,
    } = options || {};
    this.options = options;
    this.command = command;
    this.commandArgs = commandArgs;
    this.rootDir = rootDir;
    this.sourceDir=path.join(rootDir,'src');
    this.public=path.join(rootDir,'public');

  }
  getEntry(){
    const filesPath = glob.sync('*.*', { cwd: this.sourceDir, ignore: ['node_modules/**','*.less','*.css', '*.d.ts', '*.?(ali|wechat).?(ts|tsx|js|jsx)'] });
    let entry='';
    filesPath.forEach((item)=>{
      if (item.includes('index')){
        entry=item;
        return;
      }
      if (item.includes('main')){
        entry=item;
      }
    });
    if (!entry){
      throw new Error('no found entry');
    }
    this.entry=path.join(this.sourceDir,entry);
  }
 public async hasPublic(){
   return await fs.pathExists(this.public);
  }
  async  loadPackage(){
    const jsonPath=path.join(this.rootDir,'package.json')
    const isFile=await fs.pathExists(jsonPath);
    if (!isFile){
      throw new Error('no found package.json');
    };
    this.packageJson=await fs.readJSON(jsonPath);
  }
  public get npmName():string{
    return  this.packageJson.name||'';
  }

  public get componentName():string{
    const npmName = this.packageJson.name;
    return  parseNpmName(npmName);

  }

  async run(){
    await this.getEntry();
    await  this.loadPackage();
  }
}
