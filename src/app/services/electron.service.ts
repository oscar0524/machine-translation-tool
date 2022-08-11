import { Injectable } from '@angular/core';

import { ipcRenderer, webFrame } from 'electron';
import { opendir } from 'fs/promises'
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;
  path!: typeof path;
  opendir!: typeof opendir;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.opendir = window.require('fs/promises').opendir
      this.path = window.require('path')
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
}
