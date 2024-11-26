import { UserWord } from 'src/user-words-module/models/user_word';
import { EntitySchema } from 'typeorm';

export const UserWordEntity = new EntitySchema<UserWord>({
  name: 'user_word',
  target: UserWord,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    word: {
      type: String,
    },
    userId: {
      type: Number,
    },
  },
});
