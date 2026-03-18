import { createBrowserRouter, Route } from "react-router-dom";
import AuthLayout from "./compnents/AuthLayout/AuthLayout";
import BlankLayout from "./compnents/BlankLayout/BlankLayout";
import Login from "./compnents/Login/Login";
import Register from "./compnents/Register/Register";
import Categories from "./compnents/Categories/Categories";
import SubCategories from "./compnents/SubCategories/SubCategories";
import Products from "./compnents/Products/Products";
import Orders from "./compnents/Orders/Orders";
import Brands from "./compnents/Brands/Brands";
import Coupons from "./compnents/Coupons/Coupons";
import Product from "./compnents/Product/Product";
import { RouterProvider } from "react-router-dom";
import UserRoutes from "./compnents/UserRoutes/UserRoutes";
import GuestRoutes from "./compnents/GuestRoutes/GuestRoutes";

import "./App.css";

function App() {
  let routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <GuestRoutes>
          <AuthLayout />
        </GuestRoutes>
      ),
      children: [
        {
          path: "login",
          element: (
            <GuestRoutes>
              <Login />
            </GuestRoutes>
          ),
        },
        {
          path: "register",
          element: (
            <GuestRoutes>
              <Register />{" "}
            </GuestRoutes>
          ),
        },
      ],
    },
    {
      path: "/",
      element: (
        <UserRoutes>
          <BlankLayout />
        </UserRoutes>
      ),
      children: [
        {
          path: "categories",
          element: (
            <UserRoutes>
              <Categories />
            </UserRoutes>
          ),
        },
        {
          path: "subcategories",
          element: (
            <UserRoutes>
              <SubCategories />
            </UserRoutes>
          ),
        },
        {
          index: true,
          element: (
            <UserRoutes>
              <Products />
            </UserRoutes>
          ),
        },
        {
          path: "orders",
          element: (
            <UserRoutes>
              <Orders />
            </UserRoutes>
          ),
        },
        {
          path: "brands",
          element: (
            <UserRoutes>
              <Brands />
            </UserRoutes>
          ),
        },
        {
          path: "coupons",
          element: (
            <UserRoutes>
              <Coupons />
            </UserRoutes>
          ),
        },
        {
          path: "product",
          element: (
            <UserRoutes>
              <Product />
            </UserRoutes>
          ),
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
