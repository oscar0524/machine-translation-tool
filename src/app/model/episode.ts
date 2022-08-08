import { Translate } from './translate';
import { Chapter } from './chapter';

export interface Episode {
  name: Translate;
  chapters: Chapter[];
}
