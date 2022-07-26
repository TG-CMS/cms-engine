import {mergeResource} from './request.service';
import { Translates} from './translates.service';
export * from './request.service';
export type ServiceType={
  Translates:Translates
};
export const Services={
  Translates,
}

export const Api=mergeResource<ServiceType>(Services,{
  host:'http://127.0.0.1:3000'
});
