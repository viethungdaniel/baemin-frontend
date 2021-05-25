import React, { Component } from "react";
import { useLocation, NavLink, Route } from "react-router-dom";
import { Nav } from "react-bootstrap";

// import * as logo from "@/assets/img/reactlogo.png";
let logo = "/"

interface Props {
  color: string;
  image: string;
  routes: Route
}


const Sidebar: React.FC<Props> = ({ color, image, routes }) => {
  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          {/* <a
            href="https://www.creative-tim.com?ref=lbd-sidebar"
            className="simple-text logo-mini mx-1"
          >
            <div className="logo-img">
              <img
                src={require("@/assets/img/reactlogo.png").default}
                alt="..."
              />
            </div>
          </a> */}
          <NavLink
            to="/orders"
            className="simple-text"
          >
            BAEMIN ORDERS SERVICE
          </NavLink>
        </div>
        <Nav>
          {
            routes.map((r_prop: any, r_key: any) => {
              if (!r_prop.redirect) {
                if ( r_prop.children ) {
                  return r_prop.children.filter( (prop: any) => prop.sibebar ).map((prop: any, key: any) => {
                    return (
                      <li
                        className={
                          prop.upgrade
                            ? "active active-pro"
                            : activeRoute(prop.path)
                        }
                        key={key}
                      >
                        <NavLink
                          to={r_prop.path + prop.path}
                          className="nav-link"
                          activeClassName="active"
                        >
                          <i className={prop.icon} />
                          <p>{prop.name}</p>
                        </NavLink>
                      </li>
                    );
                  })
                }
              }
              return null;
            })
          }
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
