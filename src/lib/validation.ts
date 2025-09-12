import { z } from 'zod';

export const aadhaarFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
  
  aadhaar_no: z.string()
    .regex(/^\d{4}\s\d{4}\s\d{4}$/, "Aadhaar number must be in format: 1234 5678 9123")
    .refine((val) => {
      const digits = val.replace(/\s/g, '');
      return digits.length === 12;
    }, "Aadhaar number must be exactly 12 digits"),
  
  dob: z.string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format")
    .refine((val) => {
      const [day, month, year] = val.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const now = new Date();
      return date <= now && year >= 1900 && year <= now.getFullYear();
    }, "Please enter a valid date"),
  
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: "Please select a valid gender" })
  }),
  
  address: z.string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters")
});

export type AadhaarFormData = z.infer<typeof aadhaarFormSchema>;

export const formatAadhaarNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Add spaces every 4 digits
  const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  
  // Limit to 14 characters (12 digits + 2 spaces)
  return formatted.slice(0, 14);
};

export const formatDateInput = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Add slashes for DD/MM/YYYY format
  if (digits.length >= 2) {
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);
    
    if (digits.length <= 2) return day;
    if (digits.length <= 4) return `${day}/${month}`;
    return `${day}/${month}/${year}`;
  }
  
  return digits;
};