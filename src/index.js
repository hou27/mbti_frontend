import React from "react";
import ReactDOM from "react-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";
import App from "./App";
import { Helmet, HelmetProvider } from "react-helmet-async";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <HelmetProvider>
        <Helmet>
          <title>MBTI others</title>
        </Helmet>
      </HelmetProvider>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
