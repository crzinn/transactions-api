import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from 'zod'
import { randomUUID } from "node:crypto";
export async function transactionsRoutes(app: FastifyInstance) {
    //rotas de criação geralmente nao faz retornos
    app.post("/", async (req, res) => {
        const createTransactionSchema = z.object({
            title: z.string(),
            amount: z.number().positive(),
            type: z.enum(['debit', 'credit'])
        })

        const {title, amount, type} = createTransactionSchema.parse(req.body)

        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1
        })
        //send para enviar a resposta pro client
        return res.status(201).send()
    });
}
