import { Injectable } from '@nestjs/common'
import { PasswordHasherPort } from '@/modules/user/domain/ports/password-hasher.port'
import * as bcrypt from 'bcrypt'

@Injectable()
export class BcryptPasswordHasherAdapter implements PasswordHasherPort {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
