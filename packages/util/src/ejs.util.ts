import * as ejs from 'ejs';
import * as fse from 'fs-extra';

export function renderFileToWrite(
  {
    filepath,
    writeFile,
    options = {},

  }: {
    filepath: string,
    writeFile: string
    options: any
  }): Promise<string> {
  return new Promise((resolve, reject) => {
    ejs.renderFile(filepath, options, (err, result) => {
      if (err) {
        return reject(err);
      }
      fse.writeFileSync(writeFile, result);
      resolve(result);
    });
  });
}

export function renderFile(template = "", options = {}) {
  return ejs.render(template, options);
}
