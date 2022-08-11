import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ElectronService } from './services/electron.service';
import { IpcChannel } from './model/enum/ipc-channel';
import { SqliteService } from './services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Machine Translation Tool';
  arrowDropUpEnable = false;
  progressValue = 0;

  private _scrollSubscription = Subscription.EMPTY;
  @ViewChild(NgScrollbar) scrollbarRef!: NgScrollbar;

  constructor(
    private electronService: ElectronService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private sqlite: SqliteService) {
    if (electronService.isElectron) {
      console.log('Electron start!')

    }

  }

  ngOnInit(): void {
    this.electronService.ipcRenderer.addListener(IpcChannel.progressValueSet, (ev, arg) => this.setProgressValue(arg));
    this.electronService.ipcRenderer.addListener(IpcChannel.titleChange, (ev, arg) => this.setTitle(arg));
  }

  ngAfterViewInit() {
    this.sqlite.init()
    this._scrollSubscription = this.scrollbarRef.verticalScrolled
      .pipe(
        map((e: any) => (e.target.scrollTop > 100)),
        tap((scroll: boolean) => {
          if (scroll !== this.arrowDropUpEnable) {
            this.arrowDropUpEnable = scroll;
            this.cdRef.detectChanges();
          }
        })).subscribe();
  }

  ngOnDestroy() {
    this._scrollSubscription.unsubscribe();
    this.electronService.ipcRenderer.removeAllListeners(IpcChannel.translateResponse);
    this.electronService.ipcRenderer.removeAllListeners(IpcChannel.titleChange);
  }

  backHome() {
    this.router.navigate(['']);
  }

  setTitle(value: string) {
    this.title = value;
    document.title = value;
  }

  setProgressValue(value: number) {
    this.progressValue = value;
    this.cdRef.detectChanges();
  }

  checkScroll(value: number) {
    console.log(value);
    // console.log('check_view', window.scrollY, window.innerHeight, document.documentElement.clientHeight);
    if (value > 100) {
      this.arrowDropUpEnable = true;
    }
    else {
      this.arrowDropUpEnable = false;
    }
  }

  arrowDropUp() {
    this.scrollbarRef.scrollTo({ top: 0, duration: 800 });
  }
}
