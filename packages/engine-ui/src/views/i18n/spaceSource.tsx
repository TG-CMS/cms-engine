import {defineComponent, onMounted, PropType, reactive} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useVModel} from '@vueuse/core'
import {
  Typography,
  Breadcrumb,
  Table,
  Progress,
  Layout,
  Button,
  Space,
  Input,
  Textarea,
  Select,
  Form,
  Menu,
  Spin,
  Drawer,
  Grid,
  Tooltip,
  Dropdown,
  Modal,
  Alert
} from '@arco-design/web-vue';
import {
  IconPlus,
  IconSearch,
  IconLeft,
  IconPenFill,
  IconMore,
  IconTranslate,
  IconDelete,
  IconLanguage
} from '@arco-design/web-vue/es/icon';
import style from './style.module.less';
import {useTranslates,useSource} from "@/core";

const EditText=defineComponent({
   props:{
     value:{
       type:String as PropType<string>,
       default:'',
     }
   },
  emits:['save','update:value'],
  setup(props,{emit}){
     const value=useVModel(props,'value',emit)
    const store=reactive({
      open:false,
    });
    const renderText=()=>(
      <div class={style.sourceEdit}>
         <span class={style.sourceEditText}>{value.value||'--'}</span>
        <Tooltip content={'编辑译文'}>
          <span class={style.sourceEditAction} onClick={()=>store.open=true}><IconPenFill size={16}/></span>
        </Tooltip>
      </div>
    );
    const renderInput=()=>(
      <div>
        <Textarea placeholder={'请输入翻译文案'} show-word-limit allow-clear v-model={value.value}/>
        <Grid.Row>
          <Grid.Col span={18}></Grid.Col>
          <Grid.Col span={6}>
           <Space>
             <Button type="dashed" onClick={()=>store.open=false}>取消</Button>
             <Button type="primary" onClick={()=>{
               emit('save');
               store.open=false;
             }}>保存</Button>
           </Space>
          </Grid.Col>
        </Grid.Row>
      </div>
    )
    return ()=>store.open?renderInput():renderText()
  }
})
const SourceTable=defineComponent({
  props:{
    table:{
      type:Array as PropType<any[]>,
      default:()=>[]
    },
    lang:{
      type:Number as PropType<number>,
      default:-1,
    }
  },
  setup(props){
    const store=reactive({
      // data:props.table.map((item)=>Object.assign(item,{_edit:false})),
      drawer:false,
      translateText:[]
    });
    const columns:any = [
      {
        title: 'Key',
        dataIndex: 'key',
        width:200,
        align:"center",
      },
      {
        title: '原文案',
        dataIndex: 'sourceText',
        align:"center",
      },
      {
        title: '最长字符数',
        dataIndex: 'address',
        align:"center",
        width:140,
      },
      {
        title: '截图',
        dataIndex: 'email',
        align:"center",
        width:100,
      },
      {
        title: '注释',
        dataIndex: 'remark',
        align:"center",
        width:200,
      },
      {
        title: '翻译文案',
        dataIndex: 'translateText',
        align:"center",
        width:240,
        render:({record,column}:any)=>{
          const text=record.translateText?.find((item:any)=>item.id===props.lang);
          return  text?.translateText;
        }

      },
      {
        title: '',
        dataIndex: 'action',
        width:100,
        render:({record}:any)=>(
          <Space>
            <span ><IconPenFill  size={16}/> </span>
            <Dropdown
              onSelect={(value)=>{
                switch (value){
                  case 1:
                    store.drawer=true;
                    store.translateText=record.translateText;
                    break
                }
              }}
              v-slots={{
                content:()=>(
                  <>
                    <Dropdown.Option value={1}><IconLanguage style={{marginRight:'6px'}}/>全部译文</Dropdown.Option>
                    <Dropdown.Option value={2}><IconTranslate style={{marginRight:'6px'}}/>机器翻译</Dropdown.Option>
                    <Dropdown.Option value={3}><IconDelete style={{marginRight:'6px'}}/>删除文案</Dropdown.Option>
                  </>
                )
              }}
            >
              <span><IconMore size={16}/></span>
            </Dropdown>

          </Space>
        )
      },

    ];
    const {updateText}=useSource()
    return ()=>(
      <>
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
        <Drawer
          visible={store.drawer}
          title={'文案详情'}
                unmountOnClose
          onCancel={()=>store.drawer=false}
          width={800}
          footer={false}
        >
          {
            store.translateText.map((item:any)=>(
              <Grid.Row class={style.sourceRow}>
                <Grid.Col class={style.sourceRowName} span={5}>{item.translateLang?.name}</Grid.Col>
                <Grid.Col span={19}>
                  <EditText v-model:value={item.translateText} onSave={()=>updateText(item.id,item.translateText)}/>
                </Grid.Col>
              </Grid.Row>
            ))
          }
        </Drawer>

      </>
    )
  }
});
export default defineComponent({
  setup(){
    const {
      getSpacesSource,
      getSpacesInfo,
      spacesInfo,
      source,
      store,
      activeLang,
    }=useTranslates();
    const {sourceForm,addSource,isMax,removeSource,createTexts}=useSource()
    const router =useRouter()
    const route=useRoute();
    const SourceForm=()=>(
      <div class={style.sourceModal}>
        <Alert title={'Key格式'}>推荐按[功能模块][功能名称]的格式命名Key,示例:Login.username</Alert>
        <p class={style.sourceModalTop}>
          文案
        </p>
        <div class={style.sourceModalList}>
          <div>Key</div>
          <div>源文案</div>
          <div></div>
        </div>
        <div class={style.sourceModalBox}>
          {
            sourceForm.list.map((item,index:number)=>(
              <Form key={index} class={[style.sourceModalList, style.sourceModalForm]} model={item} layout={'vertical'}>
                <div>
                  <Form.Item field={'key'} label-col-props={{span: 0}}>
                    <Input v-model={item.key} placeholder="请输入Key"/>
                  </Form.Item>
                </div>
                <div>
                  <Form.Item field={'sourceText'} label-col-props={{span: 0}}>
                    <Input v-model={item.sourceText} placeholder="请输入原文案"/>
                  </Form.Item>
                </div>
                <div>
                  <span onClick={()=>removeSource(index)}><IconDelete  size={16}/></span>
                </div>

              </Form>

            ))
          }
        </div>
        <Button long type={'primary'}
                size={"large"}
                onClick={addSource}
                disabled={isMax.value}
                v-slots={{
                  icon: () => (<IconPlus/>)
                }}>
          添加文案
        </Button>
      </div>
    )
    const openModel=()=>{
      Modal.open({
        title:()=>(
          <div class={style.sourceModalHeaderTitle}>
            新增文案
            <p>空间:{spacesInfo.value?.name}</p>
          </div>
        ),
        titleAlign:'start',
        fullscreen:true,
        content:()=><SourceForm/>,
        onBeforeOk:(done)=>{
          const spaceId:any=route.params.spaceId;
          const translateId:any=route.params.translateId;
          createTexts({translateId,spaceId}).catch(()=>done(false)).then(()=>done(true))
        }
      });
    }
    onMounted(async ()=>{
      const spacesId:any=route.params.spaceId;
      if (!spacesId)return;
      store.loading=true;
      await Promise.all([getSpacesSource(spacesId),getSpacesInfo(spacesId)]);
      store.loading=false;
    });
    return ()=>(
      <div class={[style.source]}>
        <Spin loading={store.loading} tip={'数据获取中...'}>
          <div class={style.sourceHeader}>
            <Breadcrumb>
              <Breadcrumb.Item>
                文案管理
              </Breadcrumb.Item>
              <Breadcrumb.Item  >
                <span onClick={()=>router.push({
                  name:'platform',
                  params:{
                    translateId:spacesInfo.value?.id,
                  }
                })}>{spacesInfo.value?.translate.name}</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {spacesInfo.value?.name}
              </Breadcrumb.Item>
            </Breadcrumb>
            <div
              class={style.sourceTitle}
            >
              <svg  aria-hidden="true" style="width: 44px; height: 44px;">
                <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none" id="space_header_icon">
                  <rect width="44" height="44" rx="3" fill="#0095EE"></rect>
                  <path d="M13.6666 16.9997L20.7951 13.079C21.5453 12.6664 22.4545 12.6664 23.2047 13.079L30.3333 16.9997L21.9999 21.1664L13.6666 16.9997Z" fill="white"></path>
                  <path d="M21.1666 22.4164L12.8333 18.2497V25.4546C12.8333 26.4015 13.3683 27.2672 14.2152 27.6907L21.1666 31.1664V22.4164Z" fill="white"></path>
                  <path d="M31.1666 18.2497L22.8333 22.4164V31.1664L29.7846 27.6907C30.6316 27.2672 31.1666 26.4015 31.1666 25.4546V18.2497Z" fill="white"></path>
                </symbol>
                <use xlinkHref="#space_header_icon"></use>
              </svg>
              <div class={style.sourceBody}>
                <Typography.Title heading={5}>空间:{spacesInfo.value?.name}</Typography.Title>
                <Progress percent={0.3}
                          v-slots={{
                            text:(scope:any)=>`进度 ${scope.percent * 100}%`
                          }}
                ></Progress>
              </div>
            </div>
          </div>
          <Layout>
            <Layout.Sider class={style.sourceSlider}>
              <Menu selected-keys={[`${store.langId}`]}>
                {
                  spacesInfo.value?.translate.targetLang.map((item:any)=>(
                    <Menu.Item key={`${item.id}`} onClick={()=>store.langId=item.id}>
                      {item.name} [{item.lang}]
                    </Menu.Item>
                  ))
                }

              </Menu>
            </Layout.Sider>
            <Layout.Content class={style.sourceContent}>
              <div class={style.sourceContentHeader}>
                <h4>{activeLang.value?.name}_{activeLang.value?.lang}</h4>
                <div>
                  <Space>
                    <Button
                      type="primary"
                      class={style.sourceContentButton}
                      v-slots={{
                        icon:()=>(
                          <svg width={12} height={12} fill='currentColor' aria-hidden="true" stroke="currentColor">
                            <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="icons-import"><path d="M10.5 7V2.5a1.5 1.5 0 0 1 3 0V7h-.085a1.5 1.5 0 0 0-2.83 0H10.5zM10.5 7H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V10a3 3 0 0 0-3-3h-5.5v6.379l1.44-1.44a1.5 1.5 0 0 1 2.12 2.122l-4 4a1.5 1.5 0 0 1-2.12 0l-4-4a1.5 1.5 0 0 1 2.12-2.122l1.44 1.44V7z"></path></symbol>
                            <use xlinkHref="#icons-import"></use>
                          </svg>
                        )
                      }}
                    >
                      导入文案
                    </Button>
                    <Button
                      type="primary"
                      class={style.sourceContentButton}
                      v-slots={{
                        icon:()=>(
                          <svg width={12} height={12} fill='currentColor' aria-hidden="true"  stroke="currentColor">
                            <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="icons-send"><path d="M20.603 2.132 1.535 8.488a1 1 0 0 0-.39 1.656l3.812 3.813a1 1 0 0 0 1.208.158l8.186-4.74c.177-.102.376.097.273.274l-4.74 8.186a1 1 0 0 0 .16 1.208l3.812 3.813a1 1 0 0 0 1.656-.391l6.356-19.068a1 1 0 0 0-1.265-1.265z"></path></symbol>
                            <use xlinkHref="#icons-send"></use>
                          </svg>
                        )
                      }}
                    >
                      发布文案
                    </Button>
                    <Button
                      type={'primary'}
                      onClick={openModel}
                      v-slots={{
                      icon:()=>(<IconPlus/>)
                    }}>
                      新增文案
                    </Button>
                  </Space>

                </div>
              </div>
              <div class={style.sourceContentFilter}>
                <Input
                  v-slots={{
                    prefix:()=>(
                      <IconSearch/>
                    ),
                    suffix:()=>(
                      <Button
                        v-slots={{
                          icon:()=>(
                            '/'
                          )
                        }}
                      >
                      </Button>
                    )
                  }}
                  style={{    width: '220px'}}
                >

                </Input>
                <div class={style.sourceContentFilterSelect}>
                  <Select  style={{    width: '220px'}} placeholder="翻译状态" trigger-props={{ autoFitPopupMinWidth: true }}>
                    <Select.Option>Beijing-Beijing-Beijing</Select.Option>
                    <Select.Option>Shanghai</Select.Option>
                    <Select.Option>Guangzhou</Select.Option>
                    <Select.Option disabled>Disabled</Select.Option>
                  </Select>
                  <Select  style={{    width: '220px'}} placeholder="发补状态" trigger-props={{ autoFitPopupMinWidth: true }}>
                    <Select.Option>Beijing-Beijing-Beijing</Select.Option>
                    <Select.Option>Shanghai</Select.Option>
                    <Select.Option>Guangzhou</Select.Option>
                    <Select.Option disabled>Disabled</Select.Option>
                  </Select>
                </div>
              </div>
              <SourceTable table={source.value} lang={store.langId}/>
            </Layout.Content>
          </Layout>
        </Spin>

      </div>
    )
  }
})
