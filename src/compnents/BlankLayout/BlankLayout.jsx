import React from "react";
import { Link, Outlet } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { initFlowbite } from "flowbite";

export default function BlankLayout() {
  let navigate = useNavigate();
  useEffect(() => {
    initFlowbite();
  }, []);
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  const navItemStyles = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
    }`;
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-neutral-primary-soft border-b border-default">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="top-bar-sidebar"
                data-drawer-toggle="top-bar-sidebar"
                aria-controls="top-bar-sidebar"
                type="button"
                className="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none"
              >
                <span className="sr-only">Open sidebar</span>
              </button>
              <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
                Admin Dashboard
              </span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user photo"
                    />
                  </button>
                </div>
                <div
                  className="z-50 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44"
                  id="dropdown-user"
                >
                  <div
                    className="px-4 py-3 border-b border-default-medium"
                    role="none"
                  >
                    <p className="text-sm font-medium text-heading" role="none">
                      Neil Sims
                    </p>
                  </div>
                  <ul className="p-2 text-sm text-body font-medium" role="none">
                    <li>
                      <button
                        onClick={logout}
                        className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="top-bar-sidebar"
        className="fixed top-5 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default">
          <span className="self-center text-lg text-heading font-semibold whitespace-nowrap">
            Admin Dashboard
          </span>

          <ul className="space-y-2 font-medium">
            <li>
              <NavLink to="/categories" className={navItemStyles}>
                <i className="fa-solid fa-layer-group w-5 text-center"></i>
                <span className="ms-3">Categories</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/subCategories" className={navItemStyles}>
                <i className="fas fa-tags w-5 text-center"></i>
                <span className="ms-3">Subcategories</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={navItemStyles}>
                <i className="fas fa-box-open w-5 text-center"></i>
                <span className="ms-3">Products</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/coupons" className={navItemStyles}>
                <i className="fas fa-ticket-alt w-5 text-center"></i>
                <span className="ms-3">Coupons</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/orders" className={navItemStyles}>
                <i className="fas fa-shopping-cart w-5 text-center"></i>
                <span className="ms-3">Orders</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64 mt-14">
        <Outlet />
      </div>
    </>
  );
}
