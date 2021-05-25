/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";

// import AdminNavbar from "components/Navbars/AdminNavbar";
// import Footer from "components/Footer/Footer";
import Sidebar from "@/components/Sidebar/Sidebar";
// import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes, { Routes } from "@/routes/routes";

import sidebarImage from "@/assets/img/sidebar-3.jpg";

const Layout: React.FC = (layoutProp: any) => {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const getRoutes = () => {
    return layoutProp.childrenRoutes.map( (prop, key) => {
      return (
        <Route
          exact
          path={layoutProp.match.path + prop.path}
          render={ (props) => <prop.component {...props} /> }
          key={`${layoutProp.childrenKey}${key}`}
        >
        </Route>
      );
    })
  };
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    if ( document.scrollingElement ) document.scrollingElement.scrollTop = 0;
    // if ( mainPanel && mainPanel.current )  mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      if ( element && element.parentNode )  element.parentNode.removeChild(element);
    }
  }, [location]);
  return (
    <>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
        <div className="main-panel" ref={mainPanel}>
          <div className="content">
            <Switch>
              {getRoutes()}
              <Redirect from="/" to="/orders" />
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
