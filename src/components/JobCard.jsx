import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => (
  <div className="border p-4 rounded shadow bg-white space-y-2">
    <h4 className="text-lg font-bold">{job.customerName}</h4>
    <p><strong>Service:</strong> {job.service}</p>
    <p><strong>Phone:</strong> {job.phone}</p>
    <p><strong>Address:</strong> {job.address}</p>
    <p>
      <strong>Status:</strong>{' '}
      <span className={
        job.status === 'pending' ? 'text-red-600 font-semibold' :
        job.status === 'completed' ? 'text-green-600 font-semibold' :
        'text-yellow-600 font-semibold'
      }>
        {job.status}
      </span>
    </p>
    <p><strong>Problem:</strong> {job.problem}</p>

    {/* 🔗 Optional View/Update link */}
    <div className="pt-2">
      <Link
        to={`/technician/job/${job.id}`}
        className="text-blue-600 hover:underline font-medium"
      >
        View / Update Job
      </Link>
    </div>
  </div>
);

export default JobCard;
