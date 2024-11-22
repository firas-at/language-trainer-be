import { WordInfo } from './word_info';

export class VerbInfo extends WordInfo {
  constructor(
    public translation: string,
    public sentence_example: string,
    public infitinve_from: string,
    public partizip_2_form: string,
    public auxiliary_verb: string,
    public präteritum_form: string,
  ) {
    super();
  }
}
