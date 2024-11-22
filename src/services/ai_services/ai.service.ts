export abstract class AIService {
  abstract run(systemRoleInput: string, userRoleInput: string): Promise<string>;
}
