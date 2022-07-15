import {Context, log, parseNpmName,camelCase} from "@tgcms/util";
import * as inquirer from 'inquirer';
import * as path from "path";
import * as fse from "fs-extra";
import {formatScaffoldToProject} from "./formatScaffoldToProject";
interface TemplateOptions {
  materialType:string;
  npmName:string;
  version?:string;
  name?:string;
  description?:string,
  npmScope?:string;
  kebabCaseName?:string;
  className?:string
}
export interface GenerateOption {
  templateOptions:TemplateOptions;
  materialTemplateDir:string
};

export async function addBlockToProject(context:Context,option:GenerateOption){
  const {rootDir}=context;
  const {templateOptions,materialTemplateDir}=option;
  const {materialType,npmName,name}=templateOptions;
  let blockDirName=name;
  if (!blockDirName){
    const parsename = npmName.split('/')[1] || npmName.split('/')[0];
    blockDirName = camelCase(parsename, { pascalCase: true });
  }
  const projectName=parseNpmName(npmName);
  const projectDir=path.join(rootDir,`${materialType}s`,blockDirName);
  const empty = await fse.pathExists(projectDir);
  if (empty) {
    const { go } = await inquirer.prompt({
      type: 'confirm',
      name: 'go',
      message:
        'The existing file in the current directory. Are you sure to continue ？',
      default: false,
    });
    if (!go) process.exit(1);
  };
  log.info('AddBlock', 'create block directory……');
  await fse.ensureDir(projectDir);
  const blockSourceSrcPath=path.join(materialTemplateDir,'template');
  const blockDirPath=path.join(projectDir);
  await fse.ensureDir(blockDirPath);
  await fse.copy(blockSourceSrcPath, blockDirPath, {
    overwrite: true,
    errorOnExist: true,
  });
  await formatScaffoldToProject(blockDirPath,templateOptions)
  await fse.remove(materialTemplateDir);
  log.info('add block success, you can import and use block in your page code', blockDirPath);
};
