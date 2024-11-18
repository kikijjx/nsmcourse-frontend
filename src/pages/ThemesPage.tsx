import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getThemes, deleteTheme } from '../services/themeService';
import { Card, Button, Row, Col, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Theme {
  id: number;
  title: string;
  description?: string; // Описание может быть необязательным
}

const ThemesPage: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const data = await getThemes();
        setThemes(data);
      } catch (error) {
        console.error('Ошибка получения списка тем:', error);
        setError('Ошибка при загрузке тем');
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const handleDelete = async (themeId: number) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить эту тему?');
    if (confirmDelete) {
      try {
        await deleteTheme(themeId);
        setThemes(themes.filter(theme => theme.id !== themeId));
        message.success('Тема успешно удалена');
      } catch (error) {
        console.error('Ошибка при удалении темы:', error);
        setError('Ошибка при удалении темы');
      }
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>ТЕМЫ</h1>
      {isAdmin && (
        <Button type="primary" style={{ marginBottom: 20 }}>
          <Link to="/themes/new">Добавить тему</Link>
        </Button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Row gutter={16}>
        {themes.map((theme) => (
          <Col span={8} key={theme.id}>
            <Card
              title={theme.title}
              bordered={false}
              extra={isAdmin && (
                <div>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    style={{ padding: 0 }}
                    size="small"
                  >
                    <Link to={`/themes/${theme.id}/edit`}>Редактировать</Link>
                  </Button>
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    style={{ padding: 0, marginLeft: 10 }}
                    size="small"
                    onClick={() => handleDelete(theme.id)}
                  >
                    Удалить
                  </Button>
                </div>
              )}
            >
              <p>{theme.description ? theme.description : 'Описание отсутствует'}</p>
              <Link to={`/themes/${theme.id}`}>Подробнее</Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ThemesPage;
