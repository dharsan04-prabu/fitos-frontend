import { Sparkles, ArrowDown, Zap } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center py-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-8"
      >
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-primary tracking-widest uppercase">
          AI-Powered Nutrition Intelligence
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-6xl sm:text-7xl font-display font-bold leading-[1.1] mb-6"
      >
        Fuel Your Body
        <br />
        <span className="text-gradient-ice">Intelligently</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground text-lg max-w-lg mx-auto mb-10 leading-relaxed"
      >
        Snap a photo of your food, get instant nutritional insights, and
        receive personalized meal plans — all powered by AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-4"
      >
        <a
          href="#scanner"
          className="gradient-ice text-primary-foreground font-semibold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Zap className="w-4 h-4" />
          Scan Food Now
        </a>

        <a
          href="#plan"
          className="glass-card px-8 py-3.5 rounded-xl font-semibold text-foreground hover:bg-white/5 transition-colors"
        >
          Get My Plan →
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-muted-foreground"
      >
        <ArrowDown className="w-5 h-5 mx-auto animate-bounce" />
      </motion.div>
    </section>
  );
};

export default HeroSection;