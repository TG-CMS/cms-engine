import {BaseRequest} from "@/core";

export class Translates extends BaseRequest{
  translateLang(){
     return this.get('/api/translates/langs')
  }
  translateAll(){
    return this.get('/api/translates')
  }
  translateCreate(data:any){
    return this.post('/api/translates',data)
  }
  translateRemove(id:number){
    return this.delete('/api/translates/'+id)
  }
  translateUpdate(id:number,data:any){
    return this.put('/api/translates/'+id,data)
  }
  translateShow(id:number){
    return this.get('/api/translates/'+id)
  }

  spacesCreate(data:any){
    return this.post('/api/translates/spaces',data)
  }
  spacesRemove(id:any){
    return this.delete('/api/translates/spaces/'+id)
  }
  spacesUpdate(id:any,data:any){
    return this.put('/api/translates/spaces/'+id,data)
  }
  spacesShow(id:any){
    return this.get('/api/translates/spaces/'+id)
  }


  spacesSources(spacesId:number){
    return this.get('/api/translates/spaces/source/'+spacesId)
  }
  spacesSourcesRemove(sourceId:number){
    return this.delete('/api/translates/spaces/source/'+sourceId)
  }
  spacesSourceCreate(data:any){
    return this.post('/api/translates/spaces/source',data)
  }
  SourceUpdate(translateId:number,data:any){
    return this.put('/api/translates/spaces/translate/'+translateId,data)
  }

}
