import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { getThemeById } from '../services/themeService';

interface Content {
  type: string;
  value: string;
}

const ThemeContentPage: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>(); 
  console.log('Полученные данные ID темы:', themeId);
  const [theme, setTheme] = useState<{ title: string; content: Content[] }>({ title: '', content: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const data = await getThemeById(Number(themeId));
        console.log('Полученные данные темы:', data);
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
      <MathJaxContext>
        {theme.content.map((item, index) => (
          <div key={index}>
            {item.type === 'text' && <p>{item.value}</p>}
            {item.type === 'formula' && (
              <MathJax inline dynamic>
                {item.value}
              </MathJax>
            )}
          </div>
        ))}
      </MathJaxContext>
    </div>
  );
};

export default ThemeContentPage;
