export interface FileMetaData {
  file_uuid: string;
  file_name: string;
  file_ext?: string;         // optional field (like `omitempty` in Go)
  uploaded_at: string;       // ISO 8601 string, e.g. "2025-05-21T21:13:18Z"
  size: number;              // in bytes
  file_path: string;         // absolute path to the file
  mime_type?: string;        // optional MIME type of the file
  user_id: number;           // ID of the user who uploaded the file
}