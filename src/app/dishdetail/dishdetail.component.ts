import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility, flyInOut, expand } from '../animations/app.animations';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishcopy: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentsForm: FormGroup;
  comment: Comment;
  errMess: string;
  visibility = 'shown';
  formErrors = {
    author: '',
    comment: ''
  };
  validationMessages = {
    author: {
      required: 'Name is required.',
      minlength: 'Name must be at least 2 characters long.'
    },
    comment: {
      required: 'Last Name is required.'
    }
  };
  @ViewChild('fform') commentFormDirective;
  constructor(
    private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private dishService: DishService,
    @Inject('BaseURL') private BaseURL
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => (this.dishIds = dishIds));
    this.route.params.pipe(switchMap((params: Params) => {
      this.visibility = 'hidden';
      return this.dishservice.getDish(params['id']);
    })).subscribe(dish => {
      console.log('SUBSCRIBE');
      this.dish = dish;
      this.dishcopy = dish;
      this.setPrevNext(dish.id);
      this.visibility = 'shown';
    }, err => this.errMess = err);
  }
  createForm() {
    console.log('CREATE FORM');
    this.commentsForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', Validators.required],
      rating: 5,
      date: undefined
    });
    this.commentsForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  onSubmit() {
    this.comment = this.commentsForm.value;
    this.dish.comments.push({
      author: this.comment.author,
      rating: this.comment.rating,
      comment: this.comment.comment,
      date: new Date().toISOString()
    });
    // this.dishcopy.comments.push(this.comment);
    console.log(this.dish);
    this.dishService.putDish(this.dish)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    this.commentsForm.reset({
      author: '',
      comment: '',
      rating: 5
    });
    // this.commentFormDirective.reset();
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }
  goBack(): void {
    this.location.back();
  }
  onValueChanged(data?: any) {
    if (!this.commentsForm) {
      return;
    }
    const form = this.commentsForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
