import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  rem,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { AppProps } from "next/app";
import "styles/tailwind.css";
import "styles/global.css";
import Head from "next/head";
import App, { AppContext } from "next/app";
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";

export const breakpoints = {
  //use tailwind breakpoints
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

export const mantineBreakpoints = {
  xs: rem(breakpoints.xs),
  sm: rem(breakpoints.sm),
  md: rem(breakpoints.md),
  lg: rem(breakpoints.lg),
  xl: rem(breakpoints.xl),
  xxl: rem(breakpoints.xxl),
};

function MyApp(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const router = useRouter();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("color-scheme", nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  if (router.route === "/_error") return <Component {...pageProps} />;

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          fontFamily: "Poppins, sans-serif",
          headings: { fontFamily: "Poppins, sans-serif" },
          colorScheme,
          breakpoints: mantineBreakpoints,
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications autoClose={3000} />
        <Head>
          <title>Blog</title>
        </Head>
        <Component {...pageProps} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    colorScheme: getCookie("color-scheme", appContext.ctx) || "dark",
  };
};

const trpcApp = trpc.withTRPC(MyApp);

export default trpcApp;
