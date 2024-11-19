import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { callingmint, callingPayPenalty } from "../utils/contractInteraction";
import { useEthersSigner } from "../../hooks/useEthersSigner";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  const [amountToMint, setAmountToMint] = useState<number>(0);
  const signer = useEthersSigner();

  const handleMint = async () => {
    if (amountToMint > 0 && signer) {
      const actualSigner = await signer.getSignerAsync();
      await callingmint(amountToMint, actualSigner);
    } else {
      alert("Please enter a valid amount and connect your wallet.");
    }
  };

  const handlePayPenalty = async () => {
    if (signer) {
      const actualSigner = await signer.getSignerAsync();
      await callingPayPenalty(0.001, actualSigner); // Penalty fee fixed at 0.001 ETH
    } else {
      alert("Please connect your wallet first.");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Nosark Minting</title>
        <meta
          name="description"
          content="Mint your tokens and manage your limits on Nosark"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        style={{
          backgroundImage: "url('https://via.placeholder.com/1800')", // Placeholder image for now
          backgroundSize: "cover",
          height: "100vh",
          width: "100%",
        }}
      >
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={styles.header}
        >
          <h1 className={styles.headerTitle}>
            Welcome to the Future of Token Minting!
          </h1>
          <p className={styles.subheading}>
            Experience seamless blockchain token management.
          </p>
        </motion.header>

        <main className={styles.main} style={{ color: "#FFFFFF" }}>
          <ConnectButton />

          <h1 className={styles.title} style={{ color: "#FF6F61" }}>
            Welcome to{" "}
            <a href="#" className={styles.link} style={{ color: "#FF6F61" }}>
              Nosark
            </a>
          </h1>

          <p className={styles.description}>
            Start by connecting your wallet and managing your tokens.
          </p>

          {/* Minting Tokens Section */}
          <input
            type="number"
            placeholder="Enter amount to mint"
            onChange={(e) => setAmountToMint(Number(e.target.value))}
            className={styles.input}
            style={{ borderColor: "#FF6F61" }}
          />
          <div className={styles.buttonContainer}>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#FF4D4D" }}
              onClick={handleMint}
              className={styles.button}
              style={{ backgroundColor: "#FF6F61", color: "#FFFFFF" }}
            >
              Mint Tokens
            </motion.button>
          </div>

          {/* Pay Penalty Section */}
          <div className={styles.buttonContainer}>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#FF4D4D" }}
              onClick={handlePayPenalty}
              className={styles.button}
              style={{ backgroundColor: "#FF6F61", color: "#FFFFFF" }}
            >
              Pay Penalty
            </motion.button>
          </div>
        </main>

        <footer
          className={styles.footer}
          style={{ backgroundColor: "#FF6F61", color: "#FFFFFF" }}
        >
          <p>
            Learn more at{" "}
            <a
              href="https://example.com"
              className={styles.footerLink}
              style={{ color: "#FFCC00" }}
            >
              Our Website
            </a>
          </p>
          <p>
            Stay connected:{" "}
            <a
              href="https://twitter.com"
              className={styles.footerLink}
              style={{ color: "#FFCC00" }}
            >
              Twitter
            </a>{" "}
            |{" "}
            <a
              href="https://discord.com"
              className={styles.footerLink}
              style={{ color: "#FFCC00" }}
            >
              Discord
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
