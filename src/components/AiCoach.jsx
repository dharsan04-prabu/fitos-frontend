import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const AiCoach = () => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMsg = message;
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/coach", { message: userMsg });
      setChat((prev) => [...prev, { user: userMsg, bot: res.data.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold mb-3">
          AI <span className="text-gradient-ice">Coach</span>
        </h2>
        <p className="text-muted-foreground">Ask anything about nutrition and fitness</p>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        <div className="glass-card rounded-xl p-4 min-h-[250px] max-h-[400px] overflow-y-auto space-y-3">
          {chat.length === 0 && (
            <p className="text-muted-foreground text-sm text-center mt-10">
              Ask your AI coach a question below 👇
            </p>
          )}
          <AnimatePresence>
            {chat.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-start gap-2 justify-end">
                  <p className="bg-primary/20 text-foreground text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
                    {c.user}
                  </p>
                  <User className="w-5 h-5 mt-1 text-primary shrink-0" />
                </div>
                <div className="flex items-start gap-2">
                  <Bot className="w-5 h-5 mt-1 text-accent shrink-0" />
                  <p className="glass-card text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[80%]">
                    {c.bot}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground animate-pulse">Thinking...</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about nutrition, calories, workouts..."
            className="glass-card flex-1 px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none border border-transparent focus:border-primary/40 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="gradient-ice text-primary-foreground p-3.5 rounded-xl disabled:opacity-30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AiCoach;