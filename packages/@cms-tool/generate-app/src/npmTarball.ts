import {axios, getNpmTarball, log, spinner} from "@tgcms/util";
import * as zlib from "zlib";
import * as path from "path";
import * as fse from "fs-extra";
import * as mkdirp from 'mkdirp';
import * as tar from 'tar';
export async function getTarball(destDir: string,
                                 tarball: string,
                                 progressFunc = (state) => {},

){
  const allFiles = [];
  const allWriteStream = [];
  const dirCollector = [];
  const response =await  axios({
    url: tarball,
    timeout: 10000,
    responseType: 'stream',
    onDownloadProgress: (progressEvent) => {
      progressFunc(progressEvent);
    },
  });
  const totalLength = Number(response.headers['content-length']);
  let downloadLength = 0;
  const getFiles=async ()=>{
    return   new Promise((resolve, reject)=>{
      response.data
        // @ts-ignore
        .on('data', (chunk) => {
          downloadLength += chunk.length;
          progressFunc({
            percent: (downloadLength - 50) / totalLength,
          });
        })
        // @ts-ignore
        .pipe(zlib.Unzip())
        // @ts-ignore
        .pipe(new tar.Parse())
        .on('entry',(entry)=>{
          if (entry.type === 'Directory') {
            entry.resume();
            return;
          }
          const realPath = entry.path.replace(/^package\//, '');

          let filename = path.basename(realPath);

          const destPath = path.join(destDir, path.dirname(realPath), filename);
          const dirToBeCreate = path.dirname(destPath);
          if (!dirCollector.includes(dirToBeCreate)) {
            dirCollector.push(dirToBeCreate);
            mkdirp.sync(dirToBeCreate);
          }

          allFiles.push(destPath);
          allWriteStream.push(
            new Promise((streamResolve) => {
              entry
                .pipe(fse.createWriteStream(destPath))
                .on('finish', () => streamResolve(true))
                .on('close', () => streamResolve(true)); // resolve when file is empty in node v8
            }),
          );
        })
        .on('end', () => {
          if (progressFunc) {
            progressFunc({
              percent: 1,
            });
          }
          resolve(allFiles);
        }).on('error', () => {
        reject(allFiles);
      });
    })
  }
  await getFiles();
  return  await Promise.all(allWriteStream);

}

export async function downTarball({
                                    npmName,
                                    version,
                                    projectDir,
                                  }:{
  npmName:string;
  version?:string
  projectDir:string
}){
  log.info('get','tarballURL...');
  const tarballURL=await getNpmTarball(npmName,version || 'latest');
  log.info('download','tarballURL', tarballURL);
  spinner.text='download npm tarball start';
  const spin = spinner.start();
  await getTarball(
    projectDir,
    tarballURL,
    (state) => {
      spin.text = `download npm tarball progress: ${Math.floor(state.percent * 100)}%`;
    },
  );
  spin.succeed('download npm tarball successfully.');
}
