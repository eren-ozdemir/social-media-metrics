import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTwitter, FaYoutube } from "react-icons/fa";

const Nav = ({ socialMedia, setSocialMedia }) => {
  const navigatorVariants = {
    selected: { scale: 1.5 },
    notSelected: { scale: 1 },
  };

  return (
    <nav className="nav-bar-container">
      <motion.div
        animate={socialMedia === "twitter" ? "selected" : "notSelected"}
        variants={navigatorVariants}
        className={
          socialMedia === "twitter"
            ? "nav-item twitter-btn selected"
            : "nav-item twitter-btn "
        }
        onClick={() => setSocialMedia("twitter")}
      >
        <FaTwitter
          className={
            socialMedia === "twitter"
              ? "nav-icon twitter-btn-selected"
              : "nav-icon twitter-btn "
          }
        />
      </motion.div>
      <motion.div
        animate={socialMedia === "youTube" ? "selected" : "notSelected"}
        variants={navigatorVariants}
        className={
          socialMedia === "youTube"
            ? "nav-item youTube-btn selected"
            : "nav-item youTube-btn "
        }
        onClick={() => setSocialMedia("youTube")}
      >
        <FaYoutube
          className={
            socialMedia === "youTube"
              ? "nav-icon youTube-btn-selected"
              : "nav-icon youTube-btn "
          }
        />
      </motion.div>
    </nav>
  );
};

export default Nav;
