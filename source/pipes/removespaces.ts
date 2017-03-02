import {Pipe, PipeTransform} from '@angular/core';
 
@Pipe({
	name : "removeSpaces"
})
 
export class RemoveSpaces implements PipeTransform {
	transform(value: string) : any {
    	return value.replace(/^[ ]+|[ ]+$/g,'');
	}
}






