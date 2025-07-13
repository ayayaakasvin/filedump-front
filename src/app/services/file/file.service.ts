import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../interfaces/api-response';
import { FileMetaData } from '../../interfaces/file';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private backendURL: string = environment.apiUrl;

    constructor(private http: HttpClient) { }

    uploadFile(formData: FormData): Observable<ApiResponse<null>> {
        return this.http.post<ApiResponse<null>>(`${this.backendURL}/upload`, formData);
    }

    downloadFile(file_id: string): Observable<Blob> {
        return this.http.get(`${this.backendURL}/download?file_id=${encodeURIComponent(file_id)}`, {
            responseType: 'blob'
        });
    }

    listFile(): Observable<ApiResponse<{records: FileMetaData[]}>> {
        return this.http.get<ApiResponse<{records: FileMetaData[]}>>(`${this.backendURL}/files`,
            {
                headers: new HttpHeaders({
                    'Cache-Control': 'no-store',
                    'Pragma': 'no-cache'
                })
            }
        )
    }

    deleteFile (file_id: string): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${this.backendURL}/files?file_id=${encodeURIComponent(file_id)}`)
    }

    getMetadata(file_id: string): Observable<ApiResponse<{metadata: FileMetaData}>> {
        return this.http.get<ApiResponse<{metadata: FileMetaData}>>(`${this.backendURL}/files/metadata?file_id=${encodeURIComponent(file_id)}`);
    }
}
