import { ChangeDetectionStrategy, ChangeDetectorRef, ApplicationRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../services/electron.service';
import { Chapter } from '../model/chapter';
import { TranslateArg } from '../model/translate-arg';
import { IpcChannel } from '../model/ipc-channel';

const chineseConv = require('chinese-conv');

const TRANSLATOR_NOVEL_NAME = 'translator-novel-name';
const TRANSLATOR_EPISODE_NAME = 'translator-episode-name';
const TRANSLATOR_CHAPTER_NAME = 'translator-chapter-name';
const TRANSLATOR_SENTENCES = 'translator-sentences';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatorComponent implements OnInit, OnDestroy {
  novelDataDisplayedColumns = ['original', 'translate'];
  progressValue = 0;

  chapter: Chapter;
  re = new RegExp('^　', 'g');

  constructor(private router: Router,
    private electron: ElectronService,
    private cdRef: ChangeDetectorRef,
    private aRef: ApplicationRef) {

    const state = router.getCurrentNavigation()!.extras.state;
    if (state === undefined || state === null || !Object.keys(state).includes('chapter')) {
      this.router.navigate(['']);
    }
    this.chapter = state!['chapter'];
  }

  ngOnDestroy(): void {
    this.electron.ipcRenderer.removeAllListeners(IpcChannel.translateResponse);
  }

  ngOnInit(): void {
    this.electron.ipcRenderer.addListener(IpcChannel.translateResponse, (ev, arg) => this.translateListener(arg));
  }

  translateListener(response: TranslateArg) {
    // console.log(arg);
    // console.log(this.chapter);

    switch (response.channel) {
      case TRANSLATOR_NOVEL_NAME: {
        this.chapter.novelName.translation = chineseConv.tify(response.translate);
        response.channel = TRANSLATOR_EPISODE_NAME;
        response.translate = '';
        response.original = this.chapter.episodeName.original;
        this.electron.ipcRenderer.invoke(IpcChannel.translateRequest, response);
        break;
      }
      case TRANSLATOR_EPISODE_NAME: {
        this.chapter.episodeName.translation = chineseConv.tify(response.translate);
        response.channel = TRANSLATOR_CHAPTER_NAME;
        response.translate = '';
        response.original = this.chapter.name.original;
        this.electron.ipcRenderer.invoke(IpcChannel.translateRequest, response);
        break;
      }
      case TRANSLATOR_CHAPTER_NAME: {
        this.chapter.name.translation = chineseConv.tify(response.translate);
        response.channel = TRANSLATOR_SENTENCES;
        response.index = 0;
        response.translate = '';
        response.original = this.chapter.sentences[0].original;
        this.electron.ipcRenderer.invoke(IpcChannel.translateRequest, response);
        break;
      }
      case TRANSLATOR_SENTENCES: {
        this.chapter.sentences[response.index!].translation = chineseConv.tify(response.translate.replace(this.re, ''));

        if (response.index! < this.chapter.sentences.length) {
          response.index!++;
          while (this.chapter.sentences[response.index!].original === '') {
            response.index!++;
            if (response.index! >= this.chapter.sentences.length) {
              this.electron.ipcRenderer.invoke(IpcChannel.progressValueSet, 0);
              this.cdRef.detectChanges();
              return;
            }
          }
          response.translate = '';
          response.original = this.chapter.sentences[response.index!].original;
          this.electron.ipcRenderer.invoke(IpcChannel.translateRequest, response);
        }
        this.electron.ipcRenderer.invoke(IpcChannel.progressValueSet, response.index! / this.chapter.sentences.length * 100);

        break;
      }
    }
    // this.chapter = this.chapter;
    this.cdRef.detectChanges();
    // this.aRef.tick();
  }

  runTranslator() {
    // console.log('start translator');
    const requestArg: TranslateArg = {
      channel: TRANSLATOR_NOVEL_NAME,
      index: 0,
      translate: '',
      original: this.chapter.novelName.original
    };
    this.electron.ipcRenderer.invoke(IpcChannel.translateRequest, requestArg);
  }




}
