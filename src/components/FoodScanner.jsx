import { useState, useCallback } from "react";
import { Upload, X, Sparkles, Flame, Wheat, Drumstick, Droplets } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const NutrientCard = ({ icon: Icon, label, value, color, bgColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-5 flex flex-col items-center gap-2 glow-animate"
  >
    <div className={`p-2.5 rounded-xl ${bgColor}`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <span className="text-xs text-muted-foreground uppercase tracking-widest">{label}</span>
    <span className="text-xl font-display font-bold">{value}</span>
  </motion.div>
);

const FoodScanner = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback((file) => {
    setImage(file);
    setResult(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const uploadImage = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const res = await axios.post("http://127.0.0.1:5000/api/predict", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="scanner" className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold mb-3">
          <span className="text-gradient-ice">Scan</span> Your Food
        </h2>
        <p className="text-muted-foreground">Upload a photo and get instant nutrition breakdown</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.label
              key="upload"
              htmlFor="food-input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card block cursor-pointer p-14 text-center border-2 border-dashed border-border hover:border-primary/40 transition-colors rounded-xl"
            >
              <input
                id="food-input"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-semibold mb-1">Drop food image here</p>
              <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
            </motion.label>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-xl overflow-hidden"
            >
              <img src={preview} alt="Food" className="w-full h-64 object-cover" />
              <button
                onClick={() => { setImage(null); setPreview(null); setResult(null); }}
                className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={uploadImage}
          disabled={!image || loading}
          className="w-full gradient-ice text-primary-foreground font-display font-bold py-4 rounded-xl disabled:opacity-30 transition-opacity flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Predict Nutrition
            </>
          )}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-display font-bold text-gradient-ice text-center">
                {result.food}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <NutrientCard icon={Flame} label="Calories" value={result.calories} color="text-primary" bgColor="bg-primary/10" delay={0.1} />
                <NutrientCard icon={Wheat} label="Carbs" value={result.carbs} color="text-green-400" bgColor="bg-green-500/10" delay={0.2} />
                <NutrientCard icon={Drumstick} label="Protein" value={result.protein} color="text-blue-400" bgColor="bg-blue-500/10" delay={0.3} />
                <NutrientCard icon={Droplets} label="Fat" value={result.fat} color="text-rose-400" bgColor="bg-rose-500/10" delay={0.4} />
              </div>
              <div className="glass-card p-5 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">AI Suggestion</p>
                <p className="text-foreground">{result.suggestion}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FoodScanner;