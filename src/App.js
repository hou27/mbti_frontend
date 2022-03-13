import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts

import Admin from "./layouts/Admin";
import Auth from "./layouts/Auth";

// views without layouts

import Research from "./views/Research";
import Profile from "./views/Profile";
import Index from "./views/main";
import Search from "./views/search";
import { loggedInFlag } from "./apollo";
import { useReactiveVar } from "@apollo/client";

export default function App() {
  const isLoggedIn = useReactiveVar(loggedInFlag);
  // console.log(isLoggedIn);
  return (
    <BrowserRouter>
      <Switch>
        {/* add routes with layouts */}
        <Route path="/admin" component={Admin} />
        <Route path="/auth" component={Auth} />
        {/* add routes without layouts */}
        <Route path="/search" exact component={Search} />
        <Route path="/research/:id" exact component={Research} />
        <Route path="/profile/:id" exact component={Profile} />
        <Route path="/" exact component={Index} />
        {/* add redirect for first page */}
        <Redirect from="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
}
