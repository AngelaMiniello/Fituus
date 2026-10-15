import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Must be at least 2 characters"),

  username: Yup.string()
    .required("Username is required")
    .min(2, "Must be at least 2 characters")
    .max(20, "Must be no more than 20 characters")
    .matches(/^\S+$/, "Must not contain spaces"),

  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Must include an uppercase letter, a lowercase letter, a number and a special character"
    ),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf(
      [Yup.ref("password")],
      "Passwords do not match"
    ),
});