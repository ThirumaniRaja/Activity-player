import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LibConfigModule } from '../../../../libs/lib-config/src/lib/lib-config/lib-config.module';
import { ActivityPlayerComponent } from './components/activity-player/activity-player.component';
import { from } from 'rxjs';

@NgModule({
  imports: [CommonModule,
    LibConfigModule.forChild(ActivityPlayerComponent)],
  declarations: [ActivityPlayerComponent],
  exports: [ActivityPlayerComponent],
  entryComponents: [ActivityPlayerComponent]
})
export class ActivityPlayerModule {}
