import React, { use } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { initFlowbite } from "flowbite";

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
export default function Products() {
  let [isModalOpen, setIsModalOpen] = React.useState(false);
  let [products, setProducts] = React.useState([]);
  let [subCategories, setSubCategories] = React.useState([]);
  let [categories, setCategories] = React.useState([]);
  let [brands, setBrands] = React.useState([]);
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
  function openModal() {
    setIsModalOpen(true);
  }
  function fetchProducts() {
    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/products")
      .then((res) => {
        console.log(res);
        setProducts(res.data.Products);
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
    fetchProducts();
    fetchCategories();
    fetchBrands();
    initFlowbite();
  }, []);
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
  function submitProduct(form) {
    console.log("hi");

    let formData = new FormData();
    console.log(form, "form");

    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("subcategory", form.subcategory);
    formData.append("brand", form.brand);
    if (form.imageCover) {
      formData.append("imageCover", form.imageCover);
    }
    formData.append("stock", form.stock);
    if (form.images && form.images.length > 0) {
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i]);
      }
    }

    axios
      .post("https://nti-ecommerce.vercel.app/api/v1/products", formData, {})
      .then(() => {
        console.log(formData);
        fetchProducts();
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold my-5">Products Control</h1>
        <button
          onClick={openModal}
          type="button"
          className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          Add Product
        </button>
      </div>
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
      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
            <tr>
              <th scope="col" class="px-6 py-3 font-medium">
                Title
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Price
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Description
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Category
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Subcategory
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Brand
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Image Cover
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Images
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr class="bg-neutral-primary border-b border-default">
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-heading whitespace-nowrap"
                >
                  {product.title}
                </td>
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-heading whitespace-nowrap"
                >
                  {product.price}
                </td>
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-heading whitespace-nowrap"
                >
                  {product.description}
                </td>
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-heading whitespace-nowrap"
                >
                  {product.stock}
                </td>
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-heading whitespace-nowrap"
                >
                  {categories.find((c) => c._id === product.category)?.name}
                </td>
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-heading whitespace-nowrap"
                >
                  {
                    subCategories.find((c) => c._id === product.subcategory)
                      ?.name
                  }
                </td>
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-heading whitespace-nowrap"
                >
                  {brands.find((c) => c._id === product.brand)?.name}
                </td>
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-heading whitespace-nowrap"
                >
                  <img src={product.imageCover} alt="" />
                </td>
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-heading whitespace-nowrap"
                >
                  {product.images.map((image) => (
                    <img src={image} alt="" />
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
