import {defineComponent,Transition,createVNode,VNode} from 'vue';
import { RouterView, RouteLocationNormalizedLoaded, } from "vue-router";

export default defineComponent({
  setup(){
    return ()=>(
      <RouterView
        v-slots={{
          default: ({
                      Component,
                    }: {
            Component: VNode;
            route: RouteLocationNormalizedLoaded;
          }) => (
            <Transition name="fade" appear>
              {Component && createVNode(Component)}
            </Transition>
          ),
        }}
      />

    )
  }
})
