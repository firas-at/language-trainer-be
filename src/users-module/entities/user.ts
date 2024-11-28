import { BaseDBEntity } from 'src/shared/base_db_entity';
import { UserWord } from 'src/user-words-module/entities/user_word';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseDBEntity {
  @Column()
  fullName: string;

  @OneToMany(() => UserWord, (userWord) => userWord.user)
  userWords: UserWord[];
}
