// ThemesPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getThemes } from '../services/themeService';

interface Theme {
  id: number;
  title: string;
  description: string;
}

const ThemesPage: React.FC = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            <h2 onClick={() => navigate(`/themes/${theme.id}`)} style={{ cursor: 'pointer' }}>
              {theme.title}
            </h2>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemesPage;
