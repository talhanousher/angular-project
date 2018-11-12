import { Component, OnInit } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  constructor(private leaderService: LeaderService) {}
  leaders: Leader[];
  ngOnInit() {
    this.leaderService.getLeaders().then(leader => {
      this.leaders = leader;
    });
    console.log(this.leaders);
  }
}
