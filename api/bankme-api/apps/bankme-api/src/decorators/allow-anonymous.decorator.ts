import { SetMetadata } from '@nestjs/common';

export const ALLOW_ANONYMOUS = 'isPublic';
export const AllowAnonymous = () => SetMetadata(ALLOW_ANONYMOUS, true);
