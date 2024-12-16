import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (column) => {
        column.uuid('session_id').after('id').index()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (column) => {
        column.dropColumn('session_id')
    })
}

