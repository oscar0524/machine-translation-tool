import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// UI
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

const ngMaterialModules = [
  BrowserAnimationsModule,
  FormsModule,
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatGridListModule,
  MatDividerModule,
  MatTabsModule,
  MatTableModule,
  MatListModule,
  MatProgressBarModule,
  MatCheckboxModule,
  CdkTreeModule,
  MatTreeModule,
  MatButtonToggleModule
];

import { NgScrollbarModule } from 'ngx-scrollbar';

// Services
import { ElectronService } from './services/electron.service';

// Pipes
import { NovelTranslatePipe } from './pipes/novel-translate.pipe';

// Components
import { HomeComponent } from './home/home.component';
import { NovelComponent } from './novel/novel.component';
import { ChapterComponent } from './chapter/chapter.component';
import { SettingsComponent } from './settings/settings.component';
import { TranslatorComponent } from './translator/translator.component';
import { ComparisonComponent } from './comparison/comparison.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NovelComponent,
    ChapterComponent,
    SettingsComponent,
    TranslatorComponent,
    ComparisonComponent,
    NovelTranslatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ngMaterialModules,
    NgScrollbarModule
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
