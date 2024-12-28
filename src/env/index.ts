import 'dotenv/config'
import { z } from 'zod'

//process.env
//criar um schema para as variaveis de ambiente (representação de uma estrutura de dados)
const envSchema = z.object({
    DATABASE_URL: z.string(),
    PORT: z.number().default(3333),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production')
})
//analisa process.env com base em envSchema
export const env = envSchema.parse(process.env)
//envSchema vai analisar(parse) process.env

//estou validando se o process.env esta seguindo o envSchema, ou seja, DATABASE_URL e PORT devem seguir os formatos definidos em envSchema, se não um erro será retornado