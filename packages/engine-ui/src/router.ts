import {createRouter,createWebHistory,RouteRecordRaw} from 'vue-router';
import {Layout,I18nLayout} from '@/components'
const routes:RouteRecordRaw[]=[
  {
    name:'home',
    path:'/',
    component:Layout,
    children:[
      {
        name:'home',
        path:'',
        component:()=>import('./views/home/index'),
      },
      {
        name:'admin',
        path:'/admin',
        component:()=>import('./views/admin/index'),
      }
    ]
  },
  {
    name:'i18n',
    path:'/i18n',
    component:I18nLayout,
    children:[
      {
        name:'i18nhome',
        path:'',
        component:()=>import('./views/i18n/index'),
      },
      {
        name:'platform',
        path:'platform/:translateId',
        component:()=>import('./views/i18n/space'),
      },
      {
        name:'spaceSource',
        path:'platform/:translateId/space/:spaceId',
        component:()=>import('./views/i18n/spaceSource'),
      },
      {
        name:'sourceImport',
        path:'space/source/import',
        component:()=>import('./views/i18n/spaceAdd'),
      }
    ]
  },
  {
    name:'login',
    path:'/login',
    component:()=>import('./views/login/index'),
  },
]
export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

