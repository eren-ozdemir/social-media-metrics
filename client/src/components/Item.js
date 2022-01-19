import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Item = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        className={isOpen ? "open" : "closed"}
        onClick={() => setIsOpen(!isOpen)}
      >
        item
      </motion.div>
    </AnimatePresence>
  );
};

export default Item;
