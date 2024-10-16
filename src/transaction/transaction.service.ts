// src/transaction/transaction-manager.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientSession, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

// This service will be used to handle transactions in mongo database
@Injectable()
export class TransactionService {
  // Inject the connection to the database
  constructor(
    @InjectConnection() private readonly connection: Connection
  ) {}

  /* withTransaction method will be used to start a transaction and execute the given function
      with the session as a parameter.
      Parameters:
        - fn: The function to be executed in the transaction
      Returns:
        - The result of the function executed in the transaction 
      Errors:
        - InternalServerErrorException: If the transaction fails
  */
  async withTransaction<T>(fn: (session: ClientSession) => Promise<T>) : Promise<T> {
    // Start a session
    const session = await this.connection.startSession();
    
    try {
      session.startTransaction();
      // Execute the function with the session
      const result = await fn(session);
      // Commit the transaction
      await session.commitTransaction();
      return result;
    } catch (error) {
      // Abort the transaction if an error occurs and throw an exception
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session after the transaction is completed
      session.endSession();
    }
  }
}
