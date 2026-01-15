import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2, User, Mail, Lock, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Gender } from "@/types";

type AuthMode = 'welcome' | 'login' | 'register';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !email || !password) {
      setError('Semua field harus diisi!');
      return;
    }
    
    if (password.length < 4) {
      setError('Password minimal 4 karakter!');
      return;
    }
    
    setIsLoading(true);
    
    const success = await register({ username, email, password, gender });
    
    if (success) {
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden scanlines">
      {/* Animated stars background */}
      <div className="absolute inset-0 stars-bg" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        
        <AnimatePresence mode="wait">
          {mode === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              {/* Logo/Title */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-12"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <Gamepad2 className="w-16 h-16 text-primary" />
                </motion.div>
                
                <h1 className="text-xl md:text-2xl text-primary mb-4 tracking-wider">
                  COUPLE
                </h1>
                <h2 className="text-2xl md:text-4xl text-foreground mb-2">
                  QUEST
                </h2>
                <div className="text-[8px] text-secondary tracking-widest">
                  ★ THE ADVENTURE BEGINS ★
                </div>
              </motion.div>

              {/* Decorative pixel hearts */}
              <motion.div
                className="flex gap-4 mb-12 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -5, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.3 
                    }}
                    className="text-heart text-lg"
                  >
                    ♥
                  </motion.div>
                ))}
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <motion.button
                  onClick={() => setMode('login')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="pixel-btn-primary text-sm tracking-widest w-48"
                >
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    LOGIN
                  </motion.span>
                </motion.button>
                
                <motion.button
                  onClick={() => setMode('register')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="pixel-btn-secondary text-sm tracking-widest w-48"
                >
                  NEW GAME
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm"
            >
              <div className="bg-dialog-bg border-4 border-primary p-6 shadow-[4px_4px_0_hsl(var(--pixel-shadow))]">
                <h2 className="text-lg text-primary text-center mb-6">LOGIN</h2>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3 h-3" /> EMAIL
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-muted border-2 border-border p-2 text-[10px] text-foreground focus:border-primary outline-none"
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <Lock className="w-3 h-3" /> PASSWORD
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-muted border-2 border-border p-2 text-[10px] text-foreground focus:border-primary outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  {error && (
                    <p className="text-[8px] text-heart text-center">{error}</p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full pixel-btn-primary py-2 text-[10px]"
                  >
                    {isLoading ? 'LOADING...' : 'MASUK'}
                  </button>
                </form>
                
                <button
                  onClick={() => setMode('welcome')}
                  className="w-full text-[8px] text-muted-foreground mt-4 hover:text-primary"
                >
                  ← KEMBALI
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm"
            >
              <div className="bg-dialog-bg border-4 border-secondary p-6 shadow-[4px_4px_0_hsl(var(--pixel-shadow))]">
                <h2 className="text-lg text-secondary text-center mb-6">NEW GAME</h2>
                
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Gender Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <Heart className="w-3 h-3" /> PILIH KARAKTER
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`p-3 border-2 transition-all ${
                          gender === 'male' 
                            ? 'border-primary bg-primary/20' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">🧙‍♂️</div>
                        <div className="text-[8px] text-foreground">COWOK</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`p-3 border-2 transition-all ${
                          gender === 'female' 
                            ? 'border-heart bg-heart/20' 
                            : 'border-border hover:border-heart/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">🧙‍♀️</div>
                        <div className="text-[8px] text-foreground">CEWEK</div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <User className="w-3 h-3" /> USERNAME
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-muted border-2 border-border p-2 text-[10px] text-foreground focus:border-secondary outline-none"
                      placeholder="Nama karaktermu"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3 h-3" /> EMAIL
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-muted border-2 border-border p-2 text-[10px] text-foreground focus:border-secondary outline-none"
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <Lock className="w-3 h-3" /> PASSWORD
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-muted border-2 border-border p-2 text-[10px] text-foreground focus:border-secondary outline-none"
                      placeholder="Min. 4 karakter"
                    />
                  </div>
                  
                  {error && (
                    <p className="text-[8px] text-heart text-center">{error}</p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full pixel-btn-secondary py-2 text-[10px]"
                  >
                    {isLoading ? 'CREATING...' : 'MULAI PETUALANGAN'}
                  </button>
                </form>
                
                <button
                  onClick={() => setMode('welcome')}
                  className="w-full text-[8px] text-muted-foreground mt-4 hover:text-secondary"
                >
                  ← KEMBALI
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Version info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 text-[6px] text-muted-foreground"
        >
          <p>VERSION 2.0.0</p>
          <p className="text-center mt-1">© 2024 COUPLE QUEST</p>
        </motion.div>

        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary/30" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary/30" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary/30" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary/30" />
      </div>
    </div>
  );
};

export default LoginPage;
