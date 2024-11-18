import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormulaInput from "./FormulaInput";

interface ThemeFormProps {
  initialData?: {
    title: string;
    description: string;
    content: { type: string; value: string }[];
    course_id: number;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    content: { type: string; value: string }[];
    course_id: number;
  }) => Promise<void>;
  errorMessage?: string;
}

const ThemeForm: React.FC<ThemeFormProps> = ({ initialData, onSubmit, errorMessage }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [content, setContent] = useState(initialData?.content || [{ type: "text", value: "" }]);
  const [courseId, setCourseId] = useState(initialData?.course_id || 1);
  const [error, setError] = useState("");

  const handleContentChange = (index: number, field: string, value: string) => {
    const updatedContent = [...content];
    updatedContent[index] = { ...updatedContent[index], [field]: value };
    setContent(updatedContent);
  };

  const addContentItem = () => {
    setContent([...content, { type: "text", value: "" }]);
  };

  const removeContentItem = (index: number) => {
    const updatedContent = content.filter((_, i) => i !== index);
    setContent(updatedContent);
  };

  const prepareContentForSubmit = () => {
    return content.map(item => {
      if (item.type === "formula") {
        item.value = `$$${item.value}$$`;
      }
      return item;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const preparedContent = prepareContentForSubmit();
      await onSubmit({ title, description, content: preparedContent, course_id: courseId });
    } catch (err) {
      setError("Ошибка при сохранении темы");
    }
  };

  return (
    <div>
      <h1>{initialData ? "Редактировать тему" : "Создать новую тему"}</h1>
      {error || errorMessage && <p style={{ color: "red" }}>{error || errorMessage}</p>}
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
            <div key={index} style={{ marginBottom: "10px" }}>
              <select
                value={item.type}
                onChange={(e) => handleContentChange(index, "type", e.target.value)}
              >
                <option value="text">Текст</option>
                <option value="formula">Формула</option>
              </select>
              {item.type === "text" ? (
                <textarea
                  value={item.value}
                  onChange={(e) => handleContentChange(index, "value", e.target.value)}
                  required
                />
              ) : (
                <FormulaInput
                  value={item.value}
                  onChange={(value) => handleContentChange(index, "value", value)}
                />
              )}
              <button type="button" onClick={() => removeContentItem(index)}>
                Удалить
              </button>
            </div>
          ))}
          <button type="button" onClick={addContentItem}>
            Добавить содержимое
          </button>
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
        <button type="submit">{initialData ? "Сохранить изменения" : "Создать"}</button>
      </form>
    </div>
  );
};

export default ThemeForm;
