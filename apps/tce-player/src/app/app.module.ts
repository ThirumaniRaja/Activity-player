import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LibConfigModule ,DynamicComponentManifest} from '../../../../libs/lib-config/src/lib/lib-config/lib-config.module';
  import { from } from 'rxjs';

  const manifests: DynamicComponentManifest[] = [
    {
      componentId: 'load-player',
      path: 'load-player', // some globally-unique identifier, used internally by the router
      loadChildren: () =>
        import('../../../../libs/activity-player/src/lib/activity-player.module').then(
          mod => mod.ActivityPlayerModule)
    }];
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule ,
    LibConfigModule.forRoot(manifests)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
