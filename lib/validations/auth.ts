import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  coupleName: z.string().min(2, "Nome do casal é obrigatório"),
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export const invitePartnerSchema = z.object({
  partnerEmail: z.string().email("Email da parceira inválido"),
})

export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Token inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type InvitePartnerInput = z.infer<typeof invitePartnerSchema>
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>
