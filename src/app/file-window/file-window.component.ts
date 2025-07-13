import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileMetaData } from '../interfaces/file';
import { CommonModule } from '@angular/common';
import { FileService } from '../services/file/file.service';
import { DownloadToolComponent } from "../download-tool/download-tool.component";
import { RouterModule } from '@angular/router';
import { DeleteToolComponent } from "../delete-tool/delete-tool.component";

@Component({
    selector: 'app-file-window',
    imports: [CommonModule, DownloadToolComponent, RouterModule, DeleteToolComponent],
    templateUrl: './file-window.component.html',
    styleUrl: './file-window.component.css'
})
export class FileWindowComponent {
    @Input() file!: FileMetaData;
    @Output() deleteEmit: EventEmitter<string> = new EventEmitter<string>();

    constructor(private backend: FileService) {
        
    }

    onDownloadButton() {
        this.backend.downloadFile(`${this.file.file_uuid}${this.file.file_ext}`).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.file.file_name;
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }

    onDeleteEmit(file_id: string): void {
        this.deleteEmit.emit(file_id);
    }
}
