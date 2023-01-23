import "../styles/globals.css";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import { useState } from "react";
import type { AppProps } from "next/app";
import Navbar from "../src/components/layouts/Navbar";
import Sidebar from "../src/components/layouts/Sidebar";
import CopyRight from "../src/components/layouts/CopyRight";
import Footer from "../src/components/layouts/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import "@aws-amplify/ui-react/styles.css";
import awsconfig from "../src/aws-exports";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import ReactLoading from "react-loading";
import { useRouter } from "next/router";
import internal from "stream";

Amplify.configure(awsconfig);

const queryClient = new QueryClient();

const url = "https://clnjb72gh0.execute-api.ap-northeast-1.amazonaws.com/bata?";

const App = (props: AppProps) => {
  return (
    <Authenticator.Provider>
      <QueryClientProvider client={queryClient}>
        <MyApp {...props} />
      </QueryClientProvider>
    </Authenticator.Provider>
  );
};

async function getData_power(p: string, e: string, e_r: string) {
  const a = await fetch(url + "power=" + p + "&emg=" + e + "&emg_rel=" + e_r);
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [sidebarClosed, setSidebarClosed] = useState(true);
  const onSidebarToggle = (closed: boolean) => setSidebarClosed(closed);
  const { authStatus, signOut } = useAuthenticator((context) => [
    context.authStatus,
  ]);

  const [power_btn_color, setBtnColor] = useState(false);
  const [emg_btn_color, setEMGColor] = useState(false);

  const router = useRouter();

  const onmousedown = () => {
    setBtnColor(true);
    getData_power("1", "0", "0");
    /*router.push({
      pathname:url,       //URL
      query: {power : 1,
              emg : 0,
              emg_rel : 0} //検索クエリ
    },"http://localhost:3000/");
    */
  };
  const onmousup = () => {
    setBtnColor(false);
    getData_power("0", "0", "0");
    /*router.push({
      pathname:url,       //URL
      query: {power : 0,
              emg : 0,
              emg_rel : 0} //検索クエリ
    },"http://localhost:3000/");
    */
  };
  const cls = power_btn_color
    ? "bg-green-500 font-semibold text-white py-8 px-8 rounded m-5"
    : "bg-stone-500 font-semibold text-white py-8 px-8 rounded m-5";

  const onmouseclick = () => {
    if (!emg_btn_color) {
      getData_power("0", "1", "0");
      /*router.push({
        pathname:url,       //URL
        query: {power : 0,
                emg : 1,
                emg_rel : 0},
      },"http://localhost:3000/");
      */
    } else {
      getData_power("0", "0", "1");
      /* router.push({
        pathname:url,       //URL
        query: {power : 0,
                emg : 0,
                emg_rel : 1} //検索クエリ
      },"http://localhost:3000/");
      */
    }
    setEMGColor(!emg_btn_color);
  };
  const cls2 = emg_btn_color
    ? "bg-red-500 font-semibold text-white py-8 px-8 rounded m-5"
    : "bg-stone-500 font-semibold text-white py-8 px-8 rounded m-5";

  return (
    <>
      <Head>
        <title>Enviiewer | Monitoring the environment with IoT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {authStatus === "configuring" && (
        <div className="h-screen w-screen flex justify-center items-center">
          <ReactLoading type="bars" color="#6b728" height="5%" width="5%" />
        </div>
      )}
      {authStatus !== "authenticated" ? (
        <div className="h-screen w-screen flex justify-center items-center">
          <Authenticator hideSignUp={true} />
        </div>
      ) : (
        <>
          <main>
            <div className="h-screen w-screen flex justify-center items-center">
              <button
                onMouseDown={onmousedown}
                onMouseUp={onmousup}
                className={cls}
              >
                POWER
              </button>
              <button onClick={onmouseclick} className={cls2}>
                EMG
              </button>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default App;
