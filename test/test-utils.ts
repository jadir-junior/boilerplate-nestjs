import { EntityTarget, ObjectLiteral, getConnection } from 'typeorm';

import { User } from '../src/users/user.entity';

export async function deleteRegisterOnTable<T>(
  entity: EntityTarget<T>,
  where: string,
  parameters?: ObjectLiteral,
) {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(entity)
    .where(where, parameters)
    .execute();
}

export async function deleteUserOnDataBaseForEmail(email: string) {
  deleteRegisterOnTable(User, 'email = :email', { email });
}
