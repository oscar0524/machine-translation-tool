import { ITranslate } from './itranslate';

export interface ISetion {
  id: number;
  title: ITranslate;
  chapter_id: number;
  url: string;
  upload?: Date;
  created: Date;
  updated: Date;
}
