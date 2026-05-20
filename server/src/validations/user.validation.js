const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    fullname: z.string().min(2, "Full name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["student", "recruiter"], {
      required_error: "Role is required and must be either student or recruiter",
    }),
  }).passthrough(), // Using passthrough just in case form-data contains files or extra fields the backend relies on, but validation will strictly check these 4 fields.
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(["student", "recruiter"]).optional(),
  }).passthrough(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
