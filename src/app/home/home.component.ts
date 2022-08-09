import { ElectronService } from '../services/electron.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { SyosetuParserService } from '../services/syosetu-parser.service';
import { Novel } from '../model/novel';
import { Translate } from '../model/translate';
import { Chapter } from '../model/chapter';
import { IpcChannel } from '../model/ipc-channel';
import { SyosetuNovelParserService } from '../services/syosetu-novel-parser.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, AfterContentInit {

  novelUrl = 'https://ncode.syosetu.com/n6970df/176/';

  re = new RegExp('^　', 'g');

  constructor(
    private electron: ElectronService,
    private router: Router,
    private syosetuNovelParser: SyosetuNovelParserService,
    private syosetuParser: SyosetuParserService,
    private cdRef: ChangeDetectorRef
  ) {

  }
  ngAfterContentInit(): void {

  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    // console.log('HomeComponent INIT');
    this.electron.ipcRenderer.invoke(IpcChannel.titleChange, 'Machine Translation Tool');
  }

  resetSearch() {
    this.novelUrl = '';
  }

  splitUrl(url: string) {
    if (url[url.length - 1] === '/') {
      url = url.substring(0, url.length - 1);
    }
    return url.replace('https://', '').split('/');
  }

  async searchNovel(): Promise<void> {
    // 判斷是小說頁還是章節頁
    const splitUrl = this.splitUrl(this.novelUrl);
    // console.log(splitUrl);
    let newNovel: Novel;
    if (splitUrl.length === 2) {
      // 小說

      this.router.navigate(['novel'], {
        state: {
          url: this.novelUrl
        }
      });

    }
    else if (splitUrl.length === 3) {
      // 章節
      this.router.navigate(['chapter'], {
        state: {
          url: this.novelUrl
        }
      });

    }
    else {
      // 不知道
    }

  }

}
