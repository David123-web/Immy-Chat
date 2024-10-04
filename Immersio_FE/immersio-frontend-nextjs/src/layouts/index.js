import Head from "next/head"
import Header from "../../components/v2/Header"

const DefaultLayout = ({ children, hideSidebar = false }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Header hideSidebar={hideSidebar}>
        {children}
      </Header>
    </>
  )
}

export default DefaultLayout