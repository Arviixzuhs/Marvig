import { Request } from 'express'
import { UserService } from './user.service'
import { Controller, Get, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Return a personalized greeting for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the greeting message as a string',
  })
  getHello(@Req() req: Request): Promise<string> {
    return this.appService.getHello(req.user.userId)
  }
}
