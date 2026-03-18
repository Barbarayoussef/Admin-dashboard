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

import "./App.css";

function App() {
  let routes = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
    {
      path: "/",
      element: <BlankLayout />,
      children: [
        { path: "categories", element: <Categories /> },
        { path: "subcategories", element: <SubCategories /> },
        { path: "products", element: <Products /> },
        { path: "orders", element: <Orders /> },
        { path: "brands", element: <Brands /> },
        { path: "coupons", element: <Coupons /> },
        { path: "product", element: <Product /> },
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
