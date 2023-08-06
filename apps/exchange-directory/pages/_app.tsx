import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Crypto Exchange Directory</title>
      </Head>
      <main className="h-full">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
