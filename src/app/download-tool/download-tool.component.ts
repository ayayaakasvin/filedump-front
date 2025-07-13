import { Component, Input } from '@angular/core';
import { FileService } from '../services/file/file.service';
import { environment } from './../../environments/environment';

@Component({
    selector: 'app-download-tool',
    imports: [],
    templateUrl: './download-tool.component.html',
    styleUrl: './download-tool.component.css'
})
export class DownloadToolComponent {
    @Input() file_id!: string;
    @Input() original_filename!: string;

    constructor(private backend: FileService) {
        
    }

    onDownloadButton() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Redirect mobile users to the server download URL
            // Assumes server returns proper `Content-Disposition` headers
            window.location.href = `${environment.apiUrl}/download?file_id=${encodeURIComponent(this.file_id)}`;
            return;
        }

        // Desktop download with Blob
        this.backend.downloadFile(this.file_id).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.original_filename;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
        });
    }
}
