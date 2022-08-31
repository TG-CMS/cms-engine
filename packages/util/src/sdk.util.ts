import * as chalk from 'chalk';
import * as ora from 'ora';
import * as _ from 'lodash';
import {log} from './log.util'
import *  as fse  from 'fs-extra'
import axios, { AxiosInstance } from 'axios';
import {ClientOptions,Client} from 'minio';
import {error} from "npmlog";
interface Sdk{
  host:string
  token?:string;
  minio?:ClientOptions;
  bucket?:string
}
export class TgSdk{
  private host: string;
  private token:string;
  private request:AxiosInstance
  private minio:Client;
  private options:Sdk;
  constructor(options:Sdk) {

    const {host,token,minio}=options||{}
    this.options=options;
    this.host=host;
    this.token=token;
    const headers={};
    if (token){
      headers['token']=token
    };
    if (minio){
      this.minio=new Client(minio);
    }
    this.request=axios.create({
      baseURL:host,
      headers,
      timeout:1000*15,
    });
    this.request.interceptors.request.use((request)=>{
      return  request;
    })
    this.request.interceptors.response.use((response)=>{
      if (response && (response.status === 403 || response.status === 401)) {
        console.log();
        console.log();
        console.log(`鉴权失败，请联系相关管理人员`);
        if (response.data.success === false) {
          console.log(`错误信息: ${chalk.red(response.data.message)}`);
        }
        console.log();
        console.log();
      }
      return response.data;
    })
  }

 public async getCategories(){
    const { data: body } = await this.request.get("/api/categories");
   const categories = body.data;
   if (!categories || !categories.length) {
     console.log();
     console.log();
     console.log('获取分类失败。您可以自己创建一个分类');
     console.log();
     console.log();
     throw new Error(body.message || '分类列表为空');
   }

 }
 public async  syncMaterials(materialsData){
    const {blocks=[],components=[]}=materialsData;
    const materials=[].concat(components,blocks);
    const concurrency = 10;
    let index=0;
    const groupData = _.chunk(materials, concurrency);
    const spinner = ora(`Sync to ${this.host}, Now: 0/${materials.length}`).start();
   for (const groupItem of groupData) {
      await this.uploadMatetial(groupItem);
     index += concurrency;
     spinner.text = `Sync to ${this.host}, Now: ${index}/${materials.length}`;
     console.log()
   }
   spinner.succeed('物料上传完成！');
 }
 public async uploadMatetial(materials=[]){
    const widgets=materials.map((item)=>{
      const {
        homepage:previewLink,assets='',name:enName,title:name,screenshots=[],
        ...other
      }=item;
      const widget={
        previewLink,
        assets,
        enName,
        name,
        thumbnail:screenshots.join(','),
        ...other,
      };
      return widget;
    });
    try {
      const {data}= await this.request.post('/api/widgets/sync',{widgets});

      (data?.data ||data|| []).forEach((item) => {
        if (item.message){
          log.error('TGSDK:', `物料 ${item.widget.name} 上传失败, 原因: ${item.message}`)
        }

      });
    }catch (e) {
      console.log();
      log.error('error',e.message);
      throw  e;
    }
 }
 public async uploadAssets(assets:{fileName,filePath}[]){
   const {bucket='tgcms-oss-prod-space'}=this.options;
   const isExist=await this.minio.bucketExists(bucket);
   if (!isExist){
     await this.minio.makeBucket(bucket,'us-east-1');
   };
   await Promise.all(assets.map(({fileName,filePath})=>{
     return  this.minio.putObject(bucket,fileName, fse.readFileSync(filePath))
   }));
 }
}
