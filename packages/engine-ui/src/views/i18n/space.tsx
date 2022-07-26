import {defineComponent, onMounted, reactive,PropType} from 'vue';
import { PageHeader,Breadcrumb,Tabs,Menu,Table,Button,Modal,Form,Input,Textarea} from '@arco-design/web-vue';
import style from './style.module.less';
import {useTranslates} from "@/core";
import {useRoute, useRouter} from "vue-router";
import {IconPlus} from "@arco-design/web-vue/es/icon";
const SpaceTable=defineComponent({
  props:{
    table:{
      type:Array as PropType<any[]>,
      default:()=>[]
    }
  },
  setup(props){
    const router=useRouter();
    const route=useRoute();
    const id:any=route.params.translateId;
    const columns:any = [
      {
        title: '空间',
        dataIndex: 'name',
        align:"center",
      },
      {
        title: '介绍',
        dataIndex: 'description',
        align:"center",
      },
      {
        title: '修改时间',
        dataIndex: 'uTime',
        align:"center",
      },
      {
        title: '创建时间',
        dataIndex: 'cTime',
        align:"center",
      },
      {
        title: '操作',
        align:"center",
        render:({record}:any)=>(<Button type={'text'} onClick={()=>router.push({
          name:'spaceSource',
          params:{
            spaceId:record.id,
            translateId:record.translateId
          }
        })}>详情</Button>)
      }
    ];
    const {spaces,createSpaces}=useTranslates();
    const renderForm=()=>(
      <Form layout={'vertical'} model={spaces}>
            <Form.Item rules={[
              {required:true,message:'请输入空间名称'}
            ]} field="name" label="空间名称">
                <Input v-model={spaces.name} placeholder={'请输入空间名称'}></Input>
            </Form.Item>
        <Form.Item rules={[
          {required:true,message:'请输入描述'}
        ]} field="description" label="描述">
          <Textarea showWordLimit={true} maxLength={100} allowClear={true} v-model={spaces.description} placeholder={'请输入空间介绍'}></Textarea>
        </Form.Item>
      </Form>
    )
    const openModal=()=>{
      Modal.open({
        title: '新建空间',
        content:renderForm,
        onBeforeOk:(done)=>{
          createSpaces(id).catch(()=>done(false)).then(()=>done(true));
        }
      });
    }
    return ()=>(
      <>
        <div class={style.action}>
          <div/>
          <div>
            <Button
              v-slots={{
                icon:()=>( <IconPlus/>)
              }}
              type='primary'
              onClick={openModal}
            >
              新增空间
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          data={props.table}
          bordered={false}
          stripe={false}
          row-selection={{
            type: 'checkbox',
            showCheckedAll: true
          }}
        />
      </>
    )
  }
})
export default defineComponent({
  setup(){
    const {getTranslatesInfo,translatesInfo}=useTranslates();
    const route=useRoute()
    onMounted(async ()=>{
      const id:any=route.params.translateId;
      if (!id)return;
      await getTranslatesInfo(id as number)
    })
    return ()=>(
      <div class={[style.space]}>
        <PageHeader
           title={translatesInfo.value?.name}
          showBack={false}
          v-slots={{
            breadcrumb:()=>(
              <Breadcrumb>
                <Breadcrumb.Item>
                  文案管理
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {translatesInfo.value?.name}
                </Breadcrumb.Item>
              </Breadcrumb>
            )
          }}
        >
          <p style={{margin:0}}> {translatesInfo.value?.description}</p>
        </PageHeader>
        <Tabs
          class={style.spaceTab}
          lazy-load
          size={'large'}
        >
          <
            Tabs.TabPane
            key="1"
            title="空间"
          >
            <div class={style.spaceContent}>
              <SpaceTable table={translatesInfo.value?.space} />
            </div>
          </Tabs.TabPane>
          <
            Tabs.TabPane
            key="19"
            title="操作记录"
          >
            <div class={style.spaceContent}>
            </div>
          </Tabs.TabPane>
          <
            Tabs.TabPane
            key="29"
            title="截图"
          >
            <div class={style.spaceContent}>
            </div>
          </Tabs.TabPane>
          <
            Tabs.TabPane
            key="2"
            title="设置"
          >
           <div class={style.spaceSettings}>
             <Menu class={style.spaceSettingsMenu}>
               <Menu.Item>
                 项目管理
               </Menu.Item>
               <Menu.Item>
                 Key规范
               </Menu.Item>
               <Menu.Item>
                 翻译规范
               </Menu.Item>
             </Menu>
             <div class={style.spaceSettingsRules}>

             </div>
           </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
})
