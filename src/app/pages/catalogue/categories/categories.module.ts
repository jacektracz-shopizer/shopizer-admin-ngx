import { NgModule } from '@angular/core';

import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CategoryCreationComponent } from './category-creation/category-creation.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoriesHierarchyComponent } from './categories-hierarchy/categories-hierarchy.component';
import { ButtonRenderComponent } from './categories-list/button-render.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NbDialogModule } from '@nebular/theme';
import { ShowcaseDialogComponent } from './categories-list/showcase-dialog/showcase-dialog.component';
import { NgxTreeDndModule } from 'ngx-tree-dnd';


@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryCreationComponent,
    CategoriesListComponent,
    CategoriesHierarchyComponent,
    ButtonRenderComponent,
    CategoryFormComponent,
    CategoryDetailComponent,
    ShowcaseDialogComponent
  ],
  imports: [
    CategoriesRoutingModule,

    SharedModule,

    NgxSummernoteModule,
    NbDialogModule.forChild(),
    NgxTreeDndModule,
  ],
  entryComponents: [ButtonRenderComponent, ShowcaseDialogComponent],
})

export class CategoriesModule {
}
