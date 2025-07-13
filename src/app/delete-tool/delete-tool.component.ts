import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from '../services/file/file.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
  selector: 'app-delete-tool',
  imports: [CommonModule],
  templateUrl: './delete-tool.component.html',
  styleUrl: './delete-tool.component.css'
})
export class DeleteToolComponent {
  @Input() file_id!: string;
  @Output() deleteEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(private backend: FileService, private snackbar: SnackbarService) {

  }

  confirmDelete() {
    this.snackbar.showConfirm(`Are you sure to delete file(${this.file_id})?`, "Delete", 3000).subscribe(
      (confirmed) => {
        if (confirmed) {
          this.onDeleteButton();
        } else {
          console.log(`deletion cancelled: ${this.file_id}`);
        }
      }
    )
  }

  onDeleteButton() {
    this.backend.deleteFile(this.file_id).subscribe(
      (_) => {
        this.snackbar.showSuccess("Action successful!");
        this.deleteEmitter.emit(this.file_id);
      },
      (error) => {
        this.snackbar.showError("Something went wrong.");
        console.error("error during deletion", error);
      }
    );
  }
}
