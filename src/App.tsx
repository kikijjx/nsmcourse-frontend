import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import ThemesPage from './pages/ThemesPage';
import ExperimentsPage from './pages/ExperimentsPage';
import ThemeContentPage from './pages/ThemeContentPage';
import BubbleSortPage from './pages/BubbleSortPage';
import IntegrationExperimentPage from './pages/IntegrationExperimentPage';
import LoginPage from './pages/LoginPage';
import CreateThemePage from './pages/CreateThemePage';
import EditThemePage from './pages/EditThemePage';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(!!localStorage.getItem('token'));

  const menuItems = [
    { key: '1', label: <Link to="/themes">Темы</Link> },
    { key: '2', label: <Link to="/experiments">Эксперименты</Link> },
    isAdmin
      ? {
          key: '3',
          label: (
            <Link
              to="/login"
              onClick={() => {
                setIsAdmin(false);
                localStorage.removeItem('token');
              }}
            >
              Выйти
            </Link>
          ),
        }
      : { key: '3', label: <Link to="/login">Войти</Link> },
  ];

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} />
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
            <Route path="/experiments/bubble-sort" element={<BubbleSortPage />} />
            <Route path="/experiments/integration" element={<IntegrationExperimentPage />} />
            <Route path="/login" element={<LoginPage onLogin={() => setIsAdmin(true)} />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
