import React from 'react'
import { Menu, Dropdown, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import style from './index.module.less'

export default function MyHeader() {

  const menuHeaderDropdown = (
    <Menu selectedKeys={[]} onClick={() => console.log('退出')}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu >
  );

  return (
    <div className={`${style.headerwrap} flex-between`}>
      <p></p>
      <div className={`${style.right} center`}>
        <Dropdown className="action" overlay={menuHeaderDropdown}>
          <Space>
            <UserOutlined />
            <span className="name">张三</span>
          </Space>
        </Dropdown>
      </div>
    </div>
  )
}
