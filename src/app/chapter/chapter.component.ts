import { ElectronService } from '../services/electron.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Chapter } from '../model/chapter';
import { IpcChannel } from '../model/ipc-channel';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit, AfterViewInit {
  chapter: Chapter;

  chapterContent: string = '';

  constructor(
    private electron: ElectronService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    const state = router.getCurrentNavigation()!.extras.state;
    if (state === undefined || state === null || !Object.keys(state).includes('chapter')) {
      router.navigate(['']);
    }
    this.chapter = state!['chapter'];
    // console.log(this.chapter);

    // this.chapterContent = '';
    // this.chapter.sentences.forEach((val) => {
    //   this.chapterContent += val.translation;
    //   if (val.translation === '') {
    //     this.chapterContent += '\r\n';
    //   }
    // });
    this.electron.ipcRenderer.invoke(IpcChannel.titleChange,
      `${this.chapter.novelName.original} ${this.chapter.episodeName.original} — ${this.chapter.name.original}`);

  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  goTranslator(): void {
    this.router.navigate(['translator'], {
      state: {
        chapter: this.chapter
      }
    });

  }
}
