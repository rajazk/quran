import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SettingModalComponent } from 'src/app/components/setting-modal/setting-modal.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  faChevronUp = faChevronUp
  faChevronDown = faChevronDown
  faGear = faGear
  paramsData: any = {}
  dialogRef: MatDialogRef<any>
  data: any = []
  selectedLanguages: any = {
    name: 'Select All',
    completed: false,
    languages: [
      { name: 'English', completed: false, id: 131 },
      { name: 'Urdu', completed: false, id: 234 },
    ],
  }
  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.queryParams.subscribe(params => {
      const initialParams: any = {}
      Object.keys(params).forEach(key => {
        initialParams[key] = params[key]
      })
      this.paramsData = { ...initialParams }
    })
  }

  ngOnInit(): void {
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialogRef = this.dialog.open(SettingModalComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {...this.selectedLanguages}
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.api.translations.next(result)
    });
  }
}
