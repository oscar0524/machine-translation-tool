import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Chapter } from '../model/chapter';
import { SyosetuNovelParserService } from '../services/syosetu-novel-parser.service';

@Component({
  selector: 'app-novel',
  templateUrl: './novel.component.html',
  styleUrls: ['./novel.component.scss']
})
export class NovelComponent implements OnInit {
  novelUrl: string
  novelName: string = ''
  writerName: string = ''
  writerNameUrl: string = ''
  episodes: {
    episodeName: string;
    chapters: any[];
  }[] = []

  constructor(
    private router: Router,
    private location: Location,
    private syosetuNovelParser: SyosetuNovelParserService
  ) {
    const state = this.router.getCurrentNavigation()!.extras.state;
    if (state === undefined || state === null || !Object.keys(state).includes('url')) {
      this.router.navigate(['']);
    }
    this.novelUrl = state!['url'];
  }

  ngOnInit(): void {


  }

  async ngAfterViewInit(): Promise<void> {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const html = await this.syosetuNovelParser.downloadHtml(this.novelUrl);
    this.novelName = this.syosetuNovelParser.parseName(html);
    const { writerNameUrl, writerName } = this.syosetuNovelParser.parseWriternameInfo(html);
    this.writerNameUrl = writerNameUrl;
    this.writerName = writerName;
    this.episodes = this.syosetuNovelParser.parseEpisodes(html);
    // console.log(this.chapters)
  }


  goBack() {
    this.location.back();
  }

  goChapter(data: any) {
    // console.log(this.novelUrl, data)
    this.router.navigate(['chapter'], {
      state: {
        url: 'https://ncode.syosetu.com/' + data[0]
      }
    });
  }

}
