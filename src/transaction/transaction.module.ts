// src/transaction/transaction-manager.module.ts
import { Module, Global } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { MongooseModule } from '@nestjs/mongoose';

@Global() // make the module global
@Module({
  imports: [MongooseModule],
  providers: [TransactionService],
  exports: [TransactionService], // Export the service to be used in other modules
})
export class TransactionModule {}
