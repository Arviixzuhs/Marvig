import { UserRole } from '../enums/user-role.enum'
import { Reflector } from '@nestjs/core'
import { PrismaService } from '@/prisma/prisma.service'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    const currentUser = req.user

    const requiredRole = this.reflector.getAllAndOverride<UserRole>('role', [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRole) return true

    if (!currentUser) throw new ForbiddenException('User not found in request.')

    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.userId },
    })

    if (!user || user.role !== requiredRole) {
      throw new ForbiddenException(`Access denied. Role ${requiredRole} required.`)
    }

    return true
  }
}
