
import { z } from 'zod';

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');

  if (digits.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calculateDigit = (base: string, factor: number) => {
    let sum = 0;

    for (const digit of base) {
      sum += Number(digit) * factor--;
    }

    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calculateDigit(digits.slice(0, 9), 10);
  const secondDigit = calculateDigit(digits.slice(0, 10), 11);

  return (
    firstDigit === Number(digits[9]) &&
    secondDigit === Number(digits[10])
  );
}

const commonPasswords = new Set([
  '123456789012345',
  'passwordpassword',
  'qwertyuiopasdfg',
  'senha1234567890',
  'iloveyouiloveyou',
]);

function getToday(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'O nome é obrigatório')
    .max(150, 'O nome deve ter no máximo 150 caracteres'),

  email: z.string()
    .trim()
    .min(1, 'O e-mail é obrigatório')
    .max(254, 'O e-mail deve ter no máximo 254 caracteres')
    .email('Digite um e-mail válido'),

  cpf: z.string()
    .min(1, 'O CPF é obrigatório')
    .refine(isValidCPF, 'Digite um CPF válido'),

  password: z.string()
    .min(15, 'A senha deve ter pelo menos 15 caracteres')
    .max(128, 'A senha deve ter no máximo 128 caracteres')
    .refine(
      (password) => !commonPasswords.has(password.toLowerCase()),
      'Essa senha é muito comum. Escolha outra.',
    ),

  birthDate: z.string()
    .min(1, 'A data de nascimento é obrigatória')
    .refine((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

      const date = new Date(`${value}T00:00:00`);

      if (
        Number.isNaN(date.getTime()) ||
        date.getFullYear() !== Number(value.slice(0, 4)) ||
        date.getMonth() + 1 !== Number(value.slice(5, 7)) ||
        date.getDate() !== Number(value.slice(8, 10))
      ) {
        return false;
      }

      return value <= getToday();
    }, 'Informe uma data válida que não esteja no futuro'),

  biologicalSex: z.union([z.literal(1), z.literal(2)], {
    message: 'Selecione um sexo biológico válido',
  }),

  heightInCm: z.coerce.number()
    .int('Informe a altura em centímetros')
    .min(80, 'A altura deve ser de pelo menos 80 cm')
    .max(250, 'A altura deve ser de no máximo 250 cm'),

  goal: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    message: 'Selecione um objetivo nutricional',
  }),
});

export type RegisterForm = z.infer<typeof registerSchema>;
