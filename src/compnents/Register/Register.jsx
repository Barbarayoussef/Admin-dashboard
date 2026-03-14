import React from "react";
import styles from "./Register.module.css"
import {useForm} from 'react-hook-form'
import z from 'zod'

let schema = z.object({
  name:z.string().min(3,"Name Minimum 3 Charecters").max(30,"Name Max 30 Charecters"),
  email:z.string().email("please Enter Valid Email"),
  password:z.regex()
})


export default function Register() {

  let registerForm = useForm({
    defualtVslues:{
      "name": " ",
      "email": "",
      "password": ""
    },
    resolver:zodResolver(schema)
  })

  return <div>Register</div>;
}
