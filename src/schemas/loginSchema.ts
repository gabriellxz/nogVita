import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'O e-mail é obrigatório')
    .max(254, 'O e-mail deve ter no máximo 254 caracteres')
    .email('Digite um e-mail válido'),
  password: z.string()
    .min(1, 'A senha é obrigatória'),
});

export type LoginForm = z.infer<typeof loginSchema>;
