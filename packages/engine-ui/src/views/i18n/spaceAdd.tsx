import {defineComponent,reactive} from 'vue';
import { Typography,Breadcrumb,Table,Progress,Layout,Button,Space,Input,Select,Form} from '@arco-design/web-vue';
import { IconPlus,IconSearch,IconLeft } from '@arco-design/web-vue/es/icon';
import style from './style.module.less';
const SourceForm=defineComponent({
  setup(){
    const form = reactive({
      name: '',
      posts: [{value: ''}]
    })
    return ()=>(
      <Layout class={style.sourceModal}>
        <Layout.Header class={style.sourceModalHeader}>
          <Button style={{
            padding: 0
          }} type={'text'} v-slots={{
            icon:()=>(<IconLeft size={20}/>)
          }}>
          </Button>
          <div class={style.sourceModalHeaderTitle}>
            新增文案
            <p>空间:</p>
          </div>
        </Layout.Header>
        <Layout.Content>
          <p class={style.sourceModalTop}>
            文案
          </p>
          <div class={style.sourceModalList}>
            <div>Key</div>
            <div>源文案</div>
            <div></div>
          </div>
          <div>
            <Form class={[style.sourceModalList,style.sourceModalForm]} model={form} layout={'vertical'}>
              <div>
                <Form.Item label-col-props={{span:0}}>
                  <Input  placeholder="请输入Key" />
                </Form.Item>
              </div>
              <div>
                <Form.Item label-col-props={{span:0}}>
                  <Input  placeholder="请输入原文案" />
                </Form.Item>
              </div>
              <div>
                <Button type={'primary'} v-slots={{
                  icon:()=>(<IconPlus/>)
                }}>
                </Button>
                <Button type={'primary'} v-slots={{
                  icon:()=>(<IconPlus/>)
                }}>
                </Button>
                <Button type={'primary'} v-slots={{
                  icon:()=>(<IconPlus/>)
                }}>
                </Button>
              </div>

            </Form>
            <Button long type={'primary'} size={"large"} v-slots={{
              icon:()=>(<IconPlus/>)
            }}>
              添加文案
            </Button>
          </div>
        </Layout.Content>
      </Layout>
    )
  }
})
export default defineComponent({
  setup(){
    return ()=>(
      <div class={[style.source]}>
       <div class={style.sourceHeader}>
         <Breadcrumb>
           <Breadcrumb.Item>
             文案管理
           </Breadcrumb.Item>
           <Breadcrumb.Item>
             项目名称
           </Breadcrumb.Item>
           <Breadcrumb.Item>
             空间名称
           </Breadcrumb.Item>
         </Breadcrumb>
         {/*<div*/}
         {/*  class={style.sourceTitle}*/}
         {/*>*/}
         {/*  <svg  aria-hidden="true" style="width: 44px; height: 44px;">*/}
         {/*    <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none" id="space_header_icon">*/}
         {/*      <rect width="44" height="44" rx="3" fill="#0095EE"></rect>*/}
         {/*      <path d="M13.6666 16.9997L20.7951 13.079C21.5453 12.6664 22.4545 12.6664 23.2047 13.079L30.3333 16.9997L21.9999 21.1664L13.6666 16.9997Z" fill="white"></path>*/}
         {/*      <path d="M21.1666 22.4164L12.8333 18.2497V25.4546C12.8333 26.4015 13.3683 27.2672 14.2152 27.6907L21.1666 31.1664V22.4164Z" fill="white"></path>*/}
         {/*      <path d="M31.1666 18.2497L22.8333 22.4164V31.1664L29.7846 27.6907C30.6316 27.2672 31.1666 26.4015 31.1666 25.4546V18.2497Z" fill="white"></path>*/}
         {/*    </symbol>*/}
         {/*    <use xlinkHref="#space_header_icon"></use>*/}
         {/*  </svg>*/}
         {/*  <div class={style.sourceBody}>*/}
         {/*    <Typography.Title heading={5}>空间:Ios</Typography.Title>*/}
         {/*    <Progress percent={0.3}*/}
         {/*              v-slots={{*/}
         {/*                text:(scope:any)=>`进度 ${scope.percent * 100}%`*/}
         {/*              }}*/}
         {/*    ></Progress>*/}
         {/*  </div>*/}
         {/*</div>*/}
       </div>
        <SourceForm/>
      </div>
    )
  }
})
