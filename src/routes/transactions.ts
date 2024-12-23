import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
export async function transactionsRoutes(app: FastifyInstance) {

    app.get("/", async () => {
        const transactions = await knex("transactions").select("*");
        return {
            transactions,
        };
    });

    app.get('/:id', async (req) => {
        const getTransactionParamsScheema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParamsScheema.parse(req.params)

        const transaction = await knex('transactions').where('id', id).first()
        console.log(req.params);
        
        return {transaction}

    })

    app.get('/summary', async () => {
        const summary = await knex('transactions').sum('amount', {as: 'amount'}).first()
        
        return {summary}
    })

    //rotas de criação geralmente nao faz retornos
    app.post("/", async (req, res) => {
        const createTransactionSchema = z.object({
            title: z.string(),
            amount: z.number().positive(),
            type: z.enum(["debit", "credit"]),
        });

        const { title, amount, type } = createTransactionSchema.parse(req.body);

        let sessionId = req.cookies.sessionId

        if(!sessionId) {
            sessionId = randomUUID(),
            res.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 //7 days
            })
        }

        await knex("transactions").insert({
            id: randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1,
            session_id: sessionId
        });
        //send para enviar a resposta pro client
        return res.status(201).send();
    });

    /*app.delete('/:id', async (req) => {

        const getTransactionParamsScheema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParamsScheema.parse(req.params)
        await knex('transactions').where('id', id).delete()
        console.log(`transaction deleted: ${id}`)
})*/

}
