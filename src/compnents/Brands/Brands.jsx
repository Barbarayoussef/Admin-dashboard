import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
let schema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
});
export default function Brands() {
  let { register, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schema),
  });
  return <></>;
}
