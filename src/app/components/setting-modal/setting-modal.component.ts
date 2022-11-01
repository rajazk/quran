import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-setting-modal',
  templateUrl: './setting-modal.component.html',
  styleUrls: ['./setting-modal.component.scss']
})
export class SettingModalComponent implements OnInit {
  allComplete: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<SettingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit(): void {
  }

  someComplete(): boolean {
    if (this.data.languages == null) {
      return false;
    }
    return this.data.languages.filter((t: any) => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.data.languages == null) {
      return;
    }
    this.data.languages.forEach((t: any) => (t.completed = completed));
  }

  updateAllComplete() {
    this.allComplete = this.data.languages != null && this.data.languages.every((t: any) => t.completed);
  }
  sendData() {
    let filteredArray = this.data.languages.filter((item: any) => item.completed)
    this.dialogRef.close(filteredArray)
  }
}
