import z from "zod";

const registerCustomerValidationSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password can be at most 100 characters"),
});

const loginUserValidationSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const changePasswordValidationSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(100, "New password can be at most 100 characters"),
});

const resetPasswordValidationSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(100, "New password can be at most 100 characters"),
});

const verifyEmailValidationSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

const forgetPasswordValidationSchema = z.object({
  email: z.email("Invalid email address"),
});

const updateSellerProfileValidationSchema = z.object({
  shopName: z
    .string()
    .trim()
    .min(1, "Shop name is required")
    .max(250, "Shop name can be at most 250 characters"),
  shopAddress: z.string().optional(),
  shopPhone: z.string().optional(),
});

const updateUserValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(250, "Name can be at most 250 characters"),
  phone: z.string().optional(),
});

const resendVerificationOtpValidationSchema = z.object({
  email: z.email("Invalid email address"),
});

export type IRegisterCustomerPayload = z.infer<
  typeof registerCustomerValidationSchema
>;
export type ILoginUserPayload = z.infer<typeof loginUserValidationSchema>;
export type IChangePasswordPayload = z.infer<
  typeof changePasswordValidationSchema
>;
export type IResetPasswordPayload = z.infer<
  typeof resetPasswordValidationSchema
>;
export type IVerifyEmailPayload = z.infer<typeof verifyEmailValidationSchema>;
export type IForgotPasswordPayload = z.infer<
  typeof forgetPasswordValidationSchema
>;
export type IResendVerificationOtpPayload = z.infer<
  typeof resendVerificationOtpValidationSchema
>;

export const authValidation = {
  registerCustomerValidationSchema,
  loginUserValidationSchema,
  changePasswordValidationSchema,
  verifyEmailValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  updateUserValidationSchema,
  updateSellerProfileValidationSchema,
  resendVerificationOtpValidationSchema,
};
