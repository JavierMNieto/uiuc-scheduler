import React from "react";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import useDarkMode from "use-dark-mode";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo/client";
import { lightTheme, darkTheme } from "../lib/Theme";
import { SemestersProvider } from "./Semesters";
import { WorkspaceProvider } from "./Workspace";

export default function Providers({ pageProps, children }) {
  const { value: isDark } = useDarkMode(false, {
    storageKey: null,
    onChange: null,
  });
  const apolloClient = useApollo(pageProps.initialApolloState);
  const theme = isDark ? darkTheme : lightTheme;

  /*
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const body = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SemestersProvider>{children}</SemestersProvider>
    </ThemeProvider>
  );

  // prevents ssr flash for mismatched dark mode
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{body}</div>;
  }
  */

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <SemestersProvider>
            <WorkspaceProvider>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                {children}
              </MuiPickersUtilsProvider>
            </WorkspaceProvider>
          </SemestersProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
