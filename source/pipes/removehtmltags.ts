import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'removetags'})
export class Removetags implements PipeTransform {
  transform(text: string) : any {
   	return text ? String(text).replace(/<[^>]+>/gm, '') : ''
  }
}
