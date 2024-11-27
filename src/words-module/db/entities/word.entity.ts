import { Word } from 'src/words-module/models/word';
import { EntitySchema } from 'typeorm';

export const WordEntity = new EntitySchema<Word>({
  name: 'word',
  target: Word,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    key: {
      type: String,
    },
    info: {
      type: 'json',
    },
  },
});
