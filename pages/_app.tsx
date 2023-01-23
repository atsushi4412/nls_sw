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

Amplify.configure(awsconfig);

const queryClient = new QueryClient();

const App = (props: AppProps) => {
  return (
    <Authenticator.Provider>
      <QueryClientProvider client={queryClient}>
        <MyApp {...props} />
      </QueryClientProvider>
    </Authenticator.Provider>
  );
};

export async function getPower() {
  const response = await fetch(
    "https://clnjb72gh0.execute-api.ap-northeast-1.amazonaws.com/bata?power=1&emg=0&emg_rel=0"
  );
  const jsonData = await response.json();
  return jsonData.items.map((elem: any) => {
    return {
      Power: elem.power,
      Emg: elem.emg,
      Emg_Release: elem.emg_rel,
    };
  });
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [sidebarClosed, setSidebarClosed] = useState(true);
  const onSidebarToggle = (closed: boolean) => setSidebarClosed(closed);
  const { authStatus, signOut } = useAuthenticator((context) => [
    context.authStatus,
  ]);

  const [power_btn_color, setBtnColor] = useState(false);
  const [emg_btn_color, setEMGColor] = useState(false);

  const onmousedown = () => {
    setBtnColor(true);
    const data = getPower();
  };
  const onmousup = () => {
    setBtnColor(false);
  };
  const cls = power_btn_color
    ? "bg-green-500 font-semibold text-white py-8 px-8 rounded m-5"
    : "bg-stone-500 font-semibold text-white py-8 px-8 rounded m-5";

  const onmouseclick = () => {
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
                id="area1"
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
