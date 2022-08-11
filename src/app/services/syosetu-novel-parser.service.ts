import { Injectable } from '@angular/core';
import * as cheerio from 'cheerio';

@Injectable({
  providedIn: 'root'
})
export class SyosetuNovelParserService {

  constructor() { }

  public async downloadHtml(url: string, encoding: string = 'UTF-8'): Promise<string> {

    // document.cookie = 'over18=yes';
    // console.log(document.cookie);
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        cookie: 'over18=yes'
      },
      mode: 'cors'
    });
    let html = '';


    html = await res.text();

    return html;
  }

  public parseName(html: string): string {
    const pattern = /class="novel_title">(.*?)<\/p>/gsm;
    const match = pattern.exec(html);
    let name = "";
    if (match && 1 in match) {
      name = match[1];
    }

    return name;
  }

  public parseWriternameInfo(html: string): { writerNameUrl: string, writerName: string } {
    const $ = cheerio.load(html, {
      xmlMode: false,
      decodeEntities: false
    });

    let response = {
      writerNameUrl: '',
      writerName: ''
    }

    $('.novel_writername a').each(function (this, data) {
      response.writerNameUrl = $(this).attr('href') ?? ''
      response.writerName = $(this).text()
    });

    return response;
  }

  private parseChapterTitle(html: string): string {
    const pattern = /class="chapter_title">(.*?)<\/div>/gsm;
    const match = pattern.exec(html);
    let chapterTitle = ""
    if (match && 1 in match) {
      chapterTitle = match[1];
    }
    return chapterTitle
  }

  // 章 Chapter 節 setion
  public parseChapters(html: string): { chapterTitle: string; setions: { href: string, title: string }[] }[] {
    let splitHtml = html.split('<div class="chapter_title">')
    // console.log(splitHtml)
    let response: { chapterTitle: string; setions: { href: string, title: string }[] }[] = []
    for (let index = 1; index < splitHtml.length; index++) {
      const value = splitHtml[index]
      let chapterTitle = this.parseChapterTitle('<div class="chapter_title">' + value)
      const $ = cheerio.load(value, {
        xmlMode: false,
        decodeEntities: false
      });
      const setions: { href: string, title: string }[] = [];
      $('.novel_sublist2 a').each(function (this, data) {
        setions.push({
          href: $(this).attr('href') ?? '',
          title: $(this).text()
        });
      });
      response.push({
        chapterTitle: chapterTitle,
        setions: setions
      })
    }

    // console.log(response)
    return response
  }


}
