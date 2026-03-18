import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

let schema = z.object({
  title: z.string().min(4, "Name must be at least 4 characters"),
  price: z.number().min(3, "Price must be greater than 0"),
  description: z.string().min(5, "Name must be at least 4 characters"),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().min(1, "Please select a subcategory"),
  brand: z.string().min(1, "Please select a brand"),
  imageCover: z.any().optional(),
  stock: z.number().min(1, "Stock must be greater than 0"),
  images: z.array(z.any()).optional(),
});
export default function Product() {
  let { state } = useLocation();
  let { product } = state || {};
  let [subCategories, setSubCategories] = useState([]);
  let [categories, setCategories] = useState([]);
  let [brands, setBrands] = useState([]);
  let [isModalOpen, setIsModalOpen] = useState(false);
  let navigate = useNavigate();

  let { register, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      price: 0,
      description: "",
      category: "",
      subcategory: "",
      brand: "",
      imageCover: null,
      stock: 0,
      images: [],
    },
    resolver: zodResolver(schema),
  });

  function openModal(product) {
    setIsModalOpen(true);
    reset({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      imageCover: product.imageCover,
      stock: product.stock,
      images: product.images,
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
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nti-ecommerce.vercel.app/api/v1/categories/${categoryId}/subCategories`,
      );

      setSubCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);
  function submitProduct(data) {
    let formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    formData.append("brand", data.brand);
    if (data.imageCover) {
      formData.append("imageCover", data.imageCover);
    }
    formData.append("stock", data.stock);
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }
    axios
      .put(
        `https://nti-ecommerce.vercel.app/api/v1/products/${product._id}`,
        formData,
      )
      .then((res) => {
        console.log(res);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (!product) {
    return (
      <div className="p-10 text-center">
        No product data found. Please return to the product list.
      </div>
    );
  }
  function deleteProduct(id) {
    axios
      .delete(`https://nti-ecommerce.vercel.app/api/v1/products/${id}`)
      .then((res) => {
        navigate("/products");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {isModalOpen && (
        <div
          id="product-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/50"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <h3 className="text-lg font-medium text-heading">
                  Create New Product
                  {/* {productInfo ? "Update Product" : "Create New Product"} */}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* */}
              <form onSubmit={handleSubmit(submitProduct)}>
                <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                  {/* Title */}
                  <div className="col-span-2">
                    <label
                      htmlFor="title"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Title
                    </label>
                    <input
                      {...register("title")}
                      type="text"
                      id="title"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                      placeholder="Product Title"
                    />
                    {formState.errors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="col-span-1">
                    <label
                      htmlFor="price"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Price
                    </label>
                    <input
                      {...register("price", { valueAsNumber: true })}
                      type="number"
                      id="price"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
                      placeholder="0.00"
                    />
                    {formState.errors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {formState.errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="col-span-1">
                    <label
                      htmlFor="stock"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Stock
                    </label>
                    <input
                      {...register("stock", { valueAsNumber: true })}
                      type="number"
                      id="stock"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
                      placeholder="Quantity"
                    />
                    {formState.errors.stock && (
                      <p className="text-red-500 text-xs mt-1">
                        {formState.errors.stock.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      id="description"
                      rows="3"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
                      placeholder="Product details..."
                    ></textarea>
                    {formState.errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="col-span-1">
                    <label
                      htmlFor="category"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Category
                    </label>
                    <select
                      {...register("category", {
                        onChange: (e) => handleCategoryChange(e),
                      })}
                      id="category"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}{" "}
                    </select>
                    {formState.errors.category && (
                      <p className="text-red-500 text-xs mt-1">
                        {formState.errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Subcategory */}
                  <div className="col-span-1">
                    <label
                      htmlFor="subcategory"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Subcategory
                    </label>
                    <select
                      {...register("subcategory")}
                      disabled={subCategories.length === 0}
                      id="subcategory"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5"
                    >
                      <option value="">Select Subcategory</option>
                      {subCategories.map((subcat) => (
                        <option key={subcat._id} value={subcat._id}>
                          {subcat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand */}
                  <div className="col-span-2">
                    <label
                      htmlFor="brand"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Brand
                    </label>
                    <select
                      {...register("brand")}
                      id="subcategory"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Image Cover */}
                  <div className="col-span-1">
                    <label
                      htmlFor="imageCover"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Image Cover
                    </label>
                    <input
                      {...register("imageCover")}
                      type="file"
                      id="imageCover"
                      className="block w-full text-sm text-heading file:mr-4 file:py-2 file:px-4 file:rounded-base file:border-0 file:text-sm file:font-semibold file:bg-neutral-tertiary file:text-heading hover:file:bg-neutral-hover"
                    />
                  </div>

                  {/* Images (Multiple) */}
                  <div className="col-span-1">
                    <label
                      htmlFor="images"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Product Images
                    </label>
                    <input
                      {...register("images")}
                      type="file"
                      id="images"
                      multiple
                      className="block w-full text-sm text-heading file:mr-4 file:py-2 file:px-4 file:rounded-base file:border-0 file:text-sm file:font-semibold file:bg-neutral-tertiary file:text-heading hover:file:bg-neutral-hover"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                  >
                    Add Product
                    {/* {productInfo ? "Update Product" : "Add Product"} */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-neutral-primary-soft p-6 rounded-base border border-default shadow-sm">
          {/* --- LEFT SIDE: IMAGES --- */}
          <div className="space-y-4">
            {/* Main Cover Image */}
            <div className="aspect-square overflow-hidden rounded-base border border-default bg-white">
              <img
                src={product.imageCover}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images?.map((img, idx) => (
                <div
                  key={idx}
                  className="w-24 h-24 flex-shrink-0 border border-default rounded-base overflow-hidden bg-white hover:border-brand cursor-pointer transition-colors"
                >
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT SIDE: PRODUCT INFO --- */}
          <div className="flex flex-col">
            <nav className="text-sm mb-4 text-body">
              <span>
                Category :
                {categories.find((c) => c._id === product.category)?.name}
              </span>
              <span className="mx-2">
                Subcategory:{" "}
                {subCategories.find((s) => s._id === product.subcategory)?.name}
              </span>
              <span className="text-brand font-medium">
                {brands.find((b) => b._id === product.brand)?.name}
              </span>
            </nav>

            <h1 className="text-3xl font-bold text-heading mb-2">
              {product.title}
            </h1>

            <div className="flex items-center mb-6">
              <span className="text-2xl font-semibold text-brand">
                ${product.price}
              </span>
              <span
                className={`ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            <div className="border-t border-default pt-6">
              <h3 className="text-sm font-medium text-heading mb-4">
                Description
              </h3>
              <p className="text-body leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="mt-auto pt-10 flex gap-4">
              <button
                onClick={() => openModal(product)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                title="Edit product"
              >
                <i className="fa-solid fa-pen-to-square text-lg"></i>
              </button>

              <button
                onClick={() => deleteProduct(product._id)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                title="Delete product"
              >
                <i className="fa-solid fa-trash text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
