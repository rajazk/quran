import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  faChevronUp = faChevronUp
  faChevronDown = faChevronDown
  paramsData: any = {}
  constructor(public api: ApiService, private route: ActivatedRoute) {
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

}
