import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from "react-router-dom";
import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components';
// import defaultProps from './_defaultProps';
import style from './index.module.less'
import useRoute from '@/hooks/useRoute';
import Img from '@/utils/img'
import { menuList } from '@/routes'
import MyHeader from './Header'

export default function Aside() {
  const { goto, getPageParams } = useRoute();
  const [pathname, setPathname] = useState('');

  const defaultProps = {
    route: {
      path: '/',
      routes: menuList,
    },
    location: { pathname }
  }

  useEffect(() => {
    setPathname(window.location.pathname)
  }, [])

  return (
    <div
      id="test-pro-layout"
      style={{ height: '100vh' }}
    >
      <ProLayout
        title='权限引擎'
        logo={Img.logo}
        siderWidth={216}
        {...defaultProps}
        // header={() => (<p>header</p>)}
        headerRender={() => (<p>header</p>)}
        headerContentRender={() => (<p>header</p>)}
        token={{
          sider: {
            colorMenuBackground: '#fff',
            colorMenuItemDivider: '#dfdfdf',
            colorTextMenu: '#595959',
            colorTextMenuSelected: 'rgba(42,122,251,1)',
            colorBgMenuItemSelected: 'rgba(230,243,254,1)',
          }
        }}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              setPathname(item.path || '/welcome');
              goto(item.path || '/');
            }}
          >
            {dom}
          </div>
        )}
        // 头部logo的点击事件
        onMenuHeaderClick={(e) => goto('/')}
      // breadcrumbRender={false} // 隐藏面包屑
      >
        <MyHeader />
        {/* <Outlet /> */}
        <PageContainer>
          <ProCard
            style={{
              height: '100vh',
              minHeight: 800,
            }}
          >
            <Outlet />
          </ProCard>
        </PageContainer>
      </ProLayout>
    </div >
  )
}
