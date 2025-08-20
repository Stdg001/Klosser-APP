import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación/registro
    console.log("Datos del formulario:", formData);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 theme-bg">
      <div className="w-full max-w-md relative overflow-hidden rounded-2xl theme-shadow" style={{boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'}}>
        {/* Selector de Login/Registro con indicador inferior */}
        <div className="flex theme-box-bg relative border-b theme-border">
          <button
            className={`flex-1 py-5 font-semibold transition-all duration-300 relative ${isLogin ? "theme-active-text" : "theme-text opacity-70"}`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
            {isLogin && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                style={{backgroundColor: 'var(--color-primary)'}}
                layoutId="activeTab"
                transition={{type: "spring", stiffness: 300, damping: 30}}
              />
            )}
          </button>
          <button
            className={`flex-1 py-5 font-semibold transition-all duration-300 relative ${!isLogin ? "theme-active-text" : "theme-text opacity-70"}`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
            {!isLogin && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                style={{backgroundColor: 'var(--color-secondary)'}}
                layoutId="activeTab"
                transition={{type: "spring", stiffness: 300, damping: 30}}
              />
            )}
          </button>
        </div>

        <div className="relative h-auto overflow-hidden theme-surface">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="flex justify-center mb-6">
                  <img 
                    src="https://placehold.co/150x50/4361EE/FFFFFF?text=Klossio" 
                    alt="Klossio" 
                    className="h-10"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-center mb-6 theme-text">Bienvenido de nuevo</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-xl theme-border theme-input focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-xl theme-border theme-input focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold transition-all hover:opacity-90 transform hover:scale-[1.01] flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: 'var(--color-primary)', 
                      boxShadow: '0 4px 12px rgba(67, 97, 238, 0.3)',
                      backgroundImage: 'linear-gradient(to bottom, var(--color-primary), #3a56d4)'
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Iniciar Sesión
                  </motion.button>
                </form>
                
                <div className="text-center mt-4">
                  <a href="#" className="text-sm theme-active-text hover:underline">¿Olvidaste tu contraseña?</a>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full theme-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 theme-text bg-[var(--color-surface)]">O continúa con</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button 
                    className="p-2.5 rounded-xl theme-border theme-text font-medium flex items-center justify-center gap-2 transition-all hover:bg-gray-100"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    Google
                  </motion.button>
                  <motion.button 
                    className="p-2.5 rounded-xl theme-border theme-text font-medium flex items-center justify-center gap-2 transition-all hover:bg-gray-100"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 15.5h-1v-5h1v5zm0-6.5h-1V7h1v4z"/>
                    </svg>
                    Apple
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="flex justify-center mb-6">
                  <img 
                    src="https://placehold.co/150x50/4361EE/FFFFFF?text=Klossio" 
                    alt="Klossio" 
                    className="h-10"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-center mb-6 theme-text">Crear Cuenta</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-xl theme-border theme-input focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-xl theme-border theme-input focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-xl theme-border theme-input focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmar contraseña"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-xl theme-border theme-input focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      className="rounded theme-border focus:ring-blue-400 h-4 w-4"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm theme-text">
                      Acepto los <a href="#" className="theme-active-text hover:underline">términos y condiciones</a>
                    </label>
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold transition-all hover:opacity-90 transform hover:scale-[1.01] flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: 'var(--color-secondary)', 
                      boxShadow: '0 4px 12px rgba(255, 143, 42, 0.3)',
                      backgroundImage: 'linear-gradient(to bottom, var(--color-secondary), #e67a1a)'
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Crear Cuenta
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <motion.button 
        className="mt-8 px-6 py-2.5 rounded-xl font-medium theme-border transition-all hover:bg-gray-100 flex items-center gap-2"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Ayuda
      </motion.button>
    </div>
  );
}