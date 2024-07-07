import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare givenName: string

  @column()
  declare familyName: string

  @column()
  declare avatarUrl: string | null

  @column()
  declare gender: 'male' | 'female' | 'other'

  @column()
  declare role: 'admin' | 'user'

  @column()
  declare accountStatus: 'active' | 'inactive' | 'banned'

  @column()
  declare isEmailVerified: boolean

  @column()
  declare dateOfBirth: Date

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
