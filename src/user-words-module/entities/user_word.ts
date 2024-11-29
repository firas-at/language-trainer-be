import { BaseDBEntity } from '../../shared/base_db_entity';
import { User } from '../../users-module/entities/user';
import { Word } from '../../words-module/entities/word';
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
