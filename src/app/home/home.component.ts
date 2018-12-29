import { Component, OnInit, Inject } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  leaderErrMess: string;
  promoErrMess: string;

  constructor(
    private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL
  ) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dish => {
      this.dish = dish;
    }, err => this.dishErrMess = err);
    this.promotionservice.getFeaturedPromotion().subscribe(promotion => {
      this.promotion = promotion;
    }, err => this.promoErrMess = err);
    this.leaderService.getFeaturedLeader().subscribe(leader => {
      this.leader = leader;
    }, err => this.leaderErrMess = err);
  }
}
