import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middleware/check-sessionId";
export async function transactionsRoutes(app: FastifyInstance) {
    app.get(
        "/",
        {
            preHandler: [checkSessionIdExists], //middleware que verifica se existe um cookie chamado sessionId
        },
        async (req) => {
            const { sessionId } = req.cookies;
            const transactions = await knex("transactions")
                .where("session_id", sessionId)
                .select("*")
            return {
                transactions,
            };
        }
    );

    app.get(
        "/:id",
        {
            preHandler: [checkSessionIdExists],
        },
        async (req) => {
            const getTransactionParamsScheema = z.object({
                id: z.string().uuid(),
            });
            const { id } = getTransactionParamsScheema.parse(req.params);
            const { sessionId } = req.cookies;

            const transaction = await knex("transactions")
                .where({
                    session_id: sessionId,
                    id,
                })
                .first();
            console.log(req.params);

            return { transaction };
        }
    );

    app.get(
        "/summary",
        {
            preHandler: [checkSessionIdExists],
        },
        async (req) => {
            const { sessionId } = req.cookies;
            const summary = await knex("transactions")
                .where("session_id", sessionId)
                .sum("amount", { as: "amount" })
                .first();

            return { summary };
        }
    );

    //rotas de criação geralmente nao faz retornos
    app.post("/", async (req, res) => {
        const createTransactionSchema = z.object({
            title: z.string(),
            amount: z.number().positive(),
            type: z.enum(["debit", "credit"]),
        });

        const { title, amount, type } = createTransactionSchema.parse(req.body);
        //verifica se existe cookie sessionId,se não, retorna undefined
        let sessionId = req.cookies.sessionId;
        //se undefined:
        if (!sessionId) {
            (sessionId = randomUUID()),
                //res.cookie envia para o navegador um novo cookie chamado sessionId com valor sessionId e um obj de configurações
                res.cookie("sessionId", sessionId, {
                    path: "/", //define quais caminhos os cookies poderão ser acessados
                    maxAge: 60 * 60 * 24 * 7, //7 days
                });
        }

        await knex("transactions").insert({
            id: randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1,
            session_id: sessionId,
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
