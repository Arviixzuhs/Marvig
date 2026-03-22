import { Controller, Get } from '@nestjs/common'

@Controller('/')
export class AppController {
  private readonly start = Date.now()

  @Get('/')
  healthCheck() {
    return {
      env: process.env['NODE_ENV'],
      status: 'OK',
      uptime: Date.now() - this.start,
      version: process.env['npm_package_version'],
    }
  }
}
