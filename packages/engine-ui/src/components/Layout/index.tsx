import {createVNode, defineComponent, reactive, Transition, VNode} from 'vue';
import {
  Layout,
  Menu,
  Space,
  Typography,
  Button,
  Badge,
  Avatar,
  Popover
} from '@arco-design/web-vue';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  ExpandOutlined,
  UserOutlined,
  SettingOutlined,
  LoginOutlined
} from '@ant-design/icons-vue';
import {RouteLocationNormalizedLoaded, RouterView, useRouter} from 'vue-router'
import style from './style.module.less';
const renderView=()=>(
  <div class={style.container}>

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
  </div>
);
const renderLayoutSider=defineComponent({
  setup(){
    const store=reactive({
      collapsed:false
    });
    return ()=>(
      <Layout>
        <Layout.Sider
          v-model:collapsed={store.collapsed}
          theme={'light'}
          collapsible
          v-slots={{
            trigger:()=>(
              store.collapsed?<MenuUnfoldOutlined/>:<MenuFoldOutlined/>
            )
          }}
          class={style.sider}
          style={{
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            paddingTop: "64px",
          }}
        >

          <Menu
            theme={'light'}
          >
            <Menu.SubMenu
              key="sub1"
              v-slots={{
                title:()=>("sub1")
              }}
            >
              <Menu.Item key={'34'}>
                Option 1
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              key="sub2"
              v-slots={{
                title:()=>("sub2")
              }}
            >
              <Menu.Item key={'1'}>
                Option 1
              </Menu.Item>
              <Menu.Item key={'3'}>
                Option 1
              </Menu.Item>
              <Menu.Item key={'4'}>
                Option 1
              </Menu.Item>
              <Menu.Item key={'10'}>
                Option 1
              </Menu.Item>
            </Menu.SubMenu>

          </Menu>
        </Layout.Sider>
        <Layout.Content
          style={{
            paddingLeft: `${store.collapsed?80:200}px`,
            paddingTop: '64px',
          }}
          class={style.content}
        >
          <Layout.Content
            class={style.main}
          >
            {renderView()}
          </Layout.Content>
        </Layout.Content>
      </Layout>
    )
  }
});
const PublicHeader=defineComponent({
  setup(){
    const router=useRouter();
    return ()=>(
      <Layout.Header  class={style.header}>
        <div class={style.navbar}>
          <div class={style.navLeft}>
            <Space
              class={style.navTitle}
              //@ts-ignore
              onClick={()=>router.push('/')}
            >
              <img  src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image" alt=""/>
              <Typography.Title heading={5}   >Arco Pro</Typography.Title>
            </Space>

            <Typography.Title
              //@ts-ignore
              class={style.navName}
               heading={5}   >国际化翻译中心</Typography.Title>
          </div>
          <div class={style.navRight}>
            <li>
              <Button shape="circle">
                    <span class='anticon'>
                      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="ant-icon" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" data-v-0ee42d02=""><path d="m42 43-2.385-6M26 43l2.384-6m11.231 0-.795-2-4.18-10h-1.28l-4.181 10-.795 2m11.231 0h-11.23M17 5l1 5M5 11h26M11 11s1.889 7.826 6.611 12.174C22.333 27.522 30 31 30 31"></path><path d="M25 11s-1.889 7.826-6.611 12.174C13.667 27.522 6 31 6 31"></path></svg>
                    </span>
              </Button>
            </li>
            <li>
              <Badge>
                <Button shape="circle">
                  <BellOutlined/>
                </Button>
              </Badge>
            </li>
            <li>
              <Badge>
                <Button shape="circle">
                  <BellOutlined/>
                </Button>
              </Badge>
            </li>
            <li>
              <Button shape="circle">
                <ExpandOutlined/>
              </Button>
            </li>
            <li>
              <Popover
                trigger="click"
                v-slots={{
                  content:()=>(
                    <div class={style.setting}>
                      <div class={style.settingItem}>
                        <UserOutlined/> 用户中心

                      </div>
                      <div class={style.settingItem}>
                        <SettingOutlined/>用户设置
                      </div>
                      <div class={style.settingItem}>
                        <LoginOutlined/> 退出登录
                      </div>
                    </div>
                  )
                }}
              >
                <Avatar >
                  <img src='//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png' alt=""/>
                </Avatar>
              </Popover>

            </li>
          </div>
        </div>
      </Layout.Header>
    )
  }
})
export const I18nLayout=defineComponent({
  setup(){
    return ()=>(
      <Layout class={style.background}>
        <PublicHeader/>
        <Layout.Content
          style={{
            paddingTop: '64px'
          }}
          class={style.i18n}
        >
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
        </Layout.Content>
      </Layout>
    )
  }
})
export default defineComponent({
  setup(){
    return ()=>(
      <Layout>
         <PublicHeader/>
         <Layout.Content>
           {renderView()}
         </Layout.Content>
      </Layout>)
  }
});
