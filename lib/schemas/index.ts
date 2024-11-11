import { z } from 'zod';

export const estimateSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    total: z.number().positive()
  })),
  status: z.enum(['draft', 'pending', 'approved', 'rejected']).default('draft'),
  totalAmount: z.number().positive()
});

export const clientSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

