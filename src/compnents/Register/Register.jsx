import React from "react";
import styles from "./Register.module.css"
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useFormik } from "formik";
import { initFlowbite } from "flowbite";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Yup from "yup"


let schema = z.object({
  name: z
    .string()
    .min(3, "Name Minimum 3 Characters")
    .max(30, "Name Max 30 Characters"),

  email: z
    .string()
    .email("please Enter Valid Email"),

  password: z
  .string()
  .regex(/^[A-Za-z0-9]{8,30}$/, "Password must be alphanumeric and 8-30 characters"),
});

export default function Register() {

  let navigate = useNavigate();

let {register, formState, handleSubmit} = useForm({
    defaultValues:{
      name: "",
      email: "",
      password: "",
    },
        resolver: zodResolver(schema),
    
  })
  useEffect(() => {
      initFlowbite();
    }, []);


  function doRegister(data) {
    axios
      .post("https://nti-ecommerce.vercel.app/api/v1/auth/signUp", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("token", res.data.token);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
  <>
    <main className="flex items-center justify-center min-h-screen"> 
    <div className=" w-full max-w-sm bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs">
    <form  onSubmit={handleSubmit(doRegister)} >
        <h5 className="text-xl font-semibold text-heading mb-6">Register Now</h5>
         <div className="mb-4">
            <label htmlFor="name" className="block mb-2.5 text-sm font-medium text-heading">Enter Your Name</label>
            <input {...register("name")} type="text" id="name" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" />
         {formState.errors.name && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {formState.errors.name.message}
                </p>
              )}
        </div>
        <div className="mb-4">
            <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-heading">Your email</label>
            <input  
            {...register("email")} type="email" id="email" className={`block w-full px-3 py-2.5 rounded-base border ${
                  formState.errors.email
                    ? "border-red-500"
                    : "border-default-medium"
                } bg-neutral-secondary-medium`}
                 placeholder="example@company.com" />
                 
             {formState.errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {formState.errors.email.message}
                </p>
              )}

        </div>
        <div >
            <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-heading"
                >Your password</label>

            <input {...register("password")} type="password" id="password"
             className={`block w-full px-3 py-2.5 rounded-base border my-5 ${
                  formState.errors.email
                    ? "border-red-500"
                    : "border-default-medium"
                } bg-neutral-secondary-medium`} placeholder="•••••••••" />
              {formState.errors.password && (
                <p className="text-red-500">
                  {formState.errors.password.message}
                </p>
              )}
        </div>
        
        <button type="submit" className="my-10text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3">Submit</button>
    </form>
</div>
</main>
    <div>Register</div>
  </>
  )


}
