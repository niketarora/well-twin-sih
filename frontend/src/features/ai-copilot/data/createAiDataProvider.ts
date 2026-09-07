import { AiDataProvider } from './AiDataProvider';
import { DemoAiDataProvider } from './DemoAiDataProvider';
import { ApiAiDataProvider } from './ApiAiDataProvider';

let singletonProvider: AiDataProvider | null = null;

export function getAiDataProvider(): AiDataProvider {
  if (!singletonProvider) {
    const mode = (import.meta.env.VITE_AI_DATA_MODE || 'demo').toLowerCase();
    if (mode === 'api') {
      singletonProvider = new ApiAiDataProvider();
    } else {
      singletonProvider = new DemoAiDataProvider();
    }
  }
  return singletonProvider;
}
