import { ElectronService } from '../services/electron.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ISetion } from '../model/interface/isetion';
import { IpcChannel } from '../model/enum/ipc-channel';
import { SyosetuParserService } from '../services/syosetu-parser.service';
import { ITranslate } from '../model/interface/itranslate';




@Component({
  selector: 'app-chapter',
  templateUrl: './setion.component.html',
  styleUrls: ['./setion.component.scss']
})
export class SetionComponent implements OnInit, AfterViewInit {
  chapterUrl: string;
  setion!: ISetion;

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
    const title = this.syosetuParser.parseSetionTitle(html);
    const episode = this.syosetuParser.parseChapterTitle(html);
    const rawContent = this.syosetuParser.parseContent(html);
    const no = this.syosetuParser.parseNovelNo(html);
    const rawData: ITranslate[] = [];
    rawContent.forEach(async (value, index) => {
      rawData.push({
        original: value.replace(this.re, ''),
        translation: ''
      });
    });

    // this.chapter = {
    //   novelName: {
    //     original: novelName,
    //     translation: ''
    //   },
    //   episodeName: {
    //     original: episode,
    //     translation: ''
    //   },
    //   title: {
    //     original: title,
    //     translation: ''
    //   },
    //   url: this.chapterUrl,
    //   sentences: rawData
    // };


  }

  ngOnInit(): void {
  }

  goBack() {
    this.location.back();
  }

  goTranslator(): void {
    this.router.navigate(['translator'], {
      state: {
        chapter: this.setion
      }
    });

  }
}
