import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import ThemesPage from './pages/ThemesPage';
import ExperimentsPage from './pages/ExperimentsPage';
import ThemeContentPage from './pages/ThemeContentPage';
import ExperimentContentPage from './pages/ExperimentContentPage';
import LoginPage from './pages/LoginPage';
import CreateThemePage from './pages/CreateThemePage';
import EditThemePage from './pages/EditThemePage';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(!!localStorage.getItem('token'));

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
          {isAdmin && (
            <Menu.Item key="3">
              <Link to="/login" onClick={() => setIsAdmin(false)}>
                Выйти
              </Link>
            </Menu.Item>
          )}
          {!isAdmin && (
            <Menu.Item key="3">
              <Link to="/login">Войти</Link>
            </Menu.Item>
          )}
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Routes>
            <Route path="/" element={<Navigate to="/themes" replace />} />
            <Route path="/themes" element={<ThemesPage isAdmin={isAdmin} />} />
            <Route path="/themes/:themeId" element={<ThemeContentPage />} />
            <Route path="/themes/new" element={<CreateThemePage />} />
            <Route path="/themes/:themeId/edit" element={<EditThemePage />} />
            <Route path="/experiments" element={<ExperimentsPage />} />
            <Route path="/experiments/:experimentId" element={<ExperimentContentPage />} />
            <Route path="/login" element={<LoginPage onLogin={() => setIsAdmin(true)} />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
