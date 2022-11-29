import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import moment from 'moment';

import { OrderDetails, OrderStatus } from '../../types';
import { pad } from '../../utils';
import { db } from './firebase';

export const getDocuments = async (collectionName: string) => {
  const q = query(collection(db, collectionName));
  const docSnapshots = await getDocs(q);
  const documents = [];

  docSnapshots.forEach((doc) => {
    documents.push(doc.data());
  });

  return documents;
};

export const getDocument = async (collection, documentId: string) => {
  const documentRef = doc(db, collection, documentId);

  return await getDoc(documentRef);
};

export const updateOrderStatus = async (collection, documentId: string) => {
  const documentRef = doc(db, collection, documentId);

  return await updateDoc(documentRef, {
    orderStatus: OrderStatus.COMPLETED,
  });
};

export const updateCounter = async (counterValue: number) => {
  const documentRef = doc(db, 'counter', 'queue');

  return await updateDoc(documentRef, {
    date: moment().valueOf(),
    queueCount: counterValue,
  });
};

export const addOrder = async (orderDetails: OrderDetails) => {
  try {
    await getDocument('counter', 'queue').then(async (counter) => {
      const newCount = counter.data().queueCount + 1;

      const order: OrderDetails = {
        ...orderDetails,
        orderId: 'PO-' + pad(newCount),
        orderStatus: OrderStatus.PENDING,
        orderTimestamp: moment().valueOf(),
      };

      await updateCounter(newCount);
      await addDoc(collection(db, 'orders'), order);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Place order failed');
  }
};
