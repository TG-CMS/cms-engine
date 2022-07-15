import {glob} from "glob";
import * as path from "path";
import {renderFileToWrite} from "@tgcms/util";
import * as fse from "fs-extra";

export async function ejsRenderDir(dir: string, options: any){
  return new Promise((resolve, reject) => {
    glob(
      '**/*.ejs',
      {
        cwd: dir,
        nodir: true,
        dot: true,
        ignore: ['node_modules/**'],
      },
      (err, files) => {
        if (err) {
          return reject(err);
        }

        Promise.all(
          files.map((file) => {
            const filepath = path.join(dir, file);
            return renderFileToWrite({
              filepath,
              options,
              writeFile:filepath.replace(/\.ejs$/, '')
            }).then(()=>fse.remove(filepath));
          }),
        )
          .then(() => {
            resolve(null);
          })
          .catch((error) => {
            reject(error);
          });
      },
    );
  });
}
