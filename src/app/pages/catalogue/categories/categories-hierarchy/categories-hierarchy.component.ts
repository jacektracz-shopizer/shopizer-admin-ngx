import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'ngx-categories-hierarchy',
  templateUrl: './categories-hierarchy.component.html',
  styleUrls: ['./categories-hierarchy.component.scss']
})
export class CategoriesHierarchyComponent implements OnInit {

  categories = [];
  myTree = [];

  config = {
    showActionButtons: false,
    showRenameButtons: false,
    showDeleteButtons: false,
    showRootActionButtons: false,
    enableExpandButtons: true,
    enableDragging: true,
    rootTitle: 'Categories hierarchy',
    validationText: '',
    minCharacterLength: 5,
    setItemsAsLinks: false,
    setFontSize: 32,
    setIconSize: 16
  };

  constructor(
    private categoryService: CategoryService,
    ) {
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.categoryService.getListOfCategories()
      .subscribe(categories => {
        categories.forEach((el) => {
          this.transformList(el);
        });
        this.myTree = [...categories];
      });
  }

  transformList(node) {
    node.name = node.description.name;
    node.childrens = [...node.children];
    if (node.children && node.children.length !== 0) {
      node.children.forEach((el) => {
        this.transformList(el);
      });
    }
  }

  onDrop(event) {
    console.log(event);
  }

}
