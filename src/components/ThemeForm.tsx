import React, { useState } from "react";
import { Input, Button, Form, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import FormulaInput from "./FormulaForm";

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
      if (item.type === "formula" && !item.value.startsWith("$$") && !item.value.endsWith("$$")) {
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
      <Form onSubmitCapture={handleSubmit}>
        <Form.Item label="Заголовок" required>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Описание">
          <Input.TextArea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </Form.Item>

        <Form.Item label="Содержание" required>
          {content.map((item, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <Select
                value={item.type}
                onChange={(value) => handleContentChange(index, "type", value)}
                style={{ width: "120px" }}
              >
                <Select.Option value="text">Текст</Select.Option>
                <Select.Option value="formula">Формула</Select.Option>
              </Select>
              {item.type === "text" ? (
                <Input.TextArea
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
              <MinusCircleOutlined onClick={() => removeContentItem(index)} />
            </div>
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addContentItem}
          >
            Добавить содержимое
          </Button>
        </Form.Item>

        <Form.Item label="Курс">
          <Input
            id="courseId"
            type="number"
            value={courseId}
            onChange={(e) => setCourseId(Number(e.target.value))}
            required
          />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          {initialData ? "Сохранить изменения" : "Создать"}
        </Button>
      </Form>
    </div>
  );
};

export default ThemeForm;
