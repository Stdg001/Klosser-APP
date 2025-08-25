import { APIconnection } from "../../assets/Helpers";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";
import { FaApple, FaGoogle } from "react-icons/fa";

import Login from "./Login";
import Register from "./Register";

export default function Auth() {
  const navigate = useNavigate()

  const [ isLogin, setIsLogin ] = useState(true)
  const [ errors, setErrors ] = useState({});
  const [ status, setStatus ] = useState(null);

  const { theme, toggleTheme } = useTheme();
  const ThemeIcon = theme === 'light' ? FiMoon : FiSun;

  const [formData, setFormData] = useState({
    mode: "",
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    remember: false,
    terms: false,
  });

  const handleSubmit = async (e, formMode) => {
    e.preventDefault();

    // crea un objeto con los datos actuales + el mode
    const dataToSend = { ...formData, mode: formMode };

    // valida sobre dataToSend
    const v = validate(dataToSend, isLogin);
    setErrors(v);

    if (Object.keys(v).length === 0) {
      try {
        const response = await APIconnection("auth", { formData: dataToSend }, "POST", true);
        setStatus(null);
        navigate('/home')

      } catch (error) {
        setStatus(error.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return(
    <div>
      {isLogin ? 
        <Login 
          handleInputChange={handleInputChange} 
          formData={formData} 
          handleSubmit={handleSubmit}
          errors={errors}
          setisLogin={setIsLogin}
          status={status}
        /> 
      : 
        <Register 
          formData={formData} 
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange} 
          errors={errors}
          setisLogin={setIsLogin}
          status={status}
        />
      }

      <motion.button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl theme-border theme-box-bg theme-shadow theme-text hover:opacity-95"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        >  
        <ThemeIcon size={20} />
      </motion.button>
    </div>
  )
}

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

/* =========================
 *  Subcomponentes reutilizables
 * ========================= */

export function InputField({ label, name, type = "text", value, onChange, icon: Icon, autoComplete, error, trailingIcon: TrailingIcon, onTrailingIconClick }) {
  const inputId = `${name}-input`;
  return (
    <div className="w-full">
      <label htmlFor={inputId} className="sr-only">{label}</label>
      <div className={`relative flex items-center rounded-xl theme-border theme-text px-3 py-2 ${error ? "ring-2 ring-[var(--color-error)]" : "focus-within:ring-2 focus-within:ring-[var(--color-primary)]"}`}>
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

export function PrimaryButton({ children, icon, background, shadowColor, ...props }) {
  return (
    <motion.button
      {...props}
      className="w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
      style={{
        background: `var(${background})`,
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

export function Divider({ children }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full theme-border" />
      </div>
      <div className="relative flex justify-center text-xs sm:text-sm">
        <span className="px-2 theme-text bg-[var(--color-background)]/80 backdrop-blur">{children}</span>
      </div>
    </div>
  );
}

export function SocialRow() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SocialButton icon={<FaGoogle className="w-5 h-5" />} label="Google" />
      <SocialButton icon={<FaApple className="w-5 h-5" />} label="Apple" />
    </div>
  )
}

export function SocialButton({ icon, label }) {
  return (
    <motion.button
      className="p-2.5 rounded-xl theme-border theme-text font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90 cursor-pointer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type="button"
    >
      {icon}
      {label}
    </motion.button>
  );
}
