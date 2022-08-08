import { Translate } from '../model/translate';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'novelTranslate',
  pure: false
})
export class NovelTranslatePipe implements PipeTransform {

  transform(value: Translate, ...args: any[]): string {
    // console.log(value, args);
    let result: string;

    if (value.translation === '' || value.translation === null) {
      result = value.original;
    }
    else {
      result = value.translation;
    }

    if (args.length !== 0) {
      switch (args[0]) {
        case 'full': {
          result = value.original;
          if (value.translation !== '' && value.translation !== null) {
            result += ' | ' + value.translation;
          }
          break;
        }
        default: {
          result += args[0];
          break;
        }
      }

    }
    // console.log(result);
    return result;
  }

}
