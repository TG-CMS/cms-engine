import {viteLibBuild} from '@tgcms/vite-service';
import {Context} from '@tgcms/util';
export default async (type,options)=>{
  const context=new Context({
    command:'build',
    commandArgs:options,
  });
  await context.run();
  await viteLibBuild(context)
}
