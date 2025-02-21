import React, { useState, useEffect } from "react";
import { SpotlightBackground } from "../components/ui/SpotlightBackground";
import { useNavigate } from "react-router";
import Modal from "../Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { handleScrapeData } from "../redux/slices/productSlice";
import {
  updateBrowserEndPoint,
  updateResIdFrom,
  updateResIdTo,
} from "../redux/slices/globalValueSlice";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import { loadingGif } from "../assets";

const Hero = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const navigate = useNavigate();
  const [resIdFrom, setResIdFrom] = useState("");
  const [resIdTo, setResIdTo] = useState("");
  const [browserEndPoint, setBrowserEndPoint] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNavigate = (e, type) => {
    navigate(`/zomato?type=${type}`);
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const handleModalChange = (val) => {
    setShowModal(val);
  };

  const handleDataScrape = async () => {
    setLoading(true);
    dispatch(updateResIdFrom(resIdFrom));
    dispatch(updateResIdTo(resIdTo));
    dispatch(updateBrowserEndPoint(browserEndPoint));
    dispatch(handleScrapeData({ resIdFrom, browserEndPoint }));
    setLoading(false);
    navigate('/products');
  };

  const { menuData, isLoading, message } = useSelector((state) => state.menu);

  return (
    <div>
      {isLoading || loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <img src={loadingGif} />
        </div>
      ) : (
        <div className="w-full h-screen border-primary border-b-4  text-white bg-black bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
          <p className="font-bold bg-primary text-white text-center py-2">
            AI-DRIVEN AUTOMATION TOOL FOR RESTAURANT MENU UPLOAD & MANAGEMENT 🚀
          </p>

          <div className="sm:text-[18px] flex justify-center items-center md:text-[1.8rem] text-center w-full">
            <SpotlightBackground />
            <div className=" p-2 h-screen overflow-hidden md:my-20 my-6 text-white max-w-6xl  mx-auto relative z-10  w-full pt-12 md:pt-0">
              <h2 className="md:text-7xl text-2xl text-center font-extrabold">
                <span className="text-primary">Upload Your Restaurant’s </span>
                Menu on - <span className="text-red-600"> Zomato</span> with our
                Powerful Tool Powered with {""}
                <span className="underline">AI & Automation</span>
              </h2>

              <p className="text-[15px] md:text-[28px] text-center py-[24px] text-[#bebebe] font-black">
                ( Zero Hassle – Our Tool Handles Everything for You! )
              </p>

              <div className="flex justify-center items-center">
                <button
                  onClick={(e) => setShowModal(!showModal)}
                  className="border-2 border-primary bg-black mt-10 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#01a04b] transition-all duration-300"
                >
                  Menu Transfer
                </button>
                <button
                  onClick={(e) => handleNavigate(e, "upload")}
                  className="bg-primary ml-5 mt-10 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#01a04b] transition-all duration-300"
                >
                  Pdf Upload
                </button>
              </div>

              {showModal && (
                <Modal
                  isOpen={showModal}
                  content={
                    <div>
                      <div className="p-4 text-center">
                        <div className="w-full flex flex-col items-center space-y-2">
                          <input
                            type="text"
                            onChange={(e) => setResIdFrom(e.target.value)}
                            placeholder="Restaurant ID From..."
                            className="w-full px-4 text-sm py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            onChange={(e) => setResIdTo(e.target.value)}
                            placeholder="Restaurant ID To..."
                            className="w-full px-4 my-4 text-sm py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            onChange={(e) => setBrowserEndPoint(e.target.value)}
                            placeholder="Enter Browser End Point..."
                            className="w-full text-sm mt-4 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex pt-10 justify-center items-center space-x-4">
                            <button className="bg-red-500 text-white text-sm px-3 py-2 rounded-md">
                              Cancel
                            </button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={handleDataScrape}
                              className="px-6 py-2 rounded-md text-sm bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
                            >
                              <CloudUpload /> Start Scraping
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  stillOpen={(val) => handleModalChange(val)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
