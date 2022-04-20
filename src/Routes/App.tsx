import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ButtonAppBar from "../components/Header";
import { Dashboard } from "../pages/Dashboard";

export const App = () => {
  const [NFTs, setNFT] = useState([]);
  const [Assets, setAssets] = useState([]);
  const [Account, setAccount] = useState("");

  return (
    <>
      <BrowserRouter>
          <ButtonAppBar setNFT = {setNFT} setAssets = {setAssets} setAccount = {setAccount}/>
          <Routes>
            <Route path="/" element={<Dashboard NFTs = {NFTs} Assets = {Assets} Account = {Account}/>} />
          </Routes>
      </BrowserRouter>
    </>
  );
};
