import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const PlanGenerator = () => {
  const [userData, setUserData] = useState({
    weight: "", height: "", targetWeight: "", duration: "", goal: "lose"
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/plan", userData);
      setPlan(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "glass-card w-full px-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/40 border border-transparent transition-colors";

  return (
    <section id="plan" className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold mb-3">
          Your <span className="text-gradient-ice">Meal Plan</span>
        </h2>
        <p className="text-muted-foreground">Tell us your goals and we'll build a personalized plan</p>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} placeholder="Weight (kg)" onChange={(e) => setUserData({ ...userData, weight: e.target.value })} />
          <input className={inputClass} placeholder="Height (cm)" onChange={(e) => setUserData({ ...userData, height: e.target.value })} />
          <input className={inputClass} placeholder="Target Weight (kg)" onChange={(e) => setUserData({ ...userData, targetWeight: e.target.value })} />
          <input className={inputClass} placeholder="Duration (weeks)" onChange={(e) => setUserData({ ...userData, duration: e.target.value })} />
        </div>

        <select
          className={inputClass}
          onChange={(e) => setUserData({ ...userData, goal: e.target.value })}
        >
          <option value="lose">Lose Weight</option>
          <option value="gain">Gain Muscle</option>
          <option value="maintain">Maintain</option>
        </select>

        <button
          onClick={generatePlan}
          disabled={loading}
          className="w-full gradient-ice text-primary-foreground font-display font-bold py-4 rounded-xl disabled:opacity-30 transition-opacity"
        >
          {loading ? "Generating..." : "Generate My Plan →"}
        </button>

        <AnimatePresence>
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-xl space-y-4"
            >
              <h3 className="font-display font-bold text-xl text-gradient-ice">Your Plan</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="glass-card p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs mb-1">Daily Calories</p>
                  <p className="font-bold text-primary">{plan.calories}</p>
                </div>
                <div className="glass-card p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs mb-1">Workout</p>
                  <p className="font-bold">{plan.workout}</p>
                </div>
              </div>
              {plan.diet && (
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Breakfast:</span> {plan.diet.breakfast}</p>
                  <p><span className="text-muted-foreground">Lunch:</span> {plan.diet.lunch}</p>
                  <p><span className="text-muted-foreground">Dinner:</span> {plan.diet.dinner}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PlanGenerator;