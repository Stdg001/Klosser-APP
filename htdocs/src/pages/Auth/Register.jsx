import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { InputField, PrimaryButton, Divider, SocialRow} from './index';
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Register({ formData, handleSubmit, handleInputChange, errors, setisLogin, status }) {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);
  
  return(
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
            key="register"
            initial="initial"
            animate="animate"
            exit="exit"
            className="p-6 sm:p-8 theme-bg"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 theme-text">
              Crear cuenta
            </h3>

            <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-4" noValidate>
              <InputField
                label="Nombre de Usuario"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                icon={FaUser}
                error={errors.name}
              />
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
              <div className="flex gap-3">
                <InputField
                  label="Contraseña"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  icon={FaLock}
                  error={errors.password}
                  trailingIcon={showPassword ? FiEyeOff : FiEye }
                  onTrailingIconClick={() => setShowPassword((s) => !s)}
                  />

                  <InputField
                    label="Confirmar contraseña"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                  />
              </div>
              {/* Barra de fuerza de contraseña */}
              <PasswordStrengthBar strength={passwordStrength} />

              <label className="flex items-start gap-3 text-sm theme-text">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  className="mt-1 rounded theme-border h-4 w-4 focus:ring-2 focus:ring-[var(--color-secondary)]"
                />
                <span>
                  Acepto los {" "}
                  <a href="#" className="theme-active-text hover:underline">términos y condiciones</a>
                </span>
              </label>

              <span className="theme-error">{status}</span>
              <PrimaryButton
                type="submit"
                background="--color-secondary"
                shadowColor="--color-secondary"
                icon={<FaUserPlus />}
              >
                Crear cuenta
              </PrimaryButton>
            </form>

            <Divider>o regístrate con</Divider>
            <SocialRow />

            <Divider>Ya tienes cuenta? <a className="theme-active-text hover:underline cursor-pointer" onClick={() => setisLogin(true)}>Inicia Sesion</a></Divider>
          </motion.section>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function getPasswordStrength(pwd) {
  const scoreRules = [
    /[a-z]/.test(pwd),
    /[A-Z]/.test(pwd),
    /\d/.test(pwd),
    /[^A-Za-z0-9]/.test(pwd),
  ];
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  score += scoreRules.filter(Boolean).length - 2; // -2 para equilibrar
  score = Math.max(0, Math.min(4, score));

  const palette = [
    { label: "muy débil", color: "linear-gradient(90deg, #EF5350, #F44336)", hint: "Usa mayúsculas y números" },
    { label: "débil", color: "linear-gradient(90deg, #FFA726, #FB8C00)", hint: "Agrega símbolos" },
    { label: "medio", color: "linear-gradient(90deg, #FFCA28, #FBC02D)", hint: "Más longitud" },
    { label: "fuerte", color: "linear-gradient(90deg, #66BB6A, #43A047)", hint: "Bien" },
    { label: "muy fuerte", color: "linear-gradient(90deg, #42A5F5, #1E88E5)", hint: "Excelente" },
  ];
  return { score, ...palette[score] };
}


function PasswordStrengthBar({ strength }) {
  const width = `${(strength.score / 4) * 100}%`;
  const color = strength.color;
  return (
    <div className="mt-1">
      <div className="h-2 w-full rounded-full theme-border-bg" style={{ backgroundColor: "var(--color-disabled)" }} />
      <motion.div
        className="h-2 -mt-2 rounded-full"
        style={{ background: color, width }}
        initial={{ width: 0 }}
        animate={{ width }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        aria-hidden
      />
      <div className="flex justify-between text-[11px] mt-1 theme-text opacity-70">
        <span>Seguridad: {strength.label}</span>
        <span>{strength.hint}</span>
      </div>
    </div>
  );
}