import {Context} from '@tgcms/util';
import {ViteService} from '@tgcms/vite-service';
export default async function start(options){
 const context=new Context({
   command:'start',
   commandArgs:options,
 });
 await context.run();
 const service=await ViteService(context);
 process.on('exit',()=>{
   service.close();
 })
}
