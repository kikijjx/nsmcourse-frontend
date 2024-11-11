import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getThemeById } from '../services/themeService'; // Функция для получения одной темы по ID

interface Content {
  type: string; // например, "text" или "formula"
  value: string;
}

const ThemeContentPage: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>(); // Получаем ID темы из URL
  console.log('AAAAAAAAAAAA', themeId);
  const [theme, setTheme] = useState<{ title: string; content: Content[] }>({ title: '', content: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const data = await getThemeById(Number(themeId));
        console.log('Полученные данные темы:', data); // Логируем полученные данные
        setTheme(data);
      } catch (error) {
        console.error('Ошибка получения темы:', error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchTheme();
  }, [themeId]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>{theme.title}</h1>
      <div>
        {theme.content.map((item, index) => (
          <div key={index}>
            {item.type === 'text' && <p>{item.value}</p>}
            {item.type === 'formula' && <div dangerouslySetInnerHTML={{ __html: item.value }} />} {/* Поддержка формул */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeContentPage;
