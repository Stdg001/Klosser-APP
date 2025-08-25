import { useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { InputField, PrimaryButton, Divider, SocialRow} from './index';

export default function Login({ handleInputChange, formData, handleSubmit, errors, setisLogin, status }) {  
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="min-h-screen theme-bg flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Contenido con AnimatePresence */}
      <motion.div
        className="w-3xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <AnimatePresence mode="popLayout">
          <motion.section
            key="login"
            initial="initial"
            animate="animate"
            exit="exit"
            className="p-6 sm:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 theme-text">
              Bienvenido de nuevo
            </h3>

            <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-4" noValidate>
              <InputField
                label="Correo electrónico"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                icon={FaEnvelope}
                error={errors.email}
              />
              <InputField
                label="Contraseña"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                icon={FaLock}
                error={errors.password}
                trailingIcon={showPassword ? FiEyeOff : FiEye }
                onTrailingIconClick={() => setShowPassword((s) => !s)}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 theme-text">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    className="rounded theme-border h-4 w-4 focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                  Recordarme
                </label>
                <a href="#" className="theme-active-text hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <span className="theme-error">{status}</span>
              <PrimaryButton
                type="submit"
                background="--color-primary"
                shadowColor="--color-primary"
                icon={<FaSignInAlt />}
              >
                Iniciar sesión
              </PrimaryButton>
            </form>

            <Divider>o continúa con</Divider>
            <SocialRow />

            <Divider>No tienes cuenta? <a className="theme-active-text hover:underline cursor-pointer" onClick={() => setisLogin(false)}>Registrate ahora</a></Divider>
          </motion.section>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
