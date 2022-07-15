import * as inquirer from 'inquirer';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as validateName from 'validate-npm-package-name';
import {addBlockToProject,DownloadTemplate} from '@tgcms/generate-app';
import {Context,
  uppercamelcase,
  generateNpmName,
  decamelizeName,
  TEMP_PATH,
} from '@tgcms/util';

export function nameQuestion(type,npmScope,dir){
  const defaultName = `Example${uppercamelcase(type)}`;
  return {
    type: 'input',
    name: 'name',
    message: `${type} name`,
    default: defaultName,
    validate: (value) => {
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
        return `Name must be a Upper Camel Case word, e.g. Example${uppercamelcase(type)}.`;
      }
      if (fse.existsSync(path.join(dir, `${type}s`, value))) {
        return `${value} is exist, please try another name.`;
      }

      const npmName = generateNpmName(value, npmScope);
      if (!validateName(npmName).validForNewPackages) {
        return `NPM package name ${npmName} not validate, please retry`;
      }
      return true;
    },
  };
};

const COMPONENT_CATEGORIES = [
  'Table',
  'Form',
  'Chart',
  'List',
  'Modal',
  'Filter',
  'DataDisplay',
  'Information',
  'Exception',
  'Landing',
  'video',
  'Others',
];
function getQuestions(npmScope, cwd){
  const publicQuestion=[
    {
      type: 'string',
      required: true,
      name: 'version',
      message: 'version',
      default: '1.0.0',
    },
    {
      type: 'string',
      required: true,
      name: 'description',
      message: 'description',
      default: 'intro component',
      filter(value) {
        return value.trim();
      },
      validate: (value) => {
        if (!value) {
          return 'description cannot be empty';
        }
        return true;
      },
    },
  ]
  const block=[
    nameQuestion('block', npmScope, cwd),
    {
      type: 'input',
      name: 'title',
      message: 'title',
      default: 'demo component',
      validate: (value) => {
        if (!value) {
          return 'title cannot be empty';
        }
        return true;
      },
      filter(value) {
        return value.trim();
      },
    },
    ...publicQuestion,
    {
      type: 'list',
      message: 'category',
      name: 'category',
      default: 'Information',
      choices: COMPONENT_CATEGORIES,
      validate: (answer) => {
        if (answer.length < 1) {
          return 'It must be at least one';
        }
        return true;
      },
      filter: (answer) => {
        return answer;
      },
    },

  ];
  const component=[
    nameQuestion('component', npmScope, cwd),
    ...publicQuestion,
    {
      type: 'list',
      name: 'category',
      message: 'category',
      default: 'Information',
      choices: COMPONENT_CATEGORIES,
      filter: (answer) => {
        return answer;
      },
    },
  ];
  return {
    block,
    component,
  }

}


export default async function (materialType:string, npmName:string, options){
  if (materialType && ['block', 'component'].indexOf(materialType) === -1) {
    npmName = materialType;
    materialType = null;
  };
  const context=new Context({
    command:"add",
    commandArgs:options,
  });
  await context.loadPackage();
  const nameParts =  npmName?npmName.split('/'): context.npmName.split('/');
  const npmScope = nameParts[1] ? nameParts[0] : null;
  await DownloadTemplate(TEMP_PATH,npmName||'@tgcms/material-template-block');
  if (!materialType) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'materialType',
        message: 'Please select material type',
        choices: ['block', 'component'],
      }
    ]);
    materialType = answers.materialType;
  }
  const questions = getQuestions(npmScope, context.rootDir)[materialType];
  const materialOptions = await inquirer.prompt(questions);
  materialOptions.materialType=materialType;
  materialOptions.npmScope = npmScope;
  materialOptions.className = questions.name;
  materialOptions.kebabCaseName = decamelizeName(materialOptions.name);
  materialOptions.npmName = generateNpmName(materialOptions.name, npmScope);

  await addBlockToProject(context, {
    templateOptions:materialOptions,
    materialTemplateDir:TEMP_PATH,
  });

}
