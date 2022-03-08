import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

// layouts

import Admin from "layouts/Admin";
import Auth from "layouts/Auth";

// views without layouts

import Landing from "views/Landing";
import Profile from "views/Profile";
import Index from "views/Index";
import Search from "views/search";
import { gql } from "@apollo/client";

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

// const ClientRoutes = [
//   <Route key={1} path="/" exact>
//     <Restaurants />
//   </Route>,
//   <Route key={2} path="/confirm">
//     <ConfirmEmail />
//   </Route>,
//   <Route key={3} path="/edit-profile">
//     <EditProfile />
//   </Route>,
//   <Route key={4} path="/search">
//     <Search />
//   </Route>,
// ];

export const LoggedInRouter = () => {
  // const { data, loading, error } = useQuery(ME_QUERY);
  // if (!data || loading || error) {
  //   return (
  //     <div className="h-screen flex justify-center items-center">
  //       <span className="font-medium text-xl tracking-wide">Loading...</span>
  //     </div>
  //   );
  // }
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
