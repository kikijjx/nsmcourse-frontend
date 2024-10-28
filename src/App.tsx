import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import ThemesPage from './pages/ThemesPage';
import TasksPage from './pages/ExperimentsPage';
import LabWorksPage from './pages/LabsPage';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/themes">Темы</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/experiments">Эксперименты</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/labs">Лабораторные работы</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Routes>
            <Route path="/themes" element={<ThemesPage />} />
            <Route path="/experiments" element={<TasksPage />} />
            <Route path="/labs" element={<LabWorksPage />} />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>©2024</Footer>
    </Layout>
  );
};

export default App;
