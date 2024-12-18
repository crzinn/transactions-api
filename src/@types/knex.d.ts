//definição de tipos .d.ts tipando knex (bom pra dar manutenção)
import Knex from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        transactions: {
            id: string
            title: string
            amount: number
            created_at: string
            session_id?: string
        }
    }
}