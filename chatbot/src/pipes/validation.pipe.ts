import { HttpException, HttpStatus, ValidationPipe as ValidationPipeBase } from '@nestjs/common'

const ValidationPipe = new ValidationPipeBase({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (errors) => {
    return new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        errors: errors.map((error) => ({
          field: error.property,
          messages: Object.values(error.constraints),
        })),
      },
      HttpStatus.BAD_REQUEST,
    )
  },
})

export default ValidationPipe
