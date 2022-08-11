import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NovelComponent } from './novel/novel.component';
import { SetionComponent } from './setion/setion.component';
import { ComparisonComponent } from './comparison/comparison.component';
import { TranslatorComponent } from './translator/translator.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'novel', // 'novel/:novelId'
    component: NovelComponent
  },
  {
    path: 'chapter', // 'chapter/:chapterIndex'
    component: SetionComponent
  },
  {
    path: 'translator',
    component: TranslatorComponent
  },
  {
    path: 'comparison',
    component: ComparisonComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
