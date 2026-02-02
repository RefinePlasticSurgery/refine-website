import { z } from "zod";

// More robust phone validation that accepts international formats
// Requires at least 7 digits and allows: +, spaces, dashes, parentheses
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

export const appointmentFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .min(7, { message: "Phone number must be at least 7 digits" })
    .regex(phoneRegex, { message: "Please enter a valid phone number (e.g., +255 793 145 167)" })
    .max(20, { message: "Phone number must be less than 20 characters" }),
  procedure: z
    .string()
    .min(1, { message: "Please select a procedure of interest" })
    .max(100, { message: "Procedure name must be less than 100 characters" }),
  date: z.string().optional().default(""),
  message: z
    .string()
    .max(1000, { message: "Message must be less than 1000 characters" })
    .optional()
    .default(""),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
