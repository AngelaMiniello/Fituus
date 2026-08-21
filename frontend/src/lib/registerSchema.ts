import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string()
    .required("El nombre es obligatorio")
    .min(2, "Debe tener al menos 2 caracteres"),

  username: Yup.string()
    .required("El username es obligatorio")
    .min(2, "Debe tener al menos 2 caracteres")
    .max(20, "No puede superar 20 caracteres")
    .matches(/^\S+$/, "No puede contener espacios"),

  email: Yup.string()
    .required("Email requerido")
    .email("Email inválido"),

  password: Yup.string()
    .required("Contraseña requerida")
    .min(8, "Debe tener al menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Debe incluir mayúscula, minúscula, número y carácter especial"
    ),

  confirmPassword: Yup.string()
    .required("Confirma tu contraseña")
    .oneOf(
      [Yup.ref("password")],
      "Las contraseñas no coinciden"
    ),
});