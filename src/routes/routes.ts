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
import Layout from '@/layouts/Layout';
import OrdersList from '@/pages/Orders/List/OrdersList';
import OrdersEdit from '@/pages/Orders/Edit/OrdersEdit';
import OrdersCreate from '@/pages/Orders/Create/OrdersCreate';

export interface Routes {
  path: string,
  name: string,
  icon: string,
  component: any,
  layout: string,
}

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "orders",
        name: "Orders List",
        icon: "nc-icon nc-notes",
        component: OrdersList,
        layout: "",
        sibebar: true
      },
      {
        path: "orders/new",
        name: "Orders Create",
        component: OrdersCreate,
        layout: ""
      },
      {
        path: "orders/edit/:id",
        name: "Orders Edit",
        component: OrdersEdit,
        layout: "",
      }
    ]
  }
];

export default routes;
