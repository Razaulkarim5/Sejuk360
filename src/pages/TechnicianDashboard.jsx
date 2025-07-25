// src/pages/TechnicianDashboard.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import JobCard from '../components/JobCard';
import { useAuth } from '../utils/AuthContext';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    const fetchJobsAndKPI = async () => {
      if (!user) return;

      // ✅ Normalize to lowercase email
      const technicianId = user.email.toLowerCase();
      console.log("🔍 Technician Email:", technicianId);

      // ✅ Fetch jobs matching assignedTechnician (lowercase match)
      //const q = query(collection(db, 'orders'), where('assignedTechnician', '==', technicianId));
      const q = collection(db, 'orders'); 

      const snapshot = await getDocs(q);
      const fetchedJobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log("📦 Fetched Jobs:", fetchedJobs);
      setJobs(fetchedJobs);

      // ✅ Fetch KPI data based on email prefix
      const technicianKey = technicianId.split('@')[0];
      const kpiRef = doc(db, 'technicianKPI', technicianKey);
      const kpiSnap = await getDoc(kpiRef);
      if (kpiSnap.exists()) {
        setKpi(kpiSnap.data());
      }
    };

    fetchJobsAndKPI();
  }, [user]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Technician Job List</h2>

      {kpi && (
        <div className="bg-gray-100 p-4 rounded shadow space-y-1">
          <h3 className="text-lg font-semibold">Your KPI Summary</h3>
          <p>Total Jobs Done: {kpi.jobs}</p>
          <p>Total Earnings: RM {kpi.totalAmount?.toFixed(2)}</p>
          <p>Average Completion Time: {(kpi.totalTime / kpi.jobs).toFixed(1)} mins</p>
          <p>Total Uploads: {kpi.totalUploads}</p>
          <p>Jobs with Remarks: {kpi.totalRemarks}</p>
        </div>
      )}

      {jobs.length === 0 ? (
        <p className="text-gray-500 italic">No jobs assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;
