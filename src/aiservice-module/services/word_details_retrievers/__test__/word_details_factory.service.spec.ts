import { WordDetailsFactoryService } from '../word_details_factory.service';
import { VerbDetailsRetrieverService } from '../verb_details_retriever.service';
import { NounDetailsRetrieverService } from '../noun_details_retriever.service';
import { AdjectiveDetailsRetrieverService } from '../adjective_details_retriever.service';
import { WordType } from '../../../models/word_type';
import { VerbInfo } from 'src/aiservice-module/models/verb_info';
import { NounInfo } from 'src/aiservice-module/models/noun_info';
import { AdjectiveInfo } from 'src/aiservice-module/models/adjective_info';

jest.mock('../verb_details_retriever.service');
jest.mock('../noun_details_retriever.service');
jest.mock('../adjective_details_retriever.service');

describe('WordDetailsFactoryService', () => {
  let service: WordDetailsFactoryService;
  let verbDetailsRetrieverService: VerbDetailsRetrieverService;
  let nounDetailsRetrieverService: NounDetailsRetrieverService;
  let adjectiveDetailsRetrieverService: AdjectiveDetailsRetrieverService;

  beforeEach(() => {
    verbDetailsRetrieverService = new VerbDetailsRetrieverService(null);
    nounDetailsRetrieverService = new NounDetailsRetrieverService(null);
    adjectiveDetailsRetrieverService = new AdjectiveDetailsRetrieverService(
      null,
    );

    service = new WordDetailsFactoryService(
      verbDetailsRetrieverService,
      nounDetailsRetrieverService,
      adjectiveDetailsRetrieverService,
    );
  });

  describe('constructor', () => {
    it('should initialize WordDetailsFactoryService with the required services', () => {
      expect(service).toBeDefined();
    });
  });

  describe('run', () => {
    const mockVerbInfo: VerbInfo = {
      translation: 'to run',
      type: WordType.Verb,
      auxiliary_verb: '',
      infitinve_from: '',
      partizip_2_form: '',
      präteritum_form: '',
      sentence_example: '',
    };
    const mockNounInfo: NounInfo = {
      translation: 'book',
      type: WordType.Noun,
      gender: '',
      plural_form: '',
      sentence_example: '',
    };
    const mockAdjectiveInfo: AdjectiveInfo = {
      translation: 'big',
      type: WordType.Adjective,
      comparative: '',
      opposite: '',
      sentence_example: '',
      superlative: '',
    };

    beforeEach(() => {
      jest
        .spyOn(verbDetailsRetrieverService, 'getDetails')
        .mockResolvedValue(mockVerbInfo);
      jest
        .spyOn(nounDetailsRetrieverService, 'getDetails')
        .mockResolvedValue(mockNounInfo);
      jest
        .spyOn(adjectiveDetailsRetrieverService, 'getDetails')
        .mockResolvedValue(mockAdjectiveInfo);
    });

    it('should call VerbDetailsRetrieverService for WordType.Verb', async () => {
      const result = await service.run('run', WordType.Verb);

      expect(verbDetailsRetrieverService.getDetails).toHaveBeenCalledWith(
        'run',
      );
      expect(result).toEqual(mockVerbInfo);
    });

    it('should call NounDetailsRetrieverService for WordType.Noun', async () => {
      const result = await service.run('book', WordType.Noun);

      expect(nounDetailsRetrieverService.getDetails).toHaveBeenCalledWith(
        'book',
      );
      expect(result).toEqual(mockNounInfo);
    });

    it('should call AdjectiveDetailsRetrieverService for WordType.Adjective', async () => {
      const result = await service.run('big', WordType.Adjective);

      expect(adjectiveDetailsRetrieverService.getDetails).toHaveBeenCalledWith(
        'big',
      );
      expect(result).toEqual(mockAdjectiveInfo);
    });

    it('should return null for an unsupported WordType', async () => {
      const result = await service.run('unknown', WordType['Unsupported']);

      expect(result).toBeNull();
    });
  });
});
