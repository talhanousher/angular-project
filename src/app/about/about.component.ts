import { Component, OnInit, Inject } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  errMess: string;
  constructor(private leaderService: LeaderService, @Inject('BaseURL') private BaseURL) { }
  leaders: Leader[];
  ngOnInit() {
    this.leaderService.getLeaders().subscribe(leader => {
      this.leaders = leader;
    }, err => this.errMess = err);
  }
}
