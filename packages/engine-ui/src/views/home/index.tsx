import {defineComponent} from 'vue';
import { Input } from 'ant-design-vue'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/vue';
const { SchemaField } = createSchemaField({
  components: {
    Input,
  },
})

export default defineComponent({
  setup(){
    const form=createForm();
    const schema= {
        type: 'object',
        properties: {
          input: {
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入',
            },
          },
        },
      };
    return ()=>(
      <div>
        <FormProvider form={form}>
              <SchemaField schema={schema} />
         </FormProvider>
      </div>
    )
  }
})
