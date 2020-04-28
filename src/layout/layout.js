import { withRouter, Link } from "react-router-dom";
import React, { useState } from 'react';
import { Layout, Menu, Icon, Button } from 'antd';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';

import {
     MenuUnfoldOutlined,
     MenuFoldOutlined,
     AreaChartOutlined,
     ProfileOutlined
} from '@ant-design/icons';
import _ from 'lodash';
const { Header, Sider, Content } = Layout;



const MENU = [
     { name: "Insights", url: "/insight", icon: AreaChartOutlined },
     {
          name: "Posts",
          icon: ProfileOutlined,
          url: "/post"
     },
     {
          name: "Comments",
          icon: ProfileOutlined,
          url: "/comment"
     }
];
const LayoutCover = (props) => {
     const { children, logout } = props;
     const [collapsed, setCollapsed] = useState(false);

     const toggle = () => {
          collapsed ? setCollapsed(false) : setCollapsed(true)
     };

     const createIcon = (string) => {
          let component = React.createElement(string);
          return component;
     }
     return (
          <Layout>
               <Sider trigger={null} collapsible collapsed={collapsed} >
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                         {_.map(MENU, (data, index) => {
                              return (
                                   <Menu.Item
                                        key={index}
                                   >
                                        <Link to={data.url}>
                                             {createIcon(data.icon)}
                                             <span>{data.name}</span>
                                        </Link>
                                   </Menu.Item>
                              );
                         })}

                    </Menu>
               </Sider>
               <Layout className="site-layout">
                    <Header className="site-layout-background fl-right" style={{ padding: 0 }} >
                         {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                              className: 'trigger',
                              onClick: toggle
                         })}
                         <Button danger type="primary" className="cus-btn" onClick={logout}>
                              Logout
                         </Button>
                    </Header>
                    <Content
                         className="site-layout-background"
                         style={{
                              margin: '24px 16px',
                              padding: 24,
                              height: '100vh'
                         }}
                    >
                         {children}
                    </Content>
               </Layout>
          </Layout>
     )
}

export default connect(null, { logout })(LayoutCover);