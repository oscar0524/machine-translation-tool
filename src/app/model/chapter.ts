import { Translate } from './translate';

export interface Chapter {
  novelName: Translate;
  episodeName: Translate;
  name: Translate;
  url: string;
  sentences: Translate[];
}
