import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ReplaySubject, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  private loadedLibraries: { [url: string]: ReplaySubject<any> } = {};

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  loadScripts(scriptUrls: string[]) {
    return forkJoin(scriptUrls.map(url => this.loadScript(url)));
  }

  loadScript(scriptUrl: string) {
    if (this.loadedLibraries[scriptUrl]) {
      return this.loadedLibraries[scriptUrl].asObservable();
    }

    this.loadedLibraries[scriptUrl] = new ReplaySubject();
    let script;
    if (scriptUrl.includes('.css')) {
      script = this.document.createElement('link');
      script.type = 'text/css';
      script.rel = 'stylesheet';
      script.href = scriptUrl;
    } else {
      script = this.document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = scriptUrl;
    }
    script.onload = () => {
      this.loadedLibraries[scriptUrl].next();
      this.loadedLibraries[scriptUrl].complete();
    };

    this.document.body.appendChild(script);

    return this.loadedLibraries[scriptUrl].asObservable();
  }
}
