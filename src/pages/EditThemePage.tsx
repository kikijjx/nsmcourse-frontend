import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTheme, updateTheme } from "../services/themeService";
import ThemeForm from "../components/ThemeForm";

const EditThemePage: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const theme = await getTheme(Number(themeId));
        setThemeData(theme);
      } catch (err) {
        setError('Ошибка при загрузке темы');
      }
    };

    fetchTheme();
  }, [themeId]);

  const [themeData, setThemeData] = useState<{
    title: string;
    description: string;
    content: { type: string; value: string }[];
    course_id: number;
  } | null>(null);

  const handleSubmit = async (data: { title: string; description: string; content: { type: string; value: string }[]; course_id: number }) => {
    try {
      await updateTheme(Number(themeId), data);
      navigate(`/themes/${themeId}`);
    } catch (err) {
      setError("Ошибка при обновлении темы");
    }
  };

  return themeData ? (
    <ThemeForm
      initialData={themeData}
      onSubmit={handleSubmit}
      errorMessage={error}
    />
  ) : (
    <p>Загрузка...</p>
  );
};

export default EditThemePage;
