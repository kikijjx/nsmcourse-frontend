import React from 'react';
import { useParams } from 'react-router-dom';
import IntegrationExperimentPage from './IntegrationExperimentPage';
import SLAEExperimentPage from './SLAEExperimentPage';

const ExperimentContentPage: React.FC = () => {
  const { experimentId } = useParams<{ experimentId?: string }>();

  const renderExperimentContent = (id: string) => {
    switch (id) {
      case '1':
        return <IntegrationExperimentPage />;
      case '2':
        return <SLAEExperimentPage />;
      default:
        return <div>Эксперимент не найден</div>;
    }
  };

  if (!experimentId) {
    return <div>Эксперимент не выбран</div>;
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {renderExperimentContent(experimentId)}
    </div>
  );
};

export default ExperimentContentPage;
