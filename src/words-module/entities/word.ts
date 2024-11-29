import { WordType } from '../../aiservice-module/models/word_type';
import { BaseDBEntity } from '../../shared/base_db_entity';
import { UserWord } from '../../user-words-module/entities/user_word';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('words')
export class Word extends BaseDBEntity {
  @Column()
  key: string;

  @Column()
  type: WordType;

  @Column({ type: 'json' })
  info: any;

  @OneToMany(() => UserWord, (userWord) => userWord.word)
  wordUsers: UserWord[];
}
