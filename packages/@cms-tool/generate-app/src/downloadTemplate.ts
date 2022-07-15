import * as fse from 'fs-extra';
import {downTarball} from './npmTarball'
export async function DownloadTemplate(projectDir: string, npmName: string){
  const isDownLoad=await fse.pathExists(projectDir);
  if (isDownLoad)return;
  await fse.emptyDir(projectDir);
  await downTarball({
    projectDir,
    npmName,
  });
}
