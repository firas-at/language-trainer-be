import { BaseDBEntity } from 'src/shared/base_db_entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user_words' })
export class UserWord extends BaseDBEntity {
  @Column()
  word: string;

  @Column()
  user: number;
}
