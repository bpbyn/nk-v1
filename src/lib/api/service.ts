import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore';

import { db } from './firebase';

export const getDocuments = async (collectionName: string) => {
  const q = query(collection(db, collectionName));
  const docSnapshots = await getDocs(q);
  const documents = [];

  docSnapshots.forEach((doc) => {
    // eslint-disable-next-line no-console
    // console.log(doc.data());
    documents.push(doc.data());
  });

  return documents;
};

export const updateOrderStatus = async (collection, documentId: string) => {
  const documentRef = doc(db, collection, documentId);

  return await updateDoc(documentRef, {
    orderStatus: 'completed',
  });
};
