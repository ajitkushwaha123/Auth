import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UploadMenu } from "./UploadMenu";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import ProductTable from "../zomatoExtension/Table/ProductTable";
import AutomationButton from "./AutomationButton";
import {
  handleMenuUpload,
  handleScrapeData,
  updateMenuData,
} from "../redux/slices/productSlice";
import { JsonData } from "./JsonData";
import CodeEditor from "./CodeEditor";

const ZomatoExtensionPage = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const handleFileChange = (file) => {
    console.log("file", file);
    setFile(file);
  };

  const handleDataScrape = async () => {
    await dispatch(handleScrapeData({ url: "sd" }));
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("menu", file[0]);

      await dispatch(handleMenuUpload(formData))
        .unwrap()
        .then((response) => {
          console.log("File uploaded successfully", response);
        })
        .catch((error) => {
          console.error("File upload failed", error);
        });
    } else {
      alert("Please select a file to upload.");
    }
  };

  const { menuData, message, isLoading, error } = useSelector(
    (state) => state.menu
  );


  const filters = {
    // category: "Breads",
    // food_type: "non_veg",
    item_type: "goods",
    sub_category : "Coffee",
  };

  return (
    <div className="min-h-screen p-20 w-full flex flex-col bg-[#000] items-center justify-center">
      <UploadMenu onUpload={handleFileChange} />

      <motion.button
        onClick={handleFileUpload}
        whileTap={{ scale: 0.9 }}
        className={`inline-flex ${
          isLoading ? "animate-shimmer" : ""
        } mt-10 h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors duration-200 ease-in-out hover:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] hover:text-slate-200`}
        disabled={isLoading}
      >
        <CloudUpload />
        <span className="ml-2">{isLoading ? "Loading..." : "Upload"}</span>
      </motion.button>

      <motion.button
        onClick={handleDataScrape}
        whileTap={{ scale: 0.9 }}
        className={`inline-flex ${
          isLoading ? "animate-shimmer" : ""
        } mt-10 h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors duration-200 ease-in-out hover:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] hover:text-slate-200`}
        disabled={isLoading}
      >
        <CloudUpload />
        <span className="ml-2">{isLoading ? "Loading..." : "Hello"}</span>
      </motion.button>

      {/* <JsonData /> */}
      <CodeEditor code={menuData} />

      {/* <div>  </div> */}

      {message && <div className="mt-4 text-slate-200">{message}</div>}

      <div className="pt-20 pb-8 flex flex-col justify-center items-center w-full">
        <div className=" w-full">
          <ProductTable users={menuData} />
        </div>

        <AutomationButton data={menuData} />

        <Link to={`/menu`}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`inline-flex ${
              isLoading ? "animate-shimmer" : ""
            } mt-10 h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors duration-200 ease-in-out hover:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] hover:text-slate-200`}
          >
            <CloudUpload />
            <span className="ml-2">
              {isLoading ? "Loading..." : "View Menu"}
            </span>
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default ZomatoExtensionPage;
