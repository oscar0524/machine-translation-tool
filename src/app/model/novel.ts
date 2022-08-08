import { Translate } from './translate';
import { Episode } from './episode';

export interface Novel {
  id: number;
  name: Translate;
  url: string;
  episode: Episode[];
  comparison: Translate[];
}
