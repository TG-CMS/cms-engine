import {Context, DB_MATERIALS,log,TgSdk} from "@tgcms/util";
import * as fse from 'fs-extra';
import * as path from "path";

export default async function (type,options){
  const context=new Context({
    command:'generate',
    commandArgs:options,
  });
  const {host}=options||{}
  await context.loadPackage();
  const distFilepath = path.join(context.rootDir, DB_MATERIALS);
  const isGenerate=await fse.pathExists(DB_MATERIALS);
  if (!isGenerate){
    log.error('error', `请先生成物料数据`);
    return
  }
  const data = await fse.readJson(distFilepath);
  const cmsSdk=new TgSdk({
    host:host||'http://127.0.0.1:3000',
  });
  try {
    console.log();
    await cmsSdk.syncMaterials(data)
    console.log();
    log.info('Sync:', '物料上传完成，可以在 TGCMS 中添加自定义物料使用啦！');
  }catch (err) {
    log.error('error', `${err.message}`);
    throw err;
  }



}
