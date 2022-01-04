import React, { Component } from "react";
import gif1 from "../assets/gif1.gif";
import gif2 from "../assets/gif2.gif";
import gif3 from "../assets/gif3.gif";

export class LandingComponent extends Component {
  render() {
    return (
      <>
        <div class="flex sm:h-screen">
          <div class="w-2/3 sm:h-screen flex flex-col items-center justify-center  py-10 px-5">
            <h1 class="w-2/3 font-mono  font-extrabold text-6xl ">
              launchpad.
            </h1>
            <p class="w-2/3 font-light">
              A no-code solution for artwork generation, decentralized storage &
              distribution of NFTs.
            </p>
            <div class="flex items-center pt-10 w-2/3">
              <img class="w-1/3" src={gif1}></img>
              <img class="w-1/3" src={gif2}></img>
              <img class="w-1/3" src={gif3}></img>
            </div>
          </div>
          <div class="w-1/3 sm:h-screen flex flex-col items-center justify-center bg-gray-900 py-10 px-5 pb-80">
            <h1 class="w-2/3 text-white font-mono">Welcome!</h1>
            <p class="w-2/3 text-white">Sign in with your wallet to continue</p>
            <button
              type="button"
              class="w-2/3 text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2"
            >
              Connect with ICONex
            </button>
          </div>
        </div>
        <div class="flex sm:h-screen">
          <div class="w-2/3 sm:h-screen flex flex-col items-center justify-center  py-10 px-5">
            <h1 class="w-2/3 font-mono  font-extrabold text-6xl ">
              How does it work?
            </h1>
            <div class="pb-fluid-video w-2/3 h-2/3 pt-6">
              <iframe
                class="w-full h-full"
                src="https://www.youtube.com/embed/CsGH9eKdmZU"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LandingComponent;
