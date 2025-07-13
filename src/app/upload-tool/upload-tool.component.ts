import { Component, Output, EventEmitter } from '@angular/core';
import { FileService } from '../services/file/file.service';
import { CommonModule } from '@angular/common';
import { FileMetaData } from '../interfaces/file';
import { FileSizePipe } from "../pipes/file-size/file-size.pipe";
import { Subject } from 'rxjs';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
	selector: 'app-upload-tool',
	imports: [CommonModule, FileSizePipe],
	templateUrl: './upload-tool.component.html',
	styleUrl: './upload-tool.component.css'
})
export class UploadToolComponent {
	metaData: FileMetaData | null = null;
	formData: FormData = new FormData()
	now: Date = new Date();
	file: File | null = null;
	resetChild$ = new Subject<void>();
	@Output() fileUploaded = new EventEmitter<FileMetaData>();

	protected maxFileSize: number = 100 << 20; 

	constructor(private backendService: FileService, private snackbar: SnackbarService) {
		
	}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;

		if (input.files && input.files.length > 0) {
			const file: File = input.files[0];

			this.metaData = {} as FileMetaData;
			this.metaData.file_name = file.name;
			this.metaData.size = file.size;
			this.metaData.uploaded_at = this.now.toISOString();
			this.metaData.file_ext = file.name.split('.').pop()
			this.metaData.mime_type = file.type

			this.file = file;

			this.formData = new FormData();
			this.formData.append("file", file);
		}
	}

	onFileSend(fileInput: HTMLInputElement): void {
		if (this.formData) {
			this.backendService.uploadFile(this.formData).subscribe(
				(_: any) => {
					this.snackbar.showSuccess("File has been sent successfully!");
					if (this.metaData) {
						this.fileUploaded.emit(this.metaData);
					}
					this.onFileReset(fileInput);
				},
				(error) => {
					this.snackbar.showError(`Failed to upload file: code ${error.status}`);
					console.error(error.error?.message);
				}
			);
		} else {
			this.snackbar.showError("Please select a file before sending.");
		}
	}

	onFileReset(fileInput?: HTMLInputElement): void {
		this.metaData = null;
		this.formData = new FormData();
		this.file = null;
		this.resetChild$.next();
		if (fileInput) {
			fileInput.value = '';
		}
	}

	protected isFileSizeValid (): boolean {
		return this.metaData!.size <= this.maxFileSize;
	}
}
