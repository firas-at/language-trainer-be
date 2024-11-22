import { WordInfo } from './word_info';

export class NounInfo extends WordInfo {
  constructor(
    public gender: string,
    public plural_form: string,
  ) {
    super();
  }
}
