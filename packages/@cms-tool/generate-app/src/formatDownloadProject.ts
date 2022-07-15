import {formatScaffoldToProject} from "./formatScaffoldToProject";
import {downTarball} from './npmTarball';
export interface DownloadProject{
  npmName: string
  projectDir: string,
  version?: string,
  projectName:string,
  ejsOptions?:{
    [key:string]:any
  }
}

export  async function downloadProject({npmName,projectDir,version,projectName,ejsOptions={}}:DownloadProject){
    await downTarball({
      projectDir,
      npmName,
      version,
    })
  try {
    await formatScaffoldToProject(projectDir, ejsOptions);
  }catch (e) {
    console.warn('format scaffold to project error', e.message);
  }

}
