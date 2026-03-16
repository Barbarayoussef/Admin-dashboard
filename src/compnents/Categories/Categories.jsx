import axios from "axios";
import { initFlowbite } from "flowbite";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ca } from "zod/v4/locales";

let schema = z.object({
  name: z.string().min(4, "Name must be at least 3 characters"),
  image: z.any().optional(),
});
export default function Categories() {
  let [categories, setCategories] = React.useState([]);
  let [isModalOpen, setIsModalOpen] = React.useState(false);
  let [categoryInfo, setCategoryInfo] = React.useState(null);
  let { register, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      image: "",
    },
    resolver: zodResolver(schema),
  });

  function fetchCategories() {
    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/categories", {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    fetchCategories();
    initFlowbite();
  }, []);
  function openModal(category) {
    console.log(category);

    if (category && category.name) {
      console.log("hi");

      setCategoryInfo(category);
      reset({
        name: category.name,
      });
    } else {
      console.log("hiii");

      setCategoryInfo(null);
    }
    setIsModalOpen(true);
  }
  function submitCategory(form) {
    // console.log(form);
    let formData = new FormData();

    formData.append("name", form.name);
    if (form.image && form.image[0]) {
      formData.append("image", form.image[0]);
    }
    if (categoryInfo) {
      console.log(categoryInfo);

      axios
        .put(
          `https://nti-ecommerce.vercel.app/api/v1/categories/${categoryInfo._id}`,
          formData,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          },
        )
        .then(() => {
          fetchCategories();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsModalOpen(false);
        });
    } else {
      axios
        .post("https://nti-ecommerce.vercel.app/api/v1/categories", formData, {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then(() => {
          fetchCategories();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsModalOpen(false);
        });
    }
  }

  function deleteCategory(id) {
    axios
      .delete(`https://nti-ecommerce.vercel.app/api/v1/categories/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(() => {
        fetchCategories();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold my-5">Categories Control</h1>
        <button
          onClick={openModal}
          type="button"
          className=" text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          Add Category
        </button>
      </div>

      {/* <!-- Main modal --> */}
      {isModalOpen && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            {/* <!-- Modal content --> */}
            <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
              {/* <!-- Modal header --> */}
              <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <h3 className="text-lg font-medium text-heading">
                  {categoryInfo ? "Update" : "Create new Category"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="crud-modal"
                >
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <form onSubmit={handleSubmit(submitCategory)}>
                <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      name="name"
                      id="name"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                      placeholder="Type Category name"
                    />
                  </div>
                  {formState.errors.name && (
                    <p className="text-red-500">
                      {formState.errors.name.message}
                    </p>
                  )}
                  <div className="col-span-2">
                    <label
                      htmlFor="file"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Image
                    </label>
                    <input
                      {...register("image")}
                      type="file"
                      name="image"
                      id="image"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                      placeholder="Type product name"
                    />
                    {formState.errors.image && (
                      <p className="text-red-500">
                        {formState.errors.image.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center  text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                  >
                    {categoryInfo ? "Edit" : "Add new Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="bg-neutral-secondary-soft border-b border-default">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                Category Name{" "}
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Image
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              return (
                <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {category.name}
                  </th>
                  <td className="px-6 py-4 size-54 ">
                    <img
                      src={category.image}
                      className="w-40 h-40 object-cover rounded"
                      alt={category.name}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        openModal(category);
                      }}
                      className="font-medium text-fg-brand hover:underline px-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        deleteCategory(category._id);
                      }}
                      className="font-medium text-fg-brand hover:underline"
                    >
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
