
import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from "./Dashboard.module.scss";

import { useNavigate, useLocation } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DropDown from "../DropDown/DropDown";

// import AnchorLink from 'anchor-link';
// import AnchorLinkBrowserTransport from 'anchor-link-browser-transport';
import { headerLinkData } from "../../config/constant";


import * as waxjs from "@waxio/waxjs/dist";

import './navbar.css';
export interface NFTProps {
  userAccount: any,
  balance: any,
  loginFlag: any,
  nickname: any,
}


export default function ButtonAppBar({ userAccount, balance, loginFlag, nickname }: NFTProps) {

  const navigate = useNavigate();
  const location = useLocation();
  let totalNFTs: any = [];
  const pages = ['Fighters', 'Arsenal', 'Arena', 'Leaderboard', 'Hall of fame', 'Packs', 'Staking'];
  const [headerActive, setHeaderActive] = useState(headerLinkData.fighter);
  // const [balance, setBalance] = useState("");

  const collection = "stf.capcom";
  // const [loginFlag, setLogin] = useState(true);
  const endpoint = "https://wax.greymass.com";
  // let wallet_userAccount = "";
  const [wallet_userAccount, setwallet_userAccount] = useState("");
  let display_nft = false;
  let loggedIn = false;
  const schema = "soldiers";
  const identifier = 'Crowd'
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectCity, setSelectCity] = useState<string>("");
  const cities = () => {
    return ["My Profile", "My Inventory", "My Listings", "My Auctions"];
  };

  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
    if (event.currentTarget === event.target) {
      setShowDropDown(false);
    }
  };


  const citySelection = (city: string): void => {
    setSelectCity(city);
  };
  // initialize the browser transport
  // const transport = new AnchorLinkBrowserTransport();

  // const link = new AnchorLink({
  //   transport,
  //   chains: [{
  //     chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
  //     nodeUrl: endpoint,
  //   }]
  // })
  // // the session instance, either restored using link.restoreSession() or created with link.login()
  // let session;

  // // tries to restore session, called when document is loaded
  // function restoreSession() {
  //   link.restoreSession(identifier).then((result) => {
  //     session = result
  //     if (session) {
  //       // didLogin();
  //     }
  //   })
  // }

  // // login and store session if sucessful
  // function loginAnchor() {
  //   link.login(identifier).then((result) => {
  //     session = result.session;
  //     // if (playfabID != null && playfabID != undefined) {
  //     //   setIdcode(playfabID);
  //     // }
  //     setLogin(false);

  //     // navigate(`/?playfabID=${idCode}`);
  //     // didLogin()
  //   })
  // }

  // // logout and remove session from storage
  // function logoutAnchor() {
  //   // document.body.classList.remove('logged-in')
  //   //session.remove();
  // }

  // // called when session was restored or created
  // function didLoginAnchor() {
  //   // document.getElementById('account-name').textContent = session.auth.actor
  //   // document.body.classList.add('logged-in')
  // }
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
      // wallet_userAccount = wax.userAccount;
      setwallet_userAccount(wax.userAccount);
      let pubKeys = wax.pubKeys;
      let str = 'Player: ' + wallet_userAccount
      loggedIn = true;
      await main();
    }
  }


  const login = async () => {
    try {
      if (!loggedIn) {
        let wallet1_userAccount = await wax.login();
        setwallet_userAccount(wallet1_userAccount);
        let pubKeys = wax.pubKeys;
        let str = 'Player: ' + wallet_userAccount
        console.log(str);
        // setAccount(wallet1_userAccount);
        loggedIn = true;
        // setLogin(false);
        await main();
        let isWork = await wax.rpc
          .get_currency_balance("eosio.token", wallet_userAccount, "wax")
          .then((res) => {
            console.log("geeg", res[0]);
            // setBalance(res[0]);
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
      var src = "https://ipfs.atomichub.io/ipfs/";
      for (const data of assets) {
        let img_src = src + data.data.img;
        totalNFTs.push(img_src);
      }
      // setNFT(totalNFTs);
      // setAssets(assets);
      display_nft = true;
    }

  }

  const logout = async () => {
    loggedIn = false;
    display_nft = false;
    setwallet_userAccount("");
  }
  const handleHeaderlink = (index: number) => {
    setHeaderActive(index);
    // const [showDropDown, setShowDropDown] = useState<boolean>(false);
    // const [selectCity, setSelectCity] = useState<string>("");
    // const cities = () => {
    //   return ["Hong Kong", "London", "New York City", "Paris"];
    // };
    console.log("sss = " + index)
    switch (index) {
      case headerLinkData.dashboard:
        navigate("/");
        break;
      case headerLinkData.fighter:
        navigate("/fighters");
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

  const loginClick = () => {
    navigate("/wallet-manage");
  }

  return (
    <Box className = "Navbar" sx={{ flexGrow: 1 }} style={{ position: "sticky", top: 0, zIndex: "100" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography className="logo" variant="h6" component="div" >
            <span onClick={(e) => handleHeaderlink(1)}>LET's FIGHT</span>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, marginLeft: 3 }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                sx={{ my: 2, color: 'white', display: 'block', mr: 1 }}
                onClick={(e) => handleHeaderlink(index + 2)}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ marginRight: 2, display: "flex" }}>
            <a href="https://medium.com/" className="outside_icon"><img style={{ borderRadius: "73%" }} src="/icon/medium.png" alt="icon medium" /></a>
            <a href="https://https://discord.com/" className="outside_icon"><img src="/icon/icon-discord.svg" alt="icon discord" /></a>
            <a href="https://web.telegram.org/" className="outside_icon"><img src="/icon/icon-telegram.svg" alt="icon telegram" /></a>
            <div style={{ marginTop: "5px", marginLeft: "10px" }}>{balance}</div>

          </Box>
          {/* <Button color="inherit" className={showDropDown ? "active" : undefined} onClick={() =>
            (): void => toggleDropDown()
          } onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
          }>
            {loginFlag ? "Connect" : wallet_userAccount}
            <div>{selectCity ? "Select: " + selectCity : "Select ..."} </div>
            {showDropDown && (
              <DropDown
                cities={cities()}
                showDropDown={false}
                toggleDropDown={(): void => toggleDropDown()}
                citySelection={citySelection}
              />
            )}</Button> */}
            
          <button
            className={showDropDown ? "active" : undefined}
            onClick={loginFlag?()=>loginClick(): (): void => toggleDropDown()}
            onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
              dismissHandler(e)
            }
          >
            {loginFlag ? "Connect" : (nickname==""?userAccount:nickname)}
            {showDropDown && (
              <DropDown
                cities={cities()}
                showDropDown={false}
                toggleDropDown={(): void => toggleDropDown()}
                citySelection={citySelection}
              />
            )}
          </button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
