import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/assets/css/animate.min.css";
import "@/assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "@/assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "@/styles/_override.scss";
import routes, { Routes } from "@/routes/routes";
// import Layout from "@/layouts/Layout";
const redirect = <Redirect from="/" to="/orders" />;

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {
        routes.map( (prop, key) => {
          if ( prop.children )
            return (
              <Route 
                path={prop.path}
                render={ (props) => <prop.component {...props} childrenRoutes={prop.children} childrenKey={key} /> } 
                key={key}
              /> 
            )
          return (
            <Route 
              exact
              path={prop.path}
              render={ (props) => <prop.component {...props} /> } 
              key={key}
            />
          )
        })
      }
      {/* <Route path="/" render={ (props) => <Layout {...props} />} />
      <Redirect from="/" to="/orders" /> */}
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
