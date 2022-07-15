import * as Config from 'webpack-chain';
import devConfig from './config.dev';
import buildConfig from './config.build';
import baseConfig from './config.base';
import * as Pligins from './plugin';
export class WebpackConfig{
  private config =  new Config();
  private mode:string
  constructor(mode:string='development') {
    this.mode=mode;
    this.init();
  }
  init(){
    baseConfig(this.config);
    if (this.mode==='development'){
      devConfig(this.config);
    }else {
      buildConfig(this.config);
    }
    Object.keys(Pligins).map((item)=>{
      if (Pligins[item]){
        Pligins[item]?.(this.config);
      }
    })
  }
   get getConfig():Config{
    return  this.config;
   }
}
export * from './plugin';
