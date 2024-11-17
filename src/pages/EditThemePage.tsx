import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTheme, updateTheme } from '../services/themeService';

const EditThemePage: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState<{ type: string, value: string }[]>([]); // Тип массива объектов
  const [courseId, setCourseId] = useState(1); // Заменить на правильное значение
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const theme = await getTheme(Number(themeId));
        setTitle(theme.title);
        setDescription(theme.description);
        setContent(theme.content); // Получаем содержание как массив объектов
        setCourseId(theme.course_id);
      } catch (err) {
        setError('Ошибка при загрузке темы');
      }
    };

    fetchTheme();
  }, [themeId]);

  const handleContentChange = (index: number, field: string, value: string) => {
    const updatedContent = [...content];
    updatedContent[index] = { ...updatedContent[index], [field]: value };
    setContent(updatedContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Преобразуем content в строку перед отправкой на сервер
      const contentString = JSON.stringify(content);

      await updateTheme(Number(themeId), { title, description, content: contentString, course_id: courseId });
      navigate(`/themes/${themeId}`);
    } catch (err) {
      setError('Ошибка при обновлении темы');
    }
  };

  return (
    <div>
      <h1>Редактировать тему</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Заголовок</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="content">Содержание</label>
          {content.map((item, index) => (
            <div key={index}>
              <select
                value={item.type}
                onChange={(e) => handleContentChange(index, 'type', e.target.value)}
              >
                <option value="text">Текст</option>
                <option value="formula">Формула</option>
              </select>
              <textarea
                value={item.value}
                onChange={(e) => handleContentChange(index, 'value', e.target.value)}
                required
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="courseId">Курс</label>
          <input
            id="courseId"
            type="number"
            value={courseId}
            onChange={(e) => setCourseId(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Сохранить изменения</button>
      </form>
    </div>
  );
};

export default EditThemePage;
