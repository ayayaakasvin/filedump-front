import { Component, OnDestroy, OnInit } from '@angular/core';
import { UploadToolComponent } from "../upload-tool/upload-tool.component";
import { CommonModule } from '@angular/common';
import { FileMetaData } from '../interfaces/file';

@Component({
	selector: 'app-upload',
	imports: [UploadToolComponent, CommonModule],
	templateUrl: './upload.component.html',
	styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit, OnDestroy {
	uploadedFile: FileMetaData | null = null;

	constructor() {
		
	}

	ngOnInit(): void {
		
	}

	ngOnDestroy(): void {
		
	}
}