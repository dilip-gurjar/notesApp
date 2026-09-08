import { Role } from '../enums/role.enum';
import { Privilege } from '../enums/privilege.enum';

export const ROLE_PRIVILEGES: Record<Role, Privilege[]> = {

  [Role.USER]: [
    Privilege.READ_NOTE,
    Privilege.CREATE_NOTE,
  ],

  [Role.ADMIN]: [
    Privilege.READ_NOTE,
    Privilege.CREATE_NOTE,
    Privilege.UPDATE_NOTE,
    Privilege.DELETE_NOTE,
  ],

};