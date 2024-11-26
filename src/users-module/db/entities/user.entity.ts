import { User } from 'src/users-module/models/user';
import { EntitySchema } from 'typeorm';

export const UserEntity = new EntitySchema<User>({
  name: 'user',
  target: User,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    fullName: {
      type: String,
    },
  },
});
