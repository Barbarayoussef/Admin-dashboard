import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { initFlowbite } from "flowbite";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
let schema = z.object({
  email: z.email("enter valid email"),
  password: z
    .string()
    .min(8, "password must be at least 8 characters long")
    .regex("/^[a-zA-Z0-9]{8-30}/"),
});
export default function Login() {
  let navigate = useNavigate();
  let { register, formState, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    initFlowbite();
  }, []);
  function doLogin(data) {
    axios
      .post("https://nti-ecommerce.vercel.app/api/v1/auth/signIn", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("token", res.data.token);
        navigate("/categories");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Login to your account
          </h2>
          <form
            onSubmit={handleSubmit(doLogin)}
            className="max-w-sm mx-auto border-2 border-default-medium rounded-base p-6"
          >
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2.5 text-sm font-medium text-heading"
              >
                Your email
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                placeholder="name@flowbite.com"
                required
              />
              {formState.errors.email && (
                <p className="text-red-500">{formState.errors.email.message}</p>
              )}
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2.5 text-sm font-medium text-heading"
              >
                Your password
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                placeholder="••••••••"
                required
              />
              {formState.errors.password && (
                <p className="text-red-500">
                  {formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
            >
              Submit
            </button>
            <label htmlFor="remember" className="flex items-center pt-5 ">
              <p className="ms-2 text-sm font-medium text-heading select-none">
                Do not have account{" "}
                <Link to="/register" className="text-fg-brand hover:underline">
                  register now
                </Link>
              </p>
            </label>
          </form>
        </div>
      </div>
    </>
  );
}
