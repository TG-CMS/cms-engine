import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';
import {checkEmpty} from '@tgcms/util';
export async function selectTemplate(): Promise<string>{
  const templates = [
    {
      npmName: '@tgcms/materials-template',
      description: 'TypeScript + Ant Design',
    },
    {
     npmName: '@tgcms/block-template',
     description: 'TypeScript + Ant Design',
    },
    {
      npmName: '@tgcms/component-template',
      description: 'TypeScript + Ant Design',
    },
    {
      npmName: '@tgcms/scaffold-template',
      description: 'TypeScript + No UI Components',
    },
  ];
  const defaultTemplate = templates[0];

  const answer = await inquirer.prompt({
    type: 'list',
    name: 'template',
    loop: false,
    message: 'Please select a template',
    default: defaultTemplate,
    choices: templates.map(item => {
      return {
        name: item.description,
        value: item.npmName,
      };
    })
  });

  return answer.template;
}

export default async function (template,{force,...other}){
 console.log(template,force,other)
  if (!template) {
    template = await selectTemplate();
  }
  const dirPath = path.join(process.cwd(), '.');
  await fs.ensureDir(dirPath);
  const empty = await checkEmpty(dirPath);
  if (!empty) {
    const { go } = await inquirer.prompt({
      type: 'confirm',
      name: 'go',
      message:
        'The existing file in the current directory. Are you sure to continue ？',
      default: false,
    });
    if (!go) process.exit(1);
  }


}
