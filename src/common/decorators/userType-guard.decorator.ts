import { SetMetadata } from '@nestjs/common';

// Define the roles metadata key
export const USER_TYPE = 'userType';
// Define the Roles decorator that takes a list of roles as arguments
export const UserType = (...types: string[]) => SetMetadata(USER_TYPE, types);
