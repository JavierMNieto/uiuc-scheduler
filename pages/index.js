import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>UIUC Scheduler</title>
      </Head>
    </>
  );
}

Home.tabValue = 0;
Home.hasSearch = false;
Home.hasWorkspace = false;
