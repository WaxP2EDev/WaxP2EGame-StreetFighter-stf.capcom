
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useNavigate, useLocation } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { headerLinkData } from "../../config/constant";


import * as waxjs from "@waxio/waxjs/dist";

import './navbar.css';
export interface NFTProps {
  setNFT: (value: any) => void; // for function
  setAssets: (value: any) => void; // for function
  setAccount: (value: any) => void // for function
}


export default function ButtonAppBar({ setNFT, setAssets, setAccount}: NFTProps) {

  const navigate = useNavigate();
  const location = useLocation();
  let totalNFTs: any = [];
  const pages = ['FIGHTER', 'ARSENAL', 'ARENA', 'LEADERBOARD', 'HALL OF FAME', 'PACKS', 'STAKING'];
  const [headerActive, setHeaderActive] = useState(headerLinkData.fighter);
  const [balance, setBalance] = useState("");

  const collection = "stf.capcom";
  const [loginFlag, setLogin] = useState(true);
  const endpoint = "https://wax.greymass.com";
  let wallet_userAccount = "";
  let display_nft = false;
  let loggedIn = false;
  const schema = "soldiers";
  const wax = new waxjs.WaxJS({
    rpcEndpoint: endpoint
  });
  const main = async () => {

    if (loggedIn) {
      let assets = await GetAssets();
      if (assets.length != 0) PopulateData(assets);
    } else
      await autoLogin();
  }

  const autoLogin = async () => {
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    if (isAutoLoginAvailable) {
      wallet_userAccount = wax.userAccount;
      let pubKeys = wax.pubKeys;
      let str = 'Player: ' + wallet_userAccount
      loggedIn = true;
      await main();
    }
  }


  const login = async () => {
    try {
      if (!loggedIn) {
        wallet_userAccount = await wax.login();
        let pubKeys = wax.pubKeys;
        let str = 'Player: ' + wallet_userAccount
        console.log(str);
        setAccount(wallet_userAccount);
        loggedIn = true;
        setLogin(false);
        await main();
        let isWork = await wax.rpc
        .get_currency_balance("eosio.token", wallet_userAccount, "wax")
        .then((res) => {
          console.log("geeg", res[0]);
          setBalance(res[0]);
          return true;
        })
        .catch((err) => {
          console.log("err", err);
          return false;
        });

      }
    } catch (e) {
    }
  }

  const GetAssets = async () => {
    let results = [];
    var path = "atomicassets/v1/assets?collection_name=" + collection + "&owner=" + wallet_userAccount + "&page=1&limit=1000&order=desc&sort=asset_id";
    const response = await fetch("https://" + "wax.api.atomicassets.io/" + path, {
      headers: {
        "Content-Type": "text/plain"
      },
      method: "POST",
    });
    const body = await response.json();
    if (body.data.length != 0)
      results = body.data;
    return results;
  }

  const PopulateData = async (assets: any) => {
    console.log("assets", assets);
    if (!display_nft) {
      totalNFTs = [];
      var src = "https://ipfs.infura.io/ipfs/";
      for (const data of assets) {
        let img_src = src + data.data.img;
        totalNFTs.push(img_src);
      }
      setNFT(totalNFTs);
      setAssets(assets);
      display_nft = true;
    }

  }

  const logout = async () => {
    loggedIn = false;
    display_nft = false;
    wallet_userAccount = "";
  }
  const handleHeaderlink = (index: number) => {
    setHeaderActive(index);
    switch (index) {
      case headerLinkData.fighter:
        navigate("/");
        break;
      case headerLinkData.arsenal:
        navigate("/builder/builder_scenes");
        break;
      case headerLinkData.arena:
        window.open("https://doc.unicial.org");
        break;
      case headerLinkData.leaderboard:
        window.open("https://blog.unicial.org");
        break;
      case headerLinkData.halloffame:
        window.open("https://blog.unicial.org");
        break;
      case headerLinkData.packs:
        window.open("https://blog.unicial.org");
        break;
      case headerLinkData.staking:
        window.open("https://blog.unicial.org");
        break;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }} style={{ position: "sticky", top: 0, zIndex: "100" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography className="logo" variant="h6" component="div">
            LET's FIGHT
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, marginLeft: 3 }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ my: 2, color: 'white', display: 'block', mr: 1 }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ marginRight: 2, display: "flex" }}>
            <a href="https://medium.com/" className="outside_icon"><img style={{borderRadius:"73%"}} src="/icon/medium.png" alt="icon medium" /></a>
            <a href="https://https://discord.com/" className="outside_icon"><img src="/icon/icon-discord.svg" alt="icon discord" /></a>
            <a href="https://web.telegram.org/" className="outside_icon"><img src="/icon/icon-telegram.svg" alt="icon telegram" /></a>
            <div style ={{marginTop: "5px", marginLeft: "10px"}}>{balance}</div>

          </Box>
          <Button color="inherit" className="connect_button" onClick={() => {
            login();
          }}>
            {loginFlag ? "Connect" : wallet_userAccount}</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
