import React, { useState, useEffect } from 'react';
import { db, storage } from '../services/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../utils/AuthContext';

const TechnicianForm = ({ jobId }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    workDone: '',
    extra: 0,
    remarks: '',
    technician: '',
    files: [],
  });
  const [quotedPrice, setQuotedPrice] = useState(0);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [createdAt, setCreatedAt] = useState(null);

  // Set technician email from logged-in user
  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({
        ...prev,
        technician: user.email.toLowerCase(),
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchOrder = async () => {
      const docRef = doc(db, 'orders', jobId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setQuotedPrice(parseFloat(data.quotedPrice) || 0);
        setCustomerPhone(data.phone || '');
        setCustomerName(data.customerName || '');
        setCreatedAt(data.createdAt?.toDate?.() || new Date());
      }
    };
    fetchOrder();
  }, [jobId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setForm({ ...form, files: Array.from(e.target.files).slice(0, 6) });

  const updateTechnicianKPI = async (technician, values) => {
    const kpiRef = doc(db, 'technicianKPI', technician.split('@')[0]);
    const snap = await getDoc(kpiRef);

    const timeTaken =
      values.completionTime && values.createdAt
        ? (values.completionTime.getTime() - values.createdAt.getTime()) / 1000 / 60
        : 0;

    const update = {
      jobs: 1,
      totalAmount: values.revenue,
      totalTime: timeTaken,
      totalUploads: values.uploads,
      totalRemarks: values.remarks ? 1 : 0,
    };

    if (snap.exists()) {
      const prev = snap.data();
      await setDoc(kpiRef, {
        jobs: prev.jobs + 1,
        totalAmount: prev.totalAmount + update.totalAmount,
        totalTime: prev.totalTime + update.totalTime,
        totalUploads: prev.totalUploads + update.totalUploads,
        totalRemarks: prev.totalRemarks + update.totalRemarks,
      });
    } else {
      await setDoc(kpiRef, update);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadURLs = [];

      for (const file of form.files) {
        const fileRef = ref(storage, `uploads/${jobId}/${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        uploadURLs.push(downloadURL);
      }

      const finalAmount =
        parseFloat(quotedPrice) + parseFloat(form.extra || 0);
      const completionTime = new Date();

      const docRef = doc(db, 'orders', jobId);
      await updateDoc(docRef, {
        workDone: form.workDone,
        extraCharges: form.extra,
        finalAmount: finalAmount,
        remarks: form.remarks,
        technicianName: form.technician,
        completionTime: serverTimestamp(),
        fileURLs: uploadURLs,
        status: 'Job Done',
        customerPhone,
        customerName,
      });

      await updateTechnicianKPI(form.technician, {
        revenue: finalAmount,
        completionTime,
        createdAt,
        uploads: uploadURLs.length,
        remarks: form.remarks,
      });

      alert('Job submitted and updated successfully!');

      const message = `Hi ${customerName}, job ${jobId} has been completed by Technician ${form.technician}. Please check and leave feedback. Thank you!`;
      const waURL = `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`;
      window.open(waURL, '_blank');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit job completion');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 w-full sm:max-w-lg sm:mx-auto bg-white rounded-lg shadow"
    >
      <p>
        <strong>Order ID:</strong> {jobId}
      </p>

      <textarea
        name="workDone"
        placeholder="Work Done"
        className="w-full border p-2"
        onChange={handleChange}
        required
      ></textarea>

      <input
        name="extra"
        type="number"
        placeholder="Extra Charges"
        className="w-full border p-2"
        onChange={handleChange}
        required
      />

      <input
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        className="block w-full border border-gray-300 rounded p-2"
        onChange={handleFileChange}
      />

      <textarea
        name="remarks"
        placeholder="Remarks"
        className="w-full border p-2"
        onChange={handleChange}
      ></textarea>

      <input
        name="technician"
        value={form.technician}
        readOnly
        className="w-full border p-2 bg-gray-100"
      />

      <p className="text-sm text-gray-600">
        Final Amount (Estimated): RM{' '}
        {(parseFloat(quotedPrice) + parseFloat(form.extra || 0)).toFixed(2)}
      </p>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit Job
      </button>
    </form>
  );
};

export default TechnicianForm;
