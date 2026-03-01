import { z } from 'zod';

// Contact Form Validation Schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter your name')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  
  email: z
    .string()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address'),
  
  phone: z
    .string()
    .min(1, 'Please enter your phone number')
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  
  message: z
    .string()
    .min(1, 'Please enter your message')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters')
    .trim(),
});
