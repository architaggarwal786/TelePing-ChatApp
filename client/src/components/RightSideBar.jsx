import React from "react";
import assets, { imagesDummyData } from "../assets/assets";

const RightSideBar = ({ selectedUser }) => {
  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full relative oberflow-y-scroll${
          selectedUser ? "max-md-hidden" : ""
        }}`}
      >
        <div className="flex flex-col items-center  mx-auto text-xs font-light pt-16 gap-2">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 aspect-auto rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            <p className="w-2 h-2 rounded-full bg-green-500"></p>
            {selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>
        <hr className="border-[#ffffff50] my-4" />
        <div className="px-5 text-xs">
          <p>
            Media
            <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
              {imagesDummyData.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="cursor-pointer rounded "
                >
                  <img src={url} alt="" className="h-full rounded-md" />
                </div>
              ))}
            </div>
          </p>
        </div>
        <button className=" absolute bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer  bottom-5  left-1/2 transform -translate-x-1/2">Logout</button>
      </div>
    )
  );
};

export default RightSideBar;
