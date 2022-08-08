import { ElectronService } from '../services/electron.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { SyosetuParserService } from '../services/syosetu-parser.service';
import { Novel } from '../model/novel';
import { Translate } from '../model/translate';
import { Chapter } from '../model/chapter';
import { IpcChannel } from '../model/ipc-channel';


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
    private parser: SyosetuParserService,
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
    const html = await this.parser.downloadHtml(this.novelUrl);
    // console.log(splitUrl);
    let newNovel: Novel;
    if (splitUrl.length === 2) {
      // 小說
    }
    else if (splitUrl.length === 3) {
      // 章節
      const novelName = this.parser.parseNovelName(html);
      const title = this.parser.parseChapterTitle(html);
      const episode = this.parser.parseEpisode(html);
      const rawContent = this.parser.parseContent(html);
      const no = this.parser.parseNovelNo(html);
      const rawData: Translate[] = [];
      rawContent.forEach(async (value, index) => {
        rawData.push({
          original: value.replace(this.re, ''),
          translation: ''
        });
      });

      const chapter: Chapter = {
        novelName: {
          original: novelName,
          translation: ''
        },
        episodeName: {
          original: episode,
          translation: ''
        },
        name: {
          original: title,
          translation: ''
        },
        url: this.novelUrl,
        sentences: rawData
      };

      this.router.navigate(['chapter'], {
        state: {
          chapter
        }
      });


      // newNovel.episode.push({
      //   name: {
      //     original: episode,
      //     translation: null
      //   },
      //   chapters: []
      // });
      // newNovel.episode[0].chapters.push(
      //   {
      //     name: {
      //       original: title,
      //       translation: null
      //     },
      //     url: this.novelUrl,
      //     sentences: rawData
      //   });
    }
    else {
      // 不知道
    }

  }

}
