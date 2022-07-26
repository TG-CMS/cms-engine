import {defineComponent, onMounted} from 'vue';
import {useRouter} from "vue-router";
import { Input,Typography,Button,Card,Grid } from '@arco-design/web-vue';
import {
  AppstoreOutlined
  ,MenuOutlined,
PlusOutlined,
SearchOutlined
} from '@ant-design/icons-vue'
import style from './style.module.less';
import {useModel} from "@/components";
import {useTranslates} from "@/core";


export default defineComponent({
  setup(){
   const {open,Render}=useModel({
     title:'创建项目',
     modalProps:{
       okText:'完成创建',
       cancelText:'取消'
     }
   });
   const router=useRouter();
   const {translates,getTranslates}=useTranslates();
   onMounted(getTranslates)
    return ()=>(
      <div class={style.platform}>
        <Typography.Title heading={4}>我的项目</Typography.Title>
        <div>
          <Grid.Row
            justify={'space-between'}
            align={'center'}
            style={{margin:'12px 0'}}
          >
            <Grid.Col span={4}>
              <Input
                v-slots={{
                  prefix:()=>(
                    <SearchOutlined/>
                  )
                }}
              ></Input>
            </Grid.Col>
            <Grid.Col span={16}>

            </Grid.Col>
            <Grid.Col span={4}>
              <Button type="text">
                <AppstoreOutlined onClick={()=>open({title:'测试'})}  />
              </Button>
              <Button type="text">
                <MenuOutlined/>
              </Button>
              <Button
                onClick={()=>open()}
                v-slots={{
                icon:()=>( <PlusOutlined/>)
              }}
                      type='primary'
              >
                新增项目
              </Button>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row  gutter={[16,16]}>
            {
              translates.value.map((item:any)=>(
               <Grid.Col
                 span={6}

               >
                 <Card hoverable >
                   <Card.Meta
                     //@ts-ignore
                     onClick={()=>router.push({
                     name:'platform',
                     params:{
                       translateId:item.id,
                     }
                   })} title={item.name} description={item.description}></Card.Meta>
                 </Card>
               </Grid.Col>
              ))
            }
          </Grid.Row>
        </div>
        <Render/>
      </div>
    )
  }
})
