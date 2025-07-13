import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, PLATFORM_ID, Inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-preview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() file!: File | null;
    @Input() reset!: Subject<void>;
    private destroy$: Subject<void> = new Subject<void>();

    previewUrl: string | null = null;
    fileContent: string | null = null;
    fileType: 'image' | 'pdf' | 'text' | 'unsupported' = 'unsupported';
    errorMessage: string | null = null;
    isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        // Set pdf.js worker source for browser only
        if (this.isBrowser) {
            (window as any).pdfWorkerSrc = '/assets/pdfjs/pdf.worker.min.js';
        }

        // Set up reset subscription
        this.reset.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.resetPreview();
        });

        // Initial file check
        if (this.file) {
            this.determineFileType();
            this.generatePreview();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['file']) {
            this.resetPreview();
            if (this.file) {
                this.determineFileType();
                this.generatePreview();
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private determineFileType(): void {
        if (!this.file) {
            this.fileType = 'unsupported';
            this.errorMessage = 'No file selected';
            return;
        }
        const type = this.file.type.toLowerCase();
        if (type.startsWith('image/')) {
            this.fileType = 'image';
        } else if (type === 'application/pdf') {
            this.fileType = 'pdf';
        } else if (type.startsWith('text/') || type === 'application/json') {
            this.fileType = 'text';
        } else {
            this.fileType = 'unsupported';
            this.errorMessage = 'Unsupported file type for preview';
        }
    }

    private generatePreview(): void {
        if (!this.file || this.fileType === 'unsupported') {
            this.errorMessage = this.file ? 'Unsupported file type for preview' : 'No file selected';
            return;
        }

        const reader = new FileReader();
        reader.onerror = () => {
            this.errorMessage = 'Failed to read file';
            this.fileType = 'unsupported';
            this.previewUrl = null;
            this.fileContent = null;
        };

        if (this.fileType === 'image' || this.fileType === 'pdf') {
            reader.onload = () => {
                this.previewUrl = reader.result as string;
                this.errorMessage = null;
            };
            reader.readAsDataURL(this.file);
        } else if (this.fileType === 'text') {
            reader.onload = () => {
                this.fileContent = reader.result as string;
                this.errorMessage = null;
            };
            reader.readAsText(this.file);
        }
    }

    private resetPreview(): void {
        this.previewUrl = null;
        this.fileContent = null;
        this.fileType = 'unsupported';
        this.errorMessage = null;
        this.generatePreview()
    }
}