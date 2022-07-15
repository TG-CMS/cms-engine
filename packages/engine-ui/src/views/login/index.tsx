import {defineComponent,createVNode} from 'vue';
import { createForm } from '@formily/core';
import { UserOutlined ,LockOutlined} from "@ant-design/icons-vue";
import { FormProvider, createSchemaField } from '@formily/vue';
import {Form,Input,Button} from 'ant-design-vue';
import styles from "./login.module.less";
const ICONS:{[key:string]:any}={
  UserOutlined,
  LockOutlined,
}
const {SchemaField} = createSchemaField({
  components: {
    FormItem:Form.Item,
    Input,
    Password:Input.Password,
  },
  scope: {
    icon(name:string) {
      return createVNode(ICONS[name])
    },
  },
});
const normalSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: 'Username',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        prefix: "{{icon('UserOutlined')}}",
        size:'large',
        placeholder: '请输入用户名',
      },
    },
    password: {
      type: 'string',
      title: 'Password',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Password',
      'x-component-props': {
        prefix: "{{icon('LockOutlined')}}",
        size:'large',
        placeholder: '请输入密码',
      },
    },
  },
}
export default defineComponent({
  setup(){
    const normalForm = createForm({
      validateFirst: true,
    })
    return ()=>(<div
      class={styles.login}
    >

     <div class={styles.publicWrap}>
       <div class={styles.publicContent}>
         <div class={styles.publicForm}>
           <div class={styles.publicLogo}>
              <img src="https://vitejs.dev/logo-with-shadow.png" alt=""/>
              <h2>登录TG</h2>
              <h3>继续使用天工CMS搭建</h3>
           </div>

           <FormProvider

             form={normalForm}
           >
             <Form  size={"large"}>
               <SchemaField schema={normalSchema}></SchemaField>
               <div>
                 <Button block size="large" type="primary">登录</Button>
               </div>
             </Form>

           </FormProvider>
         </div>
       </div>
     </div>
    </div>)
  }
})
