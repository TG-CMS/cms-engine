import { existsSync } from "fs";
import { resolve } from "path";
import {mkdirpSync, readJsonSync} from "fs-extra";
import * as npminstall from 'npminstall';
import {log} from "./log.util";
import {registryUrl} from './const.util';
import { getNpmLatestSemverVersion } from "./npm.util";
import { formatPath } from "./formatPath.util";

export interface NpmPackageOption {
     targetPath:string;
     storePath:string;
     name:string;
     version:string;
     npmFilePathPrefix?:string
}

export class NpmPackage {
    targetPath:string;
    storePath:string;
    name:string;
    version:string;
    npmFilePathPrefix?:string
    constructor(options:NpmPackageOption) {
        log.verbose('options', options as any);
        this.targetPath = options.targetPath;
        this.storePath = options.storePath;
        this.name = options.name;
        this.version = options.version;
        this.npmFilePathPrefix = this.name.replace('/', '_');
    }
    get npmFilePath():string {
        return resolve(this.storePath, `_${this.npmFilePathPrefix}@${this.version}@${this.name}`);
    }
    async prepare() {
        if (!existsSync(this.targetPath)) {
            mkdirpSync(this.targetPath);
        }
        if (!existsSync(this.storePath)) {
            mkdirpSync(this.storePath);
        }
        const latestVersion = await getNpmLatestSemverVersion(this.name, this.version);
        log.verbose('latestVersion', this.name, latestVersion);
        if (latestVersion) {
            this.version = latestVersion;
        }
    }
    async install() {
        await this.prepare();
        // @ts-ignore
        return npminstall({
            root: this.targetPath,
            storeDir: this.storePath,
            registry:registryUrl,
            pkgs: [{
                name: this.name,
                version: this.version,
            }],
        });
    }
    async exists() {
        await this.prepare();
        return existsSync(this.npmFilePath);
    }

    getPackage(isOriginal = false):{[key:string]:any} {
        if (!isOriginal) {
            return readJsonSync(resolve(this.npmFilePath, 'package.json'));
        }
        return readJsonSync(resolve(this.storePath, 'package.json'));
    }
    getRootFilePath(isOriginal = false):string|null {
        const pkg = this.getPackage(isOriginal);
        if (pkg) {
            if (!isOriginal) {
                return formatPath(resolve(this.npmFilePath, pkg.main));
            }
            return formatPath(resolve(this.storePath, pkg.main));
        }
        return null;
    }

    async getVersion() {
        await this.prepare();
        return await this.exists() ? this.getPackage().version : null;
    }
    async getLatestVersion() {
        const version = await this.getVersion();
        if (version) {
            const latestVersion = await getNpmLatestSemverVersion(this.name, version);
            return latestVersion;
        }
        return null;
    }

    async update() {
        const latestVersion = await this.getLatestVersion();
        // @ts-ignore
        return npminstall({
            root: this.targetPath,
            storeDir: this.storePath,
            registry: registryUrl,
            pkgs: [{
                name: this.name,
                version: latestVersion,
            }],
        });
    }
}
