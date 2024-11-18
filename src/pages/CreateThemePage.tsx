import React from "react";
import { useNavigate } from "react-router-dom";
import { createTheme } from "../services/themeService";
import ThemeForm from "./ThemeForm";

const CreateThemePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: { title: string; description: string; content: { type: string; value: string }[]; course_id: number }) => {
    try {
      await createTheme(data);
      navigate("/themes");
    } catch (err) {
      console.error("Error creating theme:", err);
    }
  };

  return (
    <ThemeForm
      onSubmit={handleSubmit}
    />
  );
};

export default CreateThemePage;
