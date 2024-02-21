import {
  ConnectWallet,
  toEther,
  toWei,
  useAddress,
  useBalance,
  useContract,
  useContractRead,
  useContractWrite,
  useSDK,
  useTokenBalance,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import SwapInput from "../components/SwapInput";
import SwapInput2 from "../components/SwapInput2";

const TOKEN_CONTRACT = "0xa517c6aBB1451a2d5A1f4Faa64e42E9356B2990b";
const DEX_CONTRACT = "0x789661C977BdfE262bA04bf75A25f8ba6c8415F1";

const Home: NextPage = () => {
  const sdk = useSDK();
  const address = useAddress();

  const { contract: tokenContract } = useContract(TOKEN_CONTRACT);
  const { contract: dexContract } = useContract(DEX_CONTRACT);
  const { data: symbol } = useContractRead(tokenContract, "symbol");
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const { data: nativeBalance } = useBalance();
  const { data: contractTokenBalance } = useTokenBalance(
    tokenContract,
    DEX_CONTRACT
  );

  const [contractBalance, setContractBalance] = useState<string>("0");
  const [nativeValue, setNativeValue] = useState<string>("0");
  const [tokenValue, setTokenValue] = useState<string>("0");
  const [currentForm, setCurrentForm] = useState<string>("native");
  const [loading, setLoading] = useState<boolean>(false);

  const { mutateAsync: swapNativeToToken } = useContractWrite(
    dexContract,
    "swapEthTotoken"
  );
  const { mutateAsync: swapTokenToNative } = useContractWrite(
    dexContract,
    "swapTokenToEth"
  );
  const { mutateAsync: approveTokenSpending } = useContractWrite(
    tokenContract,
    "approve"
  );

  const { data: amountToGet } = useContractRead(
    dexContract,
    "getAmountOfTokens",
    currentForm === "native"
      ? [
          toWei(nativeValue || "0"),
          toWei(contractBalance || "0"),
          contractTokenBalance?.value,
        ]
      : [
          toWei(tokenValue || "0"),
          contractTokenBalance?.value,
          toWei(contractBalance || "0"),
        ]
  );

  const fetchContractBalance = async () => {
    try {
      const balance = await sdk?.getBalance(DEX_CONTRACT);
      setContractBalance(balance?.displayValue || "0");
    } catch (err) {
      console.error(err);
    }
  };

  const executeSwap = async () => {
    setLoading(true);
    try {
      if (currentForm === "native") {
        await swapNativeToToken({ overrides: { value: toWei(nativeValue) } });
        alert("Swap executed successfully");
      } else {
        // Approve token spending
        await approveTokenSpending({ args: [DEX_CONTRACT, toWei(tokenValue)] });
        // Swap!
        await swapTokenToNative({ args: [toWei(tokenValue)] });
        alert("Swap executed successfully");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Error!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractBalance();
    setInterval(fetchContractBalance, 10000);
  }, []);

  useEffect(() => {
    if (!amountToGet) return;
    if (currentForm === "native") {
      setTokenValue(toEther(amountToGet));
    } else {
      setNativeValue(toEther(amountToGet));
    }
  }, [amountToGet]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.box}>
          <div
            style={{
              display: "flex",
              flexDirection:
                currentForm === "native" ? "column" : "column-reverse",
              alignItems: "center",
              justifyContent: "center",
              margin: "1px",
            }}
          >
            <SwapInput
              current={currentForm}
              type="native"
              max={nativeBalance?.displayValue}
              value={nativeValue}
              setValue={setNativeValue}
              tokenSymbol="MATIC"
              tokenBalance={nativeBalance?.displayValue}
            />
            <button
              className={styles.toggleButton}
              onClick={() => {
                currentForm === "native"
                  ? setCurrentForm("token")
                  : setCurrentForm("native");
              }}
            >
              ↓
            </button>
            <SwapInput
              current={currentForm}
              type="token"
              max={tokenBalance?.displayValue}
              value={tokenValue}
              setValue={setTokenValue}
              tokenSymbol={symbol as string}
              tokenBalance={tokenBalance?.displayValue}
            />
          </div>
          {address ? (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={executeSwap}
                disabled={loading}
                className={styles.SwapButton}
              >
                {loading ? "Loading..." : "Swap"}
              </button>
            </div>
          ) : (
            <p>Connect a wallet to exchange</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
function useFocus(): [any, any] {
  throw new Error("Function not implemented.");
}
