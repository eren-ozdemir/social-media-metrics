import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTwitter, FaYoutube } from "react-icons/fa";

const Nav = ({ socialMedia, handleSocialMediaSelection }) => {
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
        onClick={() => handleSocialMediaSelection("twitter")}
      >
        <FaTwitter className="nav-icon" />
      </motion.div>
      <motion.div
        animate={socialMedia === "youTube" ? "selected" : "notSelected"}
        variants={navigatorVariants}
        className={
          socialMedia === "youTube"
            ? "nav-item youTube-btn selected"
            : "nav-item youTube-btn "
        }
        onClick={() => handleSocialMediaSelection("youTube")}
      >
        <FaYoutube className="nav-icon" />
      </motion.div>
    </nav>
  );
};

export default Nav;
