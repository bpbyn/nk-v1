// import { collection, onSnapshot, query } from 'firebase/firestore';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Layout from '../layouts/Layout';

const Home: React.FC = () => {
  const router = useRouter();

  if (typeof window !== 'undefined') {
    router.replace('/order');
  }

  return (
    <Layout fullHeight>
      <Head>
        <title>Northern Kaffeine</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="assets/testproject.png" />
      </Head>
    </Layout>
  );
};

export default Home;
