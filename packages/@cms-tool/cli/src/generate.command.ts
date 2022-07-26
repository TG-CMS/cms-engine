import * as glob from 'glob';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as chalk from 'chalk';
import * as BluebirdPromise from 'bluebird';
import {Context,log,getNpmInfo,spinner as ora, DB_MATERIALS} from '@tgcms/util';

export function globMaterials(rootDir,materialType){
  return new Promise((resolve, reject) => {
    glob(
      `${materialType}s/*/package.json`,
      {
        cwd: rootDir,
        nodir: true,
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
export async function npmPublish(npm:string,version='latest'){
  const  data=await getNpmInfo(npm);
  if (!data.time) {
    console.error(chalk.red('time 字段不存在'));
    return Promise.reject(new Error(`${npm}@${version} time 字段不存在`));
  };
  const distTags = data['dist-tags'];
  version = distTags[version] || version;
  const { versions } = data;
  log.verbose('Generate:', npm, version, 'distTags', distTags, 'versions', versions ? Object.keys(versions) : '[]');
  if (!versions || versions[version] === undefined) {
    return Promise.reject(new Error(`${npm}@${version} 未发布! 禁止提交!`));
  }
  return data.time;
}
export async function generateMaterial(pkgPath,materialType,material){
  const projectPath = path.dirname(pkgPath);
  const pkg = await fse.readJson(pkgPath);
  const {description}=pkg;
  const materialConfig = pkg.config || {};
  const {unpkgHost=''}=material||{};
  const { name: npmName,registry } = pkg;
  let version = pkg.version;

  const screenshot = materialConfig.screenshot
    || materialConfig.snapshot
    || (fse.existsSync(path.join(projectPath, 'screenshot.png')) && `${unpkgHost}/${npmName}@${version}/screenshot.png`)
    || (fse.existsSync(path.join(projectPath, 'screenshot.jpg')) && `${unpkgHost}/${npmName}@${version}/screenshot.jpg`)
    || `${unpkgHost}/${npmName}@${version}/screenshot.png`;

  const screenshots = materialConfig.screenshots || (screenshot && [screenshot]);
  const homepage = pkg.homepage  ||  `${unpkgHost}/${npmName}@${version}/demo/index.html`;
  const { category, } = materialConfig;
  const {created: publishTime, modified: updateTime }=await npmPublish(npmName);
  const categories=category?[].concat(Array.isArray(category)?category:[category]):[];

  const item={
    type:materialType,
    homepage,
    description,
    ...materialConfig,
    name: materialConfig.name,
    title: materialConfig.title,
    categories,
    screenshots,
    source: {
      type: 'npm',
      npm: npmName,
      version,
      registry,
      author: pkg.author,
    },
    dependencies: pkg.dependencies || {},
    publishTime,
    updateTime,
  }
  return item;
}

export default async function (options){
  const context=new Context({
    command:'generate',
    commandArgs:options,
  });
  await context.loadPackage();
  const { materialConfig } = context.packageJson;
  const { name,description,homepage,author } = context.packageJson;
  const [blocks, components] = await Promise.all(
    ['block', 'component'].map((item) => {
      return globMaterials(context.rootDir, item);
    }),
  );
  const concurrency=30;
  const allMaterials = [].concat(blocks).concat(components);
  log.info('Generate:', `generating materials data，total: ${allMaterials.length}，concurrency: ${concurrency}`);
  const total = allMaterials.length;
  let index = 0;
  ora.text=`generate materials data progress: ${index}/${total}`;
  const spinner = ora.start();
  let materialsData=[];
  try {
    materialsData = await BluebirdPromise.map(
      allMaterials,
      (materialItem) => {
        return generateMaterial(materialItem.pkgPath, materialItem.materialType,materialConfig).then((data) => {
          index += 1;
          spinner.text = `generate materials data progress: ${index}/${total}`;
          return data;
        });
      },
      {
        concurrency,
      },
    );
    spinner.succeed(`materials data generate successfully，start write to ${DB_MATERIALS}...`);
  } catch (err) {
    spinner.fail('materials data generate failed!');
    throw err;
  }

  const blocksData = [];
  const componentsData = [];
  materialsData.forEach((item) => {
    const { type } = item;
    if (type === 'block') {
      blocksData.push(item);
    } else if (type === 'component') {
      componentsData.push(item);
    }
  });
  const data = {
    ...materialConfig,
    name,
    description,
    homepage,
    author,
    blocks: blocksData,
    components: componentsData,
  };
  const distFilepath = path.join(context.rootDir, DB_MATERIALS);
  await fse.ensureFile(distFilepath);
  await fse.writeJson(distFilepath, data, { spaces: 2 });
  console.log();
  console.log(chalk.cyan(`Success! materials data generated: ${DB_MATERIALS}`));
  console.log();
}
