import { ChangeDetectorRef, Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CategoryService } from '../services/category.service';
import { ConfigService } from '../../../shared/services/config.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  @Input() category: any;
  form: FormGroup;
  roots = [];
  languages = [];
  config = {
    placeholder: '',
    tabsize: 2,
    height: 300,
    uploadImagePath: '',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  showRemoveButton = true;
  loader = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    if (this.category.id) {
      this.showRemoveButton = false;
    }
    this.categoryService.getListOfCategories()
      .subscribe(res => {
        res.sort((a, b) => {
          if (a.code < b.code)
            return -1;
          if (a.code > b.code)
            return 1;
          return 0;
        });
        this.roots = [...res];
      });
    this.loader = true;
    this.configService.getListOfSupportedLanguages()
      .subscribe(res => {
        this.languages = [...res];
        this.createForm();
        this.addFormArray();
        if (this.category.id) {
          this.fillForm();
        }
        this.loader = false;
      });
  }

  private createForm() {
    this.form = this.fb.group({
      root: ['', [Validators.required]],
      visible: [false],
      code: ['', [Validators.required]],
      order: [0, [Validators.required]],
      selectedLanguage: ['', [Validators.required]],
      descriptions: this.fb.array([]),
    });
  }

  addFormArray() {
    const control = <FormArray>this.form.controls.descriptions;
    this.languages.forEach(lang => {
      control.push(
        this.fb.group({
          language: [lang.code, [Validators.required]],
          name: [''],
          highlight: [''],
          friendlyUrl: [''],
          description: [''],
          title: [''],
          keyWords: [''],
          metaDescription: [''],
        })
      );
    });
  }

  fillForm() {
    this.form.patchValue({
      root: this.category.parent === null ? '' : this.category.parent,
      visible: this.category.visible,
      code: this.category.code,
      order: this.category.sortOrder,
      selectedLanguage: 'en',
      descriptions: [],
    });
    this.fillFormArray();
  }

  fillFormArray() {
    this.form.value.descriptions.forEach((desc, index) => {
      if (desc.language === 'en') {
        (<FormArray>this.form.get('descriptions')).at(index).patchValue({
          language: this.form.value.selectedLanguage,
          name: this.category.description.name,
          highlight: this.category.description.highlights,
          friendlyUrl: this.category.description.friendlyUrl,
          description: this.category.description.description,
          title: this.category.description.title,
          keyWords: this.category.description.keyWords,
          metaDescription: this.category.description.metaDescription,
        });
      }
    });
  }

  get selectedLanguage() {
    return this.form.get('selectedLanguage');
  }

  get descriptions(): FormArray {
    return <FormArray>this.form.get('descriptions');
  }

  save() {
    const categoryObject = this.form.value;
    // const enIndex = categoryObject.descriptions.find(el => el.language === 'en');
    // console.log(enIndex);
    // categoryObject.descriptions.forEach(el => {
    //   el.friendlyUrl = el.friendlyUrl.replace(/ /g, '-').toLowerCase();
    //   if (el.language !== 'en') {
    //     for (const elKey in el) {
    //       if (el.hasOwnProperty(elKey)) {
    //         console.log(elKey, el);
    //       }
    //     }
    //   }
    // });
    console.log('saving', categoryObject);
    this.categoryService.checkCategoryCode(categoryObject.code)
      .subscribe(res => {
        if (this.category.id) {
          // if exist, it is updating
          if (!res.exists || (res.exists && this.category.code === this.form.value.code)) {

          } else {
            console.log('already exists');
          }
        } else {
          if (!res.exists) {
            console.log('create');
            // if not exist, it is creating
          } else {
            console.log('already exists');
          }
        }
      });
  }

  remove() {
    this.categoryService.deleteCategory(this.category.id)
      .subscribe(res => {
        console.log(res);
        this.toastr.success('Category successfully removed.', 'Success');
        this.router.navigate(['pages/store-management/stores-list']);
      });
  }

}
