import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ISetion } from '../model/interface/isetion';
import { SyosetuNovelParserService } from '../services/syosetu-novel-parser.service';
import { Novel } from '../model/novel';
import { Writer } from '../model/writer';
import { Chapter } from '../model/chapter';
import { Setion } from '../model/setion';
import { ElectronService } from '../services/electron.service';
import { IpcChannel } from '../model/enum/ipc-channel';

@Component({
  selector: 'app-novel',
  templateUrl: './novel.component.html',
  styleUrls: ['./novel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NovelComponent implements OnInit {

  novelUrl: string;
  novel?: Novel;


  constructor(
    private router: Router,
    private location: Location,
    private syosetuNovelParser: SyosetuNovelParserService,
    private electronService: ElectronService,
    private cdRef: ChangeDetectorRef
  ) {
    const state = this.router.getCurrentNavigation()!.extras.state;
    if (state === undefined || state === null || !Object.keys(state).includes('url')) {
      this.router.navigate(['']);
    }
    this.novelUrl = state!['url'];

  }

  async ngOnInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    let novel = await Novel.get(this.novelUrl)
    // console.log(novel)
    if (!novel) {
      const html = await this.syosetuNovelParser.downloadHtml(this.novelUrl);
      const novelName = this.syosetuNovelParser.parseName(html);
      const { writerNameUrl, writerName } = this.syosetuNovelParser.parseWriternameInfo(html);
      let writer = await Writer.get(writerName, writerNameUrl)
      if (!writer) { writer = await Writer.insert(writerName, writerNameUrl) }

      let novel = await Novel.insert(novelName, writer.id, this.novelUrl)
      this.novel = novel;
      this.novel.writer = writer
      this.cdRef.detectChanges();
      this.electronService.ipcRenderer.invoke(IpcChannel.progressValueSet, 20)

      const chapters = this.syosetuNovelParser.parseChapters(html);
      // console.log('insert chapters', chapters)
      this.novel.chapters = []
      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index]
        // console.log(chapter)
        const dbchapter = await Chapter.insert(chapter.chapterTitle, this.novel.id);
        if (dbchapter) {
          this.novel.chapters.push(dbchapter)
          this.cdRef.detectChanges();
          this.electronService.ipcRenderer.invoke(IpcChannel.progressValueSet, 20 + (index + 1 / chapters.length * 80))
        }
      }
    } else {
      this.novel = novel;
      await this.novel.getWriter()
      await this.novel.getChapters()
      console.log(this.novel)
    }
    this.electronService.ipcRenderer.invoke(IpcChannel.progressValueSet, 0)
    this.cdRef.detectChanges();
  }

  async ngAfterViewInit(): Promise<void> {

  }

  async openChapter(chapter: Chapter) {
    // console.log(chapter)
    if (!chapter.setions) {
      await chapter.getSetions()
    }
    if (chapter.setions?.length === 0) {
      const html = await this.syosetuNovelParser.downloadHtml(this.novelUrl);
      const parseChapters = this.syosetuNovelParser.parseChapters(html);
      // console.log(parseChapters)
      parseChapters.forEach(async (parseChapter) => {
        // console.log(chapter.title.original, parseChapter.chapterTitle)
        if (chapter.title.original === parseChapter.chapterTitle) {
          let inputData = [];
          for (let setion of parseChapter.setions) {
            inputData.push({
              title: setion.title,
              chapter_id: chapter.id,
              url: `https://ncode.syosetu.com/${setion.href}`
            })
          }
          chapter.setions = await Setion.insertAll(inputData)
          // console.log(response)
          this.cdRef.detectChanges();
          return
        }
      })
    }
    this.cdRef.detectChanges();
  }


  goBack() {
    this.location.back();
  }

  goChapter(data: any) {
    // console.log(this.novelUrl, data)
    this.router.navigate([''], {
      state: {
        url: ''
      }
    });
  }

}
