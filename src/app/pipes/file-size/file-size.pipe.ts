import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(sizeInBytes: number): string {
    if (sizeInBytes === 0) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    const size = sizeInBytes / Math.pow(1024, i);
    
    return `${size.toFixed(2)} ${sizes[i]}`;
  }
}
