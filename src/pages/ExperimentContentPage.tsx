import React from 'react';
import { useParams } from 'react-router-dom';

const ExperimentContentPage: React.FC = () => {
  const { experimentId } = useParams<{ experimentId: string }>();

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <iframe
        src={`https://mathexperiment${experimentId}.streamlit.app?embed=true`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Streamlit Experiment"
      />
    </div>
  );
};

export default ExperimentContentPage;
