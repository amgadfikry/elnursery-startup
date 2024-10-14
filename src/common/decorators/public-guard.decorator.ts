import { SetMetadata } from '@nestjs/common';

// Create the custom decorator
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
