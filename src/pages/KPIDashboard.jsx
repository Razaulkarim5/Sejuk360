// src/pages/KPIDashboard.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

const KPIDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const snapshot = await getDocs(collection(db, 'orders'));
      const data = snapshot.docs.map(doc => doc.data());

      const result = {};

      data.forEach(order => {
        if (order.status !== 'Job Done') return;

        const tech = order.assignedTechnician || 'Unassigned';
        const created = order.createdAt?.toDate?.();
        const completed = order.completionTime?.toDate?.();
        const timeTaken =
          created && completed
            ? (completed.getTime() - created.getTime()) / 1000 / 60 // in minutes
            : 0;

        const uploadCount = order.fileURLs?.length || 0;
        const hadRemarks = order.remarks?.trim() ? 1 : 0;

        if (!result[tech]) {
          result[tech] = {
            jobs: 0,
            totalAmount: 0,
            totalTime: 0,
            totalUploads: 0,
            totalRemarks: 0,
          };
        }

        result[tech].jobs += 1;
        result[tech].totalAmount +=
          parseFloat(order.quotedPrice || 0) + parseFloat(order.extraCharges || 0);
        result[tech].totalTime += timeTaken;
        result[tech].totalUploads += uploadCount;
        result[tech].totalRemarks += hadRemarks;
      });

      setStats(result);
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Technician KPI Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(stats).map(([tech, data]) => (
          <div key={tech} className="border rounded-lg p-4 shadow-md bg-white">
            <h3 className="font-semibold text-lg">{tech}</h3>
            <p>Total Jobs Done: {data.jobs}</p>
            <p>Total Earnings: RM {data.totalAmount.toFixed(2)}</p>
            <p>Average Time/Job: {data.jobs ? (data.totalTime / data.jobs).toFixed(1) : 0} mins</p>
            <p>Total Uploads: {data.totalUploads}</p>
            <p>Jobs with Remarks: {data.totalRemarks}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPIDashboard;
