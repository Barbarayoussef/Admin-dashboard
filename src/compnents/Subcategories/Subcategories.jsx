import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { initFlowbite } from "flowbite";
let schema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  category: z.string().min(1, "Please select a category"),
});
export default function Subcategories() {
  let [isModalOpen, setIsModalOpen] = React.useState(false);
  let [subCategories, setSubCategories] = React.useState([]);
  let [categories, setCategories] = React.useState([]);
  let [subcategoryInfo, setSubcategoryInfo] = React.useState(null);
  let { register, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      category: "",
    },
    resolver: zodResolver(schema),
  });
  function fetchSubcategories() {
    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/subCategories", {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setSubCategories(res.data.categories);
      })
      .catch((err) => {
        console.log(err);
      });
  }
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
    fetchSubcategories();
    fetchCategories();
    initFlowbite();
  }, []);
  function openModal(subcategory) {
    if (subcategory && subcategory.name) {
      setSubcategoryInfo(subcategory);
      reset({
        name: subcategory.name,
        category: subcategory.category,
      });
    } else {
      setSubcategoryInfo(null);
      reset({ name: "", category: "" });
    }
    setIsModalOpen(true);
  }
  function submitSubcategory(form) {
    console.log(form);
    if (subcategoryInfo) {
      axios
        .put(
          `https://nti-ecommerce.vercel.app/api/v1/subCategories/${subcategoryInfo._id}`,
          form,
        )
        .then(() => {
          fetchSubcategories();
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post("https://nti-ecommerce.vercel.app/api/v1/subCategories", form)
        .then(() => {
          fetchSubcategories();
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  function deleteSubcategory(subId) {
    axios
      .delete(
        `https://nti-ecommerce.vercel.app/api/v1/subCategories/${subId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      )
      .then(() => {
        fetchSubcategories();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold my-5">SubCategories Control</h1>
        <button
          onClick={openModal}
          type="button"
          className=" text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          Add Subcategory
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
                  {subcategoryInfo
                    ? "Edit Subcategory"
                    : "Create new Subcategory"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                >
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <form onSubmit={handleSubmit(submitSubcategory)}>
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
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Category
                    </label>
                    <select
                      {...register("category")}
                      className="bg-neutral-secondary-medium border border-default-medium text-sm rounded-base block w-full px-3 py-2.5"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {formState.errors.category && (
                      <p className="text-red-500 text-xs mt-1">
                        {formState.errors.category.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center  text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                  >
                    {subcategoryInfo
                      ? "Update Subcategory"
                      : "Add new Category"}
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
                Subcategory Name{" "}
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Category
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((subCategory) => {
              return (
                <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {subCategory.name}
                  </th>
                  <td className="px-6 py-4 size-54 ">
                    {categories.find((cat) => cat._id === subCategory.category)
                      ?.name || "Loading..."}
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <button
                      onClick={() => openModal(subCategory)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      title="Edit Category"
                    >
                      <i className="fa-solid fa-pen-to-square text-lg"></i>
                    </button>

                    <button
                      onClick={() => deleteSubcategory(subCategory._id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      title="Delete Category"
                    >
                      <i className="fa-solid fa-trash-can text-lg"></i>
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
