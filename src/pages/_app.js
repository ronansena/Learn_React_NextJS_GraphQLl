import "../../styles/globals.css";
import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, CssBaseline, GlobalStyles } from "@mui/material";
import {themeLight,themeDark} from '../theme'
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";

export default function MyApp(props) {
  const { Component, pageProps } = props;
  const [light, setLight] = React.useState(true);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      
      <ThemeProvider theme={light ? themeLight : themeDark}>
        <CssBaseline />
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
        <Button onClick={() => setLight((prev) => !prev)}>Toggle Theme</Button>
      </ThemeProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
