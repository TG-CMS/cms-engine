import {createRouter,createWebHistory,RouteRecordRaw} from 'vue-router';
const routes:RouteRecordRaw[]=[
  {
    name:'home',
    path:'/',
    component:()=>import('./views/home/index'),
  },
  {
    name:'login',
    path:'/login',
    component:()=>import('./views/login/index'),
  }

]
export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

