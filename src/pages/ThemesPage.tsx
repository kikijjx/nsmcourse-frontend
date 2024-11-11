import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link
import { getThemes } from '../services/themeService';

interface Theme {
  id: number;
  title: string;
  description: string;
}

const ThemesPage: React.FC = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const data = await getThemes();
        setThemes(data);
      } catch (error) {
        console.error('Ошибка получения списка тем:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>ТЕМЫ</h1>
      <ul>
        {themes.map((theme) => (
          <li key={theme.id}>
            <Link to={`/themes/${theme.id}`}> {/* Переход на страницу с контентом */}
              <h2>{theme.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemesPage;
