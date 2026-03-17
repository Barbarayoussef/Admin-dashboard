import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { initFlowbite } from "flowbite";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^[a-zA-Z0-9]{8,30}$/,
      "Password must be alphanumeric and 8-30 chars",
    ),
});
export default function Login() {
  let navigate = useNavigate();
  let { register, formState, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
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
                className={`block w-full px-3 py-2.5 rounded-base border ${
                  formState.errors.email
                    ? "border-red-500"
                    : "border-default-medium"
                } bg-neutral-secondary-medium`}
                placeholder="name@flowbite.com"
              />
              {formState.errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {formState.errors.email.message}
                </p>
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
                className={`block w-full px-3 py-2.5 rounded-base border ${
                  formState.errors.email
                    ? "border-red-500"
                    : "border-default-medium"
                } bg-neutral-secondary-medium`}
                placeholder="••••••••"
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
