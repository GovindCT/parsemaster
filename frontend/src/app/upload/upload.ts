import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface FailedLogin{
    timestamp: string;
    username: string;
    ip:string;
  }
@Component({
  selector: 'app-upload',
  imports: [CommonModule,
    FormsModule,
  ],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {
  selectedFile : File | null=null;
  uploadMessage : string='';


  failedAttempts: FailedLogin[] = [];

  

  constructor(private http : HttpClient){}

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
  }

  onSubmit(){
    if(!this.selectedFile) return;

    const formData = new FormData();
    formData.append('logfile', this.selectedFile);

    this.http.post<{message:String; failedLogins: FailedLogin[]}>('http://localhost:3000/upload',formData).subscribe({
      next: (res) =>{
        this.uploadMessage=' File uploaded successfully';
        this.failedAttempts=res.failedLogins;
        console.log(res);
      },
      error: (err) => {
        this.uploadMessage = 'Upload failed';
        console.error(err);
      }
    });

  }
}
