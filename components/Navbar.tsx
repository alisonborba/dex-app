import { ConnectWallet } from "@thirdweb-dev/react";
import React from "react";

export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "10px",
      }}
    >
      <h1>Token DEX</h1>
      <ConnectWallet />
    </div>
  );
}
