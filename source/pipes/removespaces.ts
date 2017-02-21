import {Pipe, PipeTransform} from '@angular/core';
 
@Pipe({
	name : "removeSpaces"
})
 
export class RemoveSpaces implements PipeTransform {
	transform(value: string) : any {
    	return value.replace(/^(\s*([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([,.](([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+\s*)*$/, '');
	}
}






