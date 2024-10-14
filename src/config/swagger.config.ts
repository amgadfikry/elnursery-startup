import { DocumentBuilder } from '@nestjs/swagger';

// swagger configuration options
export const swaggerConfig = new DocumentBuilder()
	.setTitle('Elnursery APIs documentaion')
	.setDescription('The full details for elnursery project APIs routes')
	.setVersion('1.0')
  .addCookieAuth('token')
	.build();
