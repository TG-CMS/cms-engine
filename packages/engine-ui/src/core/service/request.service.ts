import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosInstance,
} from 'axios';
import qs from 'qs';
interface RequestCallback {
  onSuccess: (data: any) => void
  onError: (error: any) => void
};
interface RequestConfig extends AxiosRequestConfig {
  cache?: boolean
}
export type ResponseCode = 0 | 1 | 600 | 603 | 401 | 403 | 500 | 10005 | 20003;

export type HttpResponse<T = any, C = ResponseCode> = {
  code: C;
  data: T;
  message: string;
  timestamp?: string | number;
  path?: string;
  succeed: boolean;
  result: boolean;
};
export interface BaseResourceOptions {
  oauthToken?: string;
  token?: string;
  host?: string;
  prefixUrl?: string;
  timeout?: number;
  cache?: boolean;
}


const cacheMap = new Map();
const statusMap = new Map<string, 'pending' | 'complete'>();
const callbackMap = new Map<string, RequestCallback[]>();
const  generateCacheKey=(config: RequestConfig) =>{
  return config.url + '?' + qs.stringify(config.params)
}
export class BaseRequest{
  private readonly url: string;
  private readonly timeout: number;
  private headers:{[key:string]:any}={};
  private axios:AxiosInstance
  constructor(options?:BaseResourceOptions) {
    const {host,prefixUrl,timeout,token}=options||{};
    this.url = [host, prefixUrl].join("/");
    this.timeout = timeout || 10 * 1000;
    if (token) this.headers.authorization = `Bearer ${token}`;
    this.axios=axios.create({
      baseURL:host,
    });

  }
  baseRequest(request: RequestConfig){
    const cacheKey = generateCacheKey(request);
    if (request.cache) {
      if (statusMap.has(cacheKey)) {
        const currentStatus = statusMap.get(cacheKey)
        // 判断当前的接口缓存状态，如果是 complete ，则代表缓存完成
        if (currentStatus === 'complete') {
          return Promise.resolve(cacheMap.get(cacheKey))
        }

        // 如果是 pending ，则代表正在请求中，这里放入回调函数
        if (currentStatus === 'pending') {
          return new Promise((resolve, reject) => {
            const callback={
              onSuccess: resolve,
              onError: reject
            }
            if (callbackMap.has(cacheKey)) {
              callbackMap.get(cacheKey)!.push(callback)
            } else {
              callbackMap.set(cacheKey, [
                callback
              ])
            }
          })
        }
      }
      statusMap.set(cacheKey, 'pending')
    };
    return this.axios(request).then(
      (res) => {
        // 这里简单判断一下，200就算成功了，不管里面的data的code啥的了
        if (res.status === 200) {
          statusMap.set(cacheKey, 'complete')
          cacheMap.set(cacheKey, res)
        } else {
          // 不成功的情况下删掉 statusMap 中的状态，能让下次请求重新请求
          statusMap.delete(cacheKey)
        }
        // 这里触发resolve的回调函数
        if (callbackMap.has(cacheKey)) {
          callbackMap.get(cacheKey)!.forEach((callback) => {
            callback.onSuccess(res.data)
          })
          // 调用完成之后清掉，用不到了
          callbackMap.delete(cacheKey)
        }
        return res.data
      },
      (error) => {
        // 不成功的情况下删掉 statusMap 中的状态，能让下次请求重新请求
        statusMap.delete(cacheKey)
        // 这里触发reject的回调函数
        if (callbackMap.has(cacheKey)) {
          callbackMap.get(cacheKey)!.forEach((callback) => {
            callback.onError(error)
          })
          // 调用完成之后也清掉
          callbackMap.delete(cacheKey)
        }
        return Promise.reject(error)
      }
    );
  }
  get<T=any>(url:string,params?:any,headers?:AxiosRequestHeaders):Promise<T>{
    return  this.baseRequest({
      url,
      timeout:this.timeout,
      method: 'get',
      headers,
      params,
    })

  }
  post<T=any>(url:string,data?:any,headers?:AxiosRequestHeaders):Promise<T>{
    return   this.baseRequest({
      url,
      timeout:this.timeout,
      method: 'post',
      headers,
      data,
    })
  }
  put<T=any>(url:string,data?:any,headers?:AxiosRequestHeaders):Promise<T>{
    return   this.baseRequest({
      url,
      timeout:this.timeout,
      method: 'put',
      headers,
      data,
    })
  }
  delete<T=any>(url:string,data?:any,headers?:AxiosRequestHeaders):Promise<T>{
    return   this.baseRequest({
      url,
      timeout:this.timeout,
      method: 'delete',
      headers,
      data,
    })
  }
}


export function mergeResource<T>(Services: Record<string, Function> = {}, resource?: BaseResourceOptions) {
  class ServiceBase<A extends T> {
    constructor() {
      Object.entries(Services)
        .filter(([, s]) => typeof s === "function")
        .forEach(([k, r]) => {
          // @ts-ignore
          this[k] = new r(resource);
        });
    }
  }
  return new ServiceBase() as T;
}
