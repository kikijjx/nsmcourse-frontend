// ThemeDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { getThemeById } from '../services/themeService';

interface Theme {
  id: number;
  title: string;
  content: string;
}

const ThemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const data = await getThemeById(Number(id));
        setTheme(data);
      } catch (error) {
        console.error('Ошибка загрузки темы:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!theme) {
    return <div>Тема не найдена</div>;
  }

  return (
    <div>
      <h1>{theme.title}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(theme.content) }}
      />
    </div>
  );
};

export default ThemeDetailPage;
