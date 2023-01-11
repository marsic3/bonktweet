import React from "react";
import { WalletWrapper } from "../tabs/components/WalletWrapper";
import "./popup.css";

const Popup = () => {
  return (
    <WalletWrapper>
      <div>
        <h1 className="text-4xl text-green-500">Hello World</h1>
      </div>
    </WalletWrapper>
  );
};

export default Popup;
