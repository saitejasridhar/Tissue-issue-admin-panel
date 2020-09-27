import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { BookService } from './../../shared/book.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export interface Language {
  name: string;
}

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  languageArray: Language[] = [];
  @ViewChild('chipList') chipList;
  @ViewChild('resetBookForm') myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  bookForm: FormGroup;

  ngOnInit() { 
    this.bookApi.GetBookList();
    this.submitBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private bookApi: BookService
  ) { }

  /* Remove dynamic languages */
  remove(language: Language): void {
    const index = this.languageArray.indexOf(language);
    if (index >= 0) {
      this.languageArray.splice(index, 1);
    }
  }

  /* Reactive book form */
  submitBookForm() {
    this.bookForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      time: ['', [Validators.required]],
    })
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.bookForm.controls[controlName].hasError(errorName);
  }

  /* Add dynamic languages */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || '').trim() && this.languageArray.length < 5) {
      this.languageArray.push({ name: value.trim() })
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  
  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.bookForm.get('time').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Reset form */
  resetForm() {
    this.languageArray = [];
    this.bookForm.reset();
    Object.keys(this.bookForm.controls).forEach(key => {
      this.bookForm.controls[key].setErrors(null)
    });
  }

  /* Submit book */
  submitBook() {
    if (this.bookForm.valid){
      this.bookApi.AddBook(this.bookForm.value)
      this.resetForm();
    }
  }

}