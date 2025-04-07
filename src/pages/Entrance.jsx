import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { assignAvatar } from "../lib/utils";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Loader from "../components/Loader";

const Entrance = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!input.trim()) {
      setError("Please enter your name to continue.");
      return;
    }
    // eslint-disable-next-line no-unused-vars
    const avatar = assignAvatar(input.trim());
    // Save the name and avatar in localStorage
    localStorage.setItem("userName", input.trim());

    setIsLoading(true);

    // Pre-warm the socket connection (RENDER FREE TIER HAS US DOING THIS)
    const socket = new WebSocket("wss://sbsc-project-server.onrender.com");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "PING" }));
      socket.close(); // close immediately after ping
      navigate("/collaboration");
    };

    // fallback if socket fails to open
    setTimeout(() => {
      navigate("/collaboration");
    }, 50000);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleJoin();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <motion.section
      className="h-screen grid place-content-center mx-auto text-center max-w-4xl  px-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1
        className="text-4xl lg:text-6xl text-[#F26722] font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        Hi Collaborator
        <span role="img" aria-label="waving hand">
          👋
        </span>
      </motion.h1>
      <motion.p
        className="mt-2 text-gray-400 text-xl font-normal"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
      >
        Join the Conversation. See what the community is talking about!
      </motion.p>
      <div className="w-full mt-4 relative flex items-center justify-center gap-2">
        <motion.input
          type="text"
          placeholder="Name"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError("");
          }}
          onKeyPress={handleKeyPress}
          className={`border border-gray-300 rounded-md p-3 w-full outline-none focus:border-[#F26722] focus:ring-1 focus:ring-[#F26722] ${
            error ? "border-red-500" : ""
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileTap={error ? { x: [-5, 5, -5, 5, 0] } : {}}
        />
        <motion.button
          onClick={handleJoin}
          className="absolute right-[2%] bg-[#F26722] rounded-full h-10 w-10 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <span className="font-bold text-white">&rarr;</span>
        </motion.button>
      </div>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </motion.section>
  );
};

export default Entrance;
