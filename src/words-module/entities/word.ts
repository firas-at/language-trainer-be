import { WordType } from '../../aiservice-module/models/word_type';
import { BaseDBEntity } from '../../shared/base_db_entity';
import { UserWord } from '../../user-words-module/entities/user_word';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('words')
export class Word extends BaseDBEntity {
  @ApiProperty({
    description: 'The unique word string',
    example: 'hello',
  })
  @Column()
  key: string;

  @ApiProperty({
    description: 'The type/part of speech of the word',
    example: 'noun',
    enum: WordType,
  })
  @Column()
  type: WordType;

  @ApiProperty({
    description:
      'Additional information about the word like definitions, examples, etc',
  })
  @Column({ type: 'json' })
  info: any;

  @ApiProperty({
    description: 'Users who have added this word to their collection',
    type: () => UserWord,
    isArray: true,
  })
  @OneToMany(() => UserWord, (userWord) => userWord.word)
  wordUsers: UserWord[];
}
