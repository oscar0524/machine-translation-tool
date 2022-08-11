import { ITranslate } from '../model/interface/itranslate';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'novelTranslate',
  pure: false
})
export class NovelTranslatePipe implements PipeTransform {

  transform(value: ITranslate, ...args: any[]): string {
    // console.log(value, args);
    let result: string;

    if (value.translation) {
      result = value.translation;
    }
    else {
      result = value.original;
    }

    if (args.length !== 0) {
      switch (args[0]) {
        case 'full': {
          result = value.original;
          if (value.translation) {
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
