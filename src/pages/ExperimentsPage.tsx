import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExperiments } from '../services/experimentService';

interface Experiment {
  id: number;
  title: string;
  description: string;
}

const ExperimentsPage: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const data = await getExperiments();
        setExperiments(data);
      } catch (error) {
        console.error('Ошибка получения списка экспериментов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>ЭКСПЕРИМЕНТЫ</h1>
      <ul>
        {experiments.map((experiment) => (
          <li key={experiment.id}>
            <Link to={`/experiments/${experiment.id}`}>
              <h2>{experiment.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExperimentsPage;
