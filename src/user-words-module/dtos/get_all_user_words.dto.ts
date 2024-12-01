import { WordType } from '../../aiservice-module/models/word_type';
import { ApiProperty } from '@nestjs/swagger';
import { UserWordsSortBy } from './user_words_sort_by';
import { SortingOptions } from '../../shared/sorting_options';

export class GetAllUserWordsDTO {
  @ApiProperty({
    description: 'The types of words to filter by',
    type: [String], // You need to specify `type: [String]` since it's an array of strings (enum values)
    enum: WordType, // The enum values for the `types` field
    isArray: true, // This indicates that the field is an array
  })
  types: WordType[];

  @ApiProperty({
    description: 'The sorting field for the results',
    enum: UserWordsSortBy, // The enum for sorting
  })
  sort_by: UserWordsSortBy;

  @ApiProperty({
    description: 'The sorting order for the results',
    enum: SortingOptions, // The enum for sorting
  })
  sort_order: SortingOptions;
}
