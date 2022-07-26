import {viteLibBuild} from '@tgcms/vite-service';
import {Context} from '@tgcms/util';
import * as glob from "glob";
import * as path from "path";
import * as pMap from "p-map";
export function globMaterial(rootDir,materialType){
  return new Promise((resolve, reject) => {
    glob(
      `${materialType}s/*/`,
      {
        cwd: rootDir,
        nodir: false,
      },
      (err, files) => {
        if (err) {
          reject(err);
        } else {
          const data = files.map((item) => {
            return {
              pkgPath: path.join(rootDir, item),
              materialType,
            };
          });
          resolve(data);
        }
      },
    );
  });
};
export default async (type,options)=>{
  const context=new Context({
    command:'build',
    commandArgs:options,
  });
  if (!type){
    await context.run();
    if (context.entry){
      return  await viteLibBuild(context);
    }
  };
  const maper=async (item)=>{
    const dirContext=new Context({
      command:'build',
      commandArgs:options,
      rootDir:item.pkgPath,
    });
    await dirContext.run();
    await viteLibBuild(dirContext);
  };
  const MaterialMaper=async (type)=>{
    return await globMaterial(context.rootDir,type);
  }
  const types=['block','component',"package"]
  if (types.includes(type)){
    const blockDirs= await globMaterial(context.rootDir,type);
    await pMap(blockDirs as [],maper,{concurrency:3});
    return
  };
  let allDir=await pMap(types,MaterialMaper,{concurrency:3});
  await pMap(allDir.flat(2),maper,{concurrency:3});


}
