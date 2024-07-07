import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('username', 50).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password').notNullable()
      table.string('given_name', 50).notNullable()
      table.string('family_name', 50).notNullable()
      table.string('avatar_url')
      table.enum('gender', ['male', 'female', 'other'])
      table.enum('role', ['admin', 'user']).defaultTo('user')
      table
        .enum('account_status', ['active', 'inactive', 'banned'])
        .defaultTo('active')
        .notNullable()
      table.boolean('is_email_verified').defaultTo(false)
      table.date('date_of_birth')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
