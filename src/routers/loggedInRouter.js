import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

// layouts

import Admin from "../layouts/Admin";
import Auth from "../layouts/Auth";

// views without layouts

import Landing from "../views/Landing";
import Profile from "../views/Profile";
import Index from "../views/main";
import Search from "../views/search";

// import { gql } from "@apollo/client";

// const ME_QUERY = gql`
//   query meQuery {
//     me {
//       id
//       email
//       role
//       verified
//     }
//   }
// `;

export const LoggedInRouter = () => {
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
};
