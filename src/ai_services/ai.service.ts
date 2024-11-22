export abstract class AIService {
    abstract askQuestion(): Promise<string>;
}