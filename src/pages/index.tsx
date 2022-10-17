// import { collection, onSnapshot, query } from 'firebase/firestore';
import Head from 'next/head';

import Layout from '../layouts/Layout';

// import { firestore } from '../lib/api/firebase';

// import db from 'firebase/firestore';
// const testing = async () => {
// const test = await getDocs(collection(firestore, "orders"))
// console.log(test);
// test.forEach((doc) => {
//   // doc.data() is never undefined for query doc snapshots
//   console.log(doc.id, " => ", doc.data());
// });

// }
// const db = query(collection(firestore, "orders"))
// const unsub = onSnapshot(collection(firestore, "orders"), (doc) => {
//   console.log("Current data: ", doc.docs);
// });

// let q = query(collection(firestore, "orders"));

// console.log(q);

// onSnapshot(q, (qSnapshots) => {
//   qSnapshots.docs.forEach((doc) => {
//     console.log(doc.data().name)
//   })
// })

const Home: React.FC = () => {
  return (
    <Layout fullHeight>
      <Head>
        <title>NextJS Typescript Boilerplate</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </Layout>
  );
};

export default Home;
