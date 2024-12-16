import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (column) => {
        column.uuid('id').primary()
        column.text('title').notNullable()
        column.decimal('amount', 10, 2).notNullable()
        column.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions')
}

