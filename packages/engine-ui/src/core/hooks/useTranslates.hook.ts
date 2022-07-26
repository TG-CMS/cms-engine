import {computed, reactive} from 'vue';
import {Api} from '@/core'
const store=reactive<any>({
  list:[],
  translatesInfo:null,
  source:[],
  spacesInfo:null,
  langId:-1,
  loading:false,
})
export function useTranslates(){
  const translates=computed(()=>store.list);
  const translatesInfo=computed(()=>store.translatesInfo);
  const spacesInfo=computed(()=>store.spacesInfo);
  const source=computed(()=>store.source);
  const activeLang=computed(()=>store.spacesInfo?.translate.targetLang.find((item:any)=>item.id===store.langId));

  // form
  const translate=reactive({
    "name":"",
    "description":"",
    "sourceLangId":null,
    "targetLang":[]
  });
  const spaces=reactive({
    "name":"",
    "description":""
  });
  const getTranslates=async ()=>{
    const data= await Api.Translates.translateAll();
     store.list=data;
  };
  const getTranslatesInfo=async (id:number)=>{
    const data= await Api.Translates.translateShow(id);
    store.translatesInfo=data;
  };
  const getSpacesSource=async (id:number)=>{
    const data= await Api.Translates.spacesSources(id);
    store.source=data;
  };
  const getSpacesInfo=async (id:number)=>{
    const data= await Api.Translates.spacesShow(id);
    store.spacesInfo=data;
    const {translate}=data
    if (translate?.targetLang?.length){
      store.langId=translate.targetLang[0].id;
    }
  };
  const createSpaces=async (translateId:number)=>{
    const data=await Api.Translates.spacesCreate(Object.assign({translateId},spaces));
  }
  const getLangs=()=>{

  };
  return {
    store,
    translates,
    translate,
    activeLang,
    translatesInfo,
    spacesInfo,
    source,
    spaces,
    getTranslatesInfo,
    getTranslates,
    getSpacesSource,
    getSpacesInfo,
    createSpaces,
  }

}
export function useSource(){
  const range = (count: number) =>
    Array.from(new Array(count)).map((_, key) => ({
       key:'',
       sourceText:'',
    }))
  const sourceForm=reactive({
    list:range(10),
  });
  const maxLength=50;
  const isMax=computed(()=>maxLength<=sourceForm.list.length)
  const updateText=async (id:number,translateText:string)=>{
      const data=await Api.Translates.SourceUpdate(id,{translateText})
  };
  const createTexts=async (ids:any)=>{
    const translateTexts=sourceForm.list
    const data=await Api.Translates.spacesSourceCreate(Object.assign({translateTexts},ids))
  }
  const removeSource=(index:number)=>{
    if (sourceForm.list.length===1)return;
    sourceForm.list.splice(index,1)
  }
  const addSource=()=>{
    if (isMax.value)return;
    const mix=maxLength-sourceForm.list.length
    const isFull=(mix)%10;
    sourceForm.list=sourceForm.list.concat(range(isFull===0?10:isFull));
  }

  return {
    sourceForm,
    isMax,
    createTexts,
    updateText,
    addSource,
    removeSource,
  }
}
