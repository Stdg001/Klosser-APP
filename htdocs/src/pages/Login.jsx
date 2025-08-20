import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaApple, FaGoogle, FaQuestionCircle } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

/**
 * AuthCard mejorado
 * - Animaciones organizadas con variants y motion layout
 * - Diseño responsivo y accesible (labels, aria-*, focus visibles)
 * - Indicador de pestaña con layoutId compartido
 * - Mostrar/ocultar contraseña
 * - Medidor de fuerza de contraseña
 * - Compatible con los tokens de tema provistos (theme-*)
 */
export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [direction, setDirection] = useState(1); // 1 -> login → register, -1 al revés
  const [showPassword, setShowPassword] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    remember: false,
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [statusMsg, setStatusMsg] = useState("");

  const handleTab = (login) => {
    if (login !== isLogin) setDirection(login ? -1 : 1);
    setIsLogin(login);
    setStatusMsg("");
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate(formData, isLogin);
    setErrors(v);
    if (Object.keys(v).length === 0) {
      // Aquí iría la lógica real de autenticación/registro
      console.log("Datos del formulario:", { mode: isLogin ? "login" : "register", ...formData });
      setStatusMsg(isLogin ? "¡Bienvenido de nuevo!" : "Cuenta creada correctamente ✨");
    } else {
      setStatusMsg("");
    }
  };

  // Variants para transiciones de las vistas
  const viewVariants = {
    initial: (dir) => ({
      x: shouldReduceMotion ? 0 : dir * 28,
      opacity: 0,
      filter: shouldReduceMotion ? "none" : "blur(6px)",
    }),
    animate: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 260, damping: 26 },
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : -dir * 28,
      opacity: 0,
      filter: shouldReduceMotion ? "none" : "blur(6px)",
      transition: { duration: 0.22 },
    }),
  };

  // Indicador inferior de pestaña
  const TabButton = ({ active, onClick, children, colorVar }) => (
    <button
      className={`flex-1 py-5 font-semibold transition-all duration-300 relative ${
        active ? "theme-active-text" : "theme-text opacity-70 hover:opacity-100"
      }`}
      onClick={onClick}
      role="tab"
      aria-selected={active}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
          style={{ backgroundColor: `var(${colorVar})` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );

  return (
    <div className="min-h-screen theme-bg flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <motion.div
        className="w-3xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Card principal */}
        <div className="theme-box-bg theme-shadow rounded-2xl border theme-border overflow-hidden">
          {/* Tabs */}
          <div className="flex relative border-b theme-border" role="tablist" aria-label="Selector de formulario">
            <TabButton active={isLogin} onClick={() => handleTab(true)} colorVar="--color-primary">
              Iniciar Sesión
            </TabButton>
            <TabButton active={!isLogin} onClick={() => handleTab(false)} colorVar="--color-secondary">
              Registrarse
            </TabButton>
          </div>

          {/* Contenido con AnimatePresence */}
          <div className="relative theme-surface">
            <AnimatePresence mode="popLayout" custom={direction}>
              {isLogin ? (
                <motion.section
                  key="login"
                  custom={direction}
                  variants={viewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="p-6 sm:p-8"
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-center mt-4 mb-6 theme-text">
                    Bienvenido de nuevo
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

                    <PrimaryButton
                      type="submit"
                      gradientVar="--color-primary"
                      shadowColor="rgba(67,97,238,0.3)"
                      icon={<LoginIcon />}
                    >
                      Iniciar sesión
                    </PrimaryButton>
                  </form>

                  <Divider>o continúa con</Divider>
                  <SocialRow />

                  <StatusArea statusMsg={statusMsg} errors={errors} />
                </motion.section>
              ) : (
                <motion.section
                  key="register"
                  custom={direction}
                  variants={viewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="p-6 sm:p-8"
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-center mt-4 mb-6 theme-text">
                    Crear cuenta
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <InputField
                      label="Nombre completo"
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

                    {/* Barra de fuerza de contraseña */}
                    <PasswordStrengthBar strength={passwordStrength} />

                    <InputField
                      label="Confirmar contraseña"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      icon={FaLock}
                      error={errors.confirmPassword}
                    />

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

                    <PrimaryButton
                      type="submit"
                      gradientVar="--color-secondary"
                      shadowColor="rgba(255, 143, 42, 0.35)"
                      icon={UserPlusIcon}
                    >
                      Crear cuenta
                    </PrimaryButton>
                  </form>

                  <Divider>o regístrate con</Divider>
                  <SocialRow />

                  <StatusArea statusMsg={statusMsg} errors={errors} />
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.a
        href="#"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl theme-border theme-box-bg theme-shadow theme-text hover:opacity-95"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaQuestionCircle className="w-5 h-5" /> Ayuda
      </motion.a>
    </div>
  );
}

/* =========================
 *  Subcomponentes reutilizables
 * ========================= */

function InputField({ label, name, type = "text", value, onChange, icon: Icon, autoComplete, error, trailingIcon: TrailingIcon, onTrailingIconClick }) {
  const inputId = `${name}-input`;
  return (
    <div className="w-full">
      <label htmlFor={inputId} className="sr-only">{label}</label>
      <div className={`relative flex items-center rounded-xl theme-border theme-input px-3 py-2 ${error ? "ring-2 ring-[var(--color-error)]" : "focus-within:ring-2 focus-within:ring-[var(--color-primary)]"}`}>
        {Icon && <Icon className="w-5 h-5 opacity-70 mr-2" />}
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={label}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className="w-full bg-transparent outline-none py-2"
          required
        />
        {TrailingIcon && (
          <button type="button" onClick={onTrailingIconClick} className="p-1 -mr-1 opacity-80 hover:opacity-100" aria-label="Mostrar/ocultar contraseña">
            <TrailingIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs theme-error px-2 py-1 rounded">
          {error}
        </p>
      )}
    </div>
  );
}

function PrimaryButton({ children, icon, gradientVar, shadowColor, ...props }) {
  return (
    <motion.button
      {...props}
      className="w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
      style={{
        backgroundColor: `var(${gradientVar})`,
        backgroundImage: `linear-gradient(to bottom, var(${gradientVar}), rgba(0,0,0,0.12))`,
        boxShadow: `0 6px 14px ${shadowColor}`,
        color: "white",
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      {icon}
      {children}
    </motion.button>
  );
}

function Divider({ children }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full theme-border" />
      </div>
      <div className="relative flex justify-center text-xs sm:text-sm">
        <span className="px-2 theme-text bg-[var(--color-surface)]/80 backdrop-blur">{children}</span>
      </div>
    </div>
  );
}

function SocialRow() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SocialButton icon={<FaGoogle className="w-5 h-5" />} label="Google" />
      <SocialButton icon={<FaApple className="w-5 h-5" />} label="Apple" />
    </div>
  )
}

function SocialButton({ icon, label }) {
  return (
    <motion.button
      className="p-2.5 rounded-xl theme-border theme-text font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type="button"
    >
      {icon}
      {label}
    </motion.button>
  );
}

function StatusArea({ statusMsg, errors }) {
  const hasErrors = Object.keys(errors || {}).length > 0;
  return (
    <div className="mt-4 min-h-[1.5rem]" aria-live="polite" aria-atomic>
      {hasErrors ? (
        <p className="text-sm theme-error inline-block px-2 py-1 rounded">Revisa los campos marcados.</p>
      ) : statusMsg ? (
        <p className="text-sm px-2 py-1 rounded bg-[var(--color-success)] text-white inline-block">{statusMsg}</p>
      ) : null}
    </div>
  );
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

function SecurityBullets() {
  return (
    <ul className="mt-6 space-y-3 text-sm theme-text">
      <li className="flex items-start gap-3"><ShieldIcon /> Inicio de sesión con protección de intentos</li>
      <li className="flex items-start gap-3"><ShieldIcon /> Datos cifrados en tránsito y reposo</li>
      <li className="flex items-start gap-3"><ShieldIcon /> Autenticación de terceros disponible</li>
    </ul>
  );
}

function DecorativeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(closest-side, var(--color-primary), transparent)" }}
      />
      <div
        className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(closest-side, var(--color-secondary), transparent)" }}
      />
    </div>
  );
}

/* ==========
 *  Helpers
 * ========== */
function validate(data, isLogin) {
  const e = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) e.email = "Correo no válido";
  if (!data.password || data.password.length < 6) e.password = "Mínimo 6 caracteres";
  if (!isLogin) {
    if (!data.name || data.name.length < 2) e.name = "Escribe tu nombre";
    if (!data.confirmPassword) e.confirmPassword = "Confirma tu contraseña";
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) e.confirmPassword = "No coincide";
    if (!data.terms) e.terms = "Debes aceptar los términos";
  }
  return e;
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

function LoginIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l7 4v6c0 5-3.5 9.7-7 10-3.5-.3-7-5-7-10V6l7-4z" />
    </svg>
  );
}
