import { WordInfo } from './word_info';

export class AdjectiveInfo extends WordInfo {
  constructor(
    public comparative: string,
    public superlative: string,
    public opposite: string,
  ) {
    super();
  }
}
