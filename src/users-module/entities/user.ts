import { BaseDBEntity } from 'src/shared/base_db_entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseDBEntity {
  @Column()
  fullName: string;
}
