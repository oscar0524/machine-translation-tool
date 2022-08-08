import { Component, OnInit } from '@angular/core';

interface NovalTranslatorDataProperty {
  checked: boolean;
  original: string;
  translate: string;
}

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss']
})
export class ComparisonComponent implements OnInit {
  original: string = '';
  translate: string = '';
  novalTranslatorData: NovalTranslatorDataProperty[] = [];
  novalTranslatorDataDisplayedColumns = ['check', 'original', 'translate', 'management'];


  constructor() { }

  ngOnInit(): void {
  }

  importNovalTranslator() {

  }

  syncNovalData() {

  }

  novalTranslatorChecked(row: NovalTranslatorDataProperty) {

  }

  novalTranslatorEdit(row: NovalTranslatorDataProperty) {

  }
  novalTranslatorDelete(row: NovalTranslatorDataProperty) {

  }

}
