import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../services/file/file.service';
import { FileMetaData } from '../interfaces/file';
import { throwError } from 'rxjs';
import { FileSizePipe } from "../pipes/file-size/file-size.pipe";
import { DownloadToolComponent } from "../download-tool/download-tool.component";
import { DeleteToolComponent } from "../delete-tool/delete-tool.component";
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
	selector: 'app-file-page',
	imports: [CommonModule, FileSizePipe, DownloadToolComponent, DeleteToolComponent],
	templateUrl: './file-page.component.html',
	styleUrl: './file-page.component.css'
})
export class FilePageComponent implements OnInit {
	file_id: string;
	file: FileMetaData | undefined = undefined;

	constructor(private route: ActivatedRoute, private fileService: FileService, private router: Router, private clipboard: Clipboard, private snackbar: SnackbarService) {
		this.file_id = this.route.snapshot.params["file_id"]
	}

	ngOnInit(): void {
		this.fileService.getMetadata(this.file_id).subscribe(
			(resp) => {
				if (!resp.data) {
					this.snackbar.showError("No such file found");
					this.file = undefined;
					return;
				}

				this.file = resp.data.metadata;
			},
			(error) => {
				console.error(error);
				return throwError(() => error);
			}
		)
	}

	onDelete() {
		this.router.navigate(["/files"])
	}

	copyUUID() {
		if (this.file?.file_uuid) {
			this.clipboard.copy(this.file.file_uuid);
		}
	}
}
