import { BaseDBEntity } from 'src/shared/base_db_entity';
import { User } from 'src/users-module/entities/user';
import { Word } from 'src/words-module/entities/word';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'users_words' })
export class UserWord extends BaseDBEntity {
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Custom join column name
  user: User;

  @ManyToOne(() => Word, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'word_id' }) // Custom join column name
  word: Word;
}
