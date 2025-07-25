import React from 'react';
import { useParams } from 'react-router-dom';
import TechnicianForm from '../components/TechnicianForm';

const JobDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Job ID: {id}</h2>
      <TechnicianForm jobId={id} />
    </div>
  );
};

export default JobDetails;