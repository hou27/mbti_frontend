import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts

import Admin from "./layouts/Admin";
import Auth from "./layouts/Auth";

// views without layouts

import Landing from "./views/Landing";
import Profile from "./views/Profile";
import Index from "./views/Index";
import Search from "./views/search";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { loggedInFlag } from "./apollo";

const IS_LOGGED_IN = gql`
  query test {
    isLoggedIn @client
  }
`;

export default function App() {
  const isLoggedIn = useReactiveVar(loggedInFlag);
  return (
    <BrowserRouter>
      <Switch>
        {/* add routes with layouts */}
        <Route path="/admin" component={Admin} />
        <Route path="/auth" component={Auth} />
        {/* add routes without layouts */}
        <Route path="/search" exact component={Search} />
        <Route path="/research" exact component={Landing} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/" exact component={Index} />
        {/* add redirect for first page */}
        <Redirect from="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
}
