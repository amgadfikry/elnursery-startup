import { Module } from '@nestjs/common';
import { ChildService } from './child.service';
import { ChildController } from './child.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Child, ChildSchema } from './schemas/child.schema';
import { UserModule } from 'src/user/user.module';

// import child model and schema into the child module
@Module({
  imports:[
    MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
    UserModule
  ],
  controllers: [ChildController],
  providers: [ChildService],
})
export class ChildModule {}

