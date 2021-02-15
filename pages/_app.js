import Head from "next/head";
import Providers from "../components/Providers";
import Layout from "../components/Layout";
import { theme } from "../lib/Theme";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <meta name="theme-color" content={theme.palette.secondary.main} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          href="/icons/favicon-16x16.png"
          rel="apple-touch-icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <Providers>
        <Layout
          hasSearch={Component.hasSearch}
          hasWorkspace={Component.hasWorkspace}
          tab={Component.tabValue}
        >
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </>
  );
}
