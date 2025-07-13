import { Component, OnInit } from '@angular/core';
import { FileWindowComponent } from "../file-window/file-window.component";
import { FileMetaData } from '../interfaces/file';
import { FileService } from '../services/file/file.service';
import { ApiResponse } from '../interfaces/api-response';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-files',
	imports: [FileWindowComponent, CommonModule],
	templateUrl: './files.component.html',
	styleUrl: './files.component.css'
})
export class FilesComponent implements OnInit {
	files: FileMetaData[] = [];
	constructor(private backend: FileService) {}
	ngOnInit(): void {
		this.backend.listFile().subscribe((resp: ApiResponse<{ records: FileMetaData[] }>) => {
			if (resp.data) this.files = resp.data.records;
		});
	}
	onDelete(file_id: string): void {
		this.files = this.files.filter(file => file.file_uuid !== file_id);
	}
}
