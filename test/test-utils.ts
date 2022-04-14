import { EntityTarget, ObjectLiteral, getConnection } from 'typeorm';

export async function clearRegisterOnTable<T>(
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
