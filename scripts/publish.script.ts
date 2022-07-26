import {prompt} from 'inquirer';
import * as minimist from 'minimist'
import * as semver from 'semver';
import { run } from './util';
const args = minimist(process.argv.slice(2));
const currentVersion = require('../package.json').version;
const preId =
  args.preid ||
  (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0])
const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : [])
];
const inc = i => semver.inc(currentVersion, i, preId)
async function main(){
  let targetVersion = args._[0];
  if (!targetVersion){
    const { release } = await prompt({
      type: 'list',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
    });
    if (release === 'custom') {
      targetVersion = (
        await prompt({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion
        })
      ).version
    } else {
      targetVersion = release.match(/\((.*)\)/)[1]
    }
  }
  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }
  await run(`pnpm -r exec npm version ${targetVersion}`);
  await run(`npm version ${targetVersion} --no-git-tag-version`);
  await run(`pnpm -r publish --no-git-checks`);
}
main()
