import {gt, satisfies,valid} from 'semver';
import axios from 'axios';
import urlJoin =require("url-join");
import {registryUrl} from './const.util';
export const getNpmInfo=async (npm:string,registry=registryUrl)=>{
    const url = urlJoin(registry, npm);
    const {data}= await axios.get(url);
    return data;
}
export const getLatestVersion=async (npm:string,registry?:string)=> {
   const data= await  getNpmInfo(npm,registry);
    if (!data['dist-tags'] || !data['dist-tags'].latest) {
        console.error('没有 latest 版本号', data);
        return new Error('Error: 没有 latest 版本号');
    }
    return data['dist-tags'].latest;
}
export const getVersions= async(npm:string,registry?:string):Promise<string[]>=>{
  const data= await getNpmInfo(npm,registry);
   return Object.keys(data.versions);

}
export const getLatestSemverVersion=async (baseVersion:string, versions:string[])=>{
    versions = versions
        .filter( (version)=>satisfies(version, "^" + baseVersion))
        .sort( (a, b:string)=> (gt(b, a) as any));
    return versions[0];
}
export const getNpmLatestSemverVersion=async (npm:string, baseVersion:string, registry?:string):Promise<string> => {
       const versions= await getVersions(npm, registry)
      return  getLatestSemverVersion(baseVersion, versions);
}

/**
 * 获取指定 npm 包版本的 tarball
 */
export function getNpmTarball(npm: string, version?: string, registry=registryUrl): Promise<string> {
  return getNpmInfo(npm, registry).then((json: any) => {
    if (!valid(version)) {
      // support beta or other tag
      version = json['dist-tags'][version] || json['dist-tags'].latest;
    }
    if (valid(version) && json.versions && json.versions[version] && json.versions[version].dist) {
      return json.versions[version].dist.tarball;
    }
    return Promise.reject(new Error(`没有在 ${registry} 源上找到 ${npm}@${version} 包`));
  });
}
