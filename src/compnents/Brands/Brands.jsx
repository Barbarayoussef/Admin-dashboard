import React, { use } from "react";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { initFlowbite } from "flowbite";
import { useEffect } from "react";
let schema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
});
export default function Brands() {
  let [brands, setBrands] = React.useState([]);
  let [isModalOpen, setIsModalOpen] = React.useState(false);
  let [brandInfo, setBrandInfo] = React.useState(null);
  let { register, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schema),
  });
  function fetchBrands() {
    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/brands")
      .then((res) => {
        console.log(res);
        setBrands(res.data.brands);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    fetchBrands();
    initFlowbite();
  }, []);
  function openModal(brand) {
    if (brand && brand.name) {
      setBrandInfo(brand);
      reset({ name: brand.name });
    } else {
      setBrandInfo(null);
      reset({ name: "" });
    }
    setIsModalOpen(true);
  }
  function submitBrand(data) {
    if (brandInfo) {
      console.log("hii", data);

      axios
        .put(
          `https://nti-ecommerce.vercel.app/api/v1/brands/${brandInfo._id}`,
          data,
        )
        .then((res) => {
          fetchBrands();
          setIsModalOpen(false);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(`https://nti-ecommerce.vercel.app/api/v1/brands`, data)
        .then((res) => {
          fetchBrands();
          setIsModalOpen(false);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  function deleteBrand(id) {
    axios
      .delete(`https://nti-ecommerce.vercel.app/api/v1/brands/${id}`)
      .then((res) => fetchBrands())
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold my-5">Brands Control</h1>
        <button
          onClick={openModal}
          type="button"
          className=" text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          Add Brand
        </button>
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
                    {brandInfo ? "Update" : "Create new Category"}
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
                <form onSubmit={handleSubmit(submitBrand)}>
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
                  </div>
                  <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                    <button
                      type="submit"
                      className="inline-flex items-center  text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                      {brandInfo ? "Edit" : "Add new Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
            <tr>
              <th scope="col" class="px-6 py-3 font-medium">
                Brand name
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => {
              return (
                <tr class="bg-neutral-primary border-b border-default">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {brand.name}
                  </th>
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <button
                      onClick={() => openModal(brand)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      title="Edit Category"
                    >
                      <i className="fa-solid fa-pen-to-square text-lg"></i>
                    </button>

                    <button
                      onClick={() => deleteBrand(brand._id)}
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
