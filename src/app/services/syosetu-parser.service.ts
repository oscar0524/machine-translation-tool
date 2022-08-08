/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@angular/core';
import * as cheerio from 'cheerio';

@Injectable({
  providedIn: 'root'
})
export class SyosetuParserService {

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

  public parseNovelName(html: string): string {
    const pattern = /class="margin_r20">(.*?)<\/a>/gsm;
    const match = pattern.exec(html);
    let name = "";
    if (match && 1 in match) {
      name = match[1];
    }

    return name;
  }

  public parseNovelNo(html: string): string {
    const pattern = /id="novel_no">(.*?)\//gsm;
    const match = pattern.exec(html);
    let no = "";
    if (match && 1 in match) {
      no = match[1];
    }

    return no;
  }

  public parseChapterTitle(html: string): string {
    let pattern = /<p class="novel_subtitle">(.*?)<\/p>/gsm;
    let match = pattern.exec(html);
    let title = "";
    if (match && 1 in match) {
      title = match[1];
    } else {
      pattern = /<p class="chapter_title">(.*?)<\/p>/gsm;
      match = pattern.exec(html);
      if (match && 1 in match) {
        title = match[1];
      }
    }

    return title;
  }

  public parseEpisode(html: string): string {
    const pattern = /class="chapter_title">(.*?)<\/p>/gsm;
    const match = pattern.exec(html);
    let episode = "";
    if (match && 1 in match) {
      episode = match[1];
    }

    return episode;
  }

  public parseContent(html: string): string[] {
    const $ = cheerio.load(html, {
      xmlMode: false,
      decodeEntities: false
    });
    const content: string[] = [];
    $('#novel_honbun p').each(function (this, data) {
      content.push($(this).text());
    });
    return content;
  }
}
