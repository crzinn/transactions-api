import fastify from "fastify"
import { knex } from "./database"
import { randomUUID } from "crypto"

const app = fastify()

app.get("/", async (req, res) => {
    const transaction = await knex('transactions').where('amount', 1000)

    return transaction
})

app.listen({port: 3333}).then(() => {console.log('http server is running!')})