import { SetMetadata } from '@nestjs/common';
import { Privilege } from '../enums/privilege.enum';

export const PRIVILEGES_KEY = 'privileges';

export const Privileges = (...privileges: Privilege[]) =>
  SetMetadata(PRIVILEGES_KEY, privileges);