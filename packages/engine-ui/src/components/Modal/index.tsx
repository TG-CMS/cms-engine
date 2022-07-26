import {reactive,VNode,createVNode,toRaw} from 'vue'
import {Modal} from 'ant-design-vue';
interface ModalProps{
 title:string;
 modalProps:{
   [key:string]:any
 }
 content:()=>VNode,
};
export function useModel(options:Partial<ModalProps>){
  const store=reactive({
    visiable:false,
    props:toRaw(options.modalProps||{}),
    title:options.title||''
  });
  const close=()=>{
    store.visiable=false;
  };
  const open=(option?:Partial<ModalProps>)=>{
    store.visiable=true;
    if (option){
      Object.assign(store.props,option)
    }
    store.title=option?.title||options.title||''
  }
  const onCancel = () => {
    close();
  };
  const modalHoc=(props:Partial<ModalProps>)=>{
    return (
      <Modal
        {
          ...props
        }
        v-model:visible={store.visiable}
        title={store.title}
        onCancel={onCancel}
        transitionName={'fade'}
        centered={true}
        destroyOnClose={true}

      >
        {props.content?.()}
      </Modal>
    )
  }
  const Render=()=>{
    return  createVNode(modalHoc, store.props||{});
  }

  return {
    store,
    close,
    open,
    Render
  }
}
