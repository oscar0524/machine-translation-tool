import { ITranslate } from './itranslate';

export interface INovel {
  id: number;
  name: ITranslate;
  writer_id: number;
  url: string;
}
