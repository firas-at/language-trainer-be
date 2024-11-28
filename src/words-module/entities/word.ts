import { WordType } from 'src/aiservice-module/models/word_type';
import { BaseDBEntity } from 'src/shared/base_db_entity';
import { Column, Entity } from 'typeorm';

@Entity('words')
export class Word extends BaseDBEntity {
  @Column()
  key: string;

  @Column()
  type: WordType;

  @Column({ type: 'json' })
  info: any;
}
