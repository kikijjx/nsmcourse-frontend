import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getThemes, deleteTheme } from '../services/themeService';

interface Theme {
  id: number;
  title: string;
  description: string;
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
        <button>
          <Link to="/themes/new">Добавить тему</Link>
        </button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {themes.map((theme) => (
          <li key={theme.id}>
            <Link to={`/themes/${theme.id}`}>
              <h2>{theme.title}</h2>
            </Link>
            {isAdmin && (
              <div>
                <button>
                  <Link to={`/themes/${theme.id}/edit`}>Редактировать</Link>
                </button>
                <button onClick={() => handleDelete(theme.id)}>Удалить</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemesPage;
