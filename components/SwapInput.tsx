import React from "react";
import styles from "../styles/Home.module.css";

type Props = {
  type: "native" | "token";
  tokenSymbol?: string;
  tokenBalance?: string;
  current: string;
  setValue: (value: string) => void;
  max?: string;
  value: string;
};

export default function SwapInput({
  type,
  tokenSymbol,
  tokenBalance,
  setValue,
  value,
  current,
  max,
}: Props) {
  const truncate = (value: string) => {
    if (value === undefined) return;
    if (value.length > 5) {
      return value.slice(0, 5);
    }
    return value;
  };

  return (
    <div className={styles.swapInputContainer}>
      <input
        type="number"
        placeholder="0.0"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={current !== type}
        className={styles.swapInput}
      />
      <div style={{ position: "absolute", top: "0", right: "10px" }}>
        <p style={{ fontSize: "12px", marginBottom: "-5px" }}>{tokenSymbol}</p>
        <p style={{ fontSize: "8px" }}>
          Balance: {truncate(tokenBalance as string)}
        </p>
        {current === type && (
          <button
            onClick={() => setValue((max as string) || "0")}
            className={styles.maxButton}
          >
            Max
          </button>
        )}
      </div>
    </div>
  );
}
