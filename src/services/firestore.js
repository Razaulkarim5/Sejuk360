// src/services/firestore.js
import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';

/**
 * Create a new order
 */
export const createOrder = async (data) => {
  const orderId = `ORD-${Date.now()}`;
  const payload = {
    ...data,
    orderId,
    status: 'Pending',
    createdAt: serverTimestamp(),
    // ✅ Normalize technician name to lowercase
    assignedTechnician: data.assignedTechnician?.toLowerCase() || '',
  };
  const docRef = await addDoc(collection(db, 'orders'), payload);
  return { id: docRef.id, ...payload };
};

/**
 * Update a job when technician completes it
 */
export const completeOrder = async (orderId, updateData) => {
  const docRef = doc(db, 'orders', orderId);
  return await updateDoc(docRef, {
    ...updateData,
    status: 'Job Done',
    completionTime: serverTimestamp(),
    // ✅ Normalize on update too (if needed)
    ...(updateData.assignedTechnician && {
      assignedTechnician: updateData.assignedTechnician.toLowerCase(),
    }),
  });
};

/**
 * Get single order by ID
 */
export const getOrder = async (id) => {
  const docRef = doc(db, 'orders', id);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
};

/**
 * Get all completed jobs (for KPI dashboard)
 */
export const getCompletedOrders = async () => {
  const q = query(collection(db, 'orders'), where('status', '==', 'Job Done'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * ✅ Get jobs assigned to a specific technician (case-insensitive)
 * @param {string} technicianId - email, UID, or name
 */
export const getJobsForTechnician = async (technicianId) => {
  const normalizedId = technicianId.toLowerCase();
  const q = query(collection(db, 'orders'), where('assignedTechnician', '==', normalizedId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
