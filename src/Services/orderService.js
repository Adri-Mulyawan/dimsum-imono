import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/Config/firebase";

const ordersCollection = collection(db, "orders");

export const createOrder = async (orderData) => {
  const docRef = await addDoc(ordersCollection, orderData);
  return docRef.id;
};

export const listenOrders = (callback) => {
  const q = query(ordersCollection, orderBy("createdAtTimestamp", "desc"));

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((document) => ({
      firebaseId: document.id,
      ...document.data(),
    }));

    callback(orders);
  });
};

export const updateOrderStatus = async (firebaseId, status) => {
  const orderRef = doc(db, "orders", firebaseId);

  await updateDoc(orderRef, {
    status,
  });
};