import { ElectronService } from '../services/electron.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Chapter } from '../model/chapter';
import { IpcChannel } from '../model/ipc-channel';
import { SyosetuParserService } from '../services/syosetu-parser.service';
import { Translate } from '../model/translate';




@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit, AfterViewInit {
  chapterUrl: string;
  chapter!: Chapter;

  re = new RegExp('^　', 'g');
  chapterContent: string = '';

  constructor(
    private electron: ElectronService,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private syosetuParser: SyosetuParserService) {
    const state = router.getCurrentNavigation()!.extras.state;
    if (state === undefined || state === null || !Object.keys(state).includes('url')) {
      router.navigate(['']);
    }
    this.chapterUrl = state!['url'];

  }
  async ngAfterViewInit(): Promise<void> {
    const html = await this.syosetuParser.downloadHtml(this.chapterUrl);
    const novelName = this.syosetuParser.parseNovelName(html);
    const title = this.syosetuParser.parseChapterTitle(html);
    const episode = this.syosetuParser.parseEpisode(html);
    const rawContent = this.syosetuParser.parseContent(html);
    const no = this.syosetuParser.parseNovelNo(html);
    const rawData: Translate[] = [];
    rawContent.forEach(async (value, index) => {
      rawData.push({
        original: value.replace(this.re, ''),
        translation: ''
      });
    });

    this.chapter = {
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
      url: this.chapterUrl,
      sentences: rawData
    };


  }

  ngOnInit(): void {
  }

  goBack() {
    this.location.back();
  }

  goTranslator(): void {
    this.router.navigate(['translator'], {
      state: {
        chapter: this.chapter
      }
    });

  }
}
