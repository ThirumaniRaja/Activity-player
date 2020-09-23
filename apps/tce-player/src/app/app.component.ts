import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivityPlayerModule } from 'libs/activity-player/src/lib/activity-player.module';
import { ActivityPlayerComponent } from 'libs/activity-player/src/lib/components/activity-player/activity-player.component';
import { LibConfigService } from 'libs/lib-config/src/lib/services/lib-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'tce-player';

  @ViewChild('qb', { static: false, read: ViewContainerRef })
  qb: ViewContainerRef | undefined;

  showBtn = true;

  constructor( private libConfigService: LibConfigService) { }

  ngOnInit(): void {
  }
  
  loadPlayer(){
    if (this.qb) {
      this.qb.clear();
      this.loadActivityPlayer();
      this.showBtn = false;
    }
  }

  loadActivityPlayer() {
    this.libConfigService
      .getComponentFactory<ActivityPlayerComponent>('load-player')
      .subscribe({
        next: componentFactory => {
          if (!this.qb) {
            return;
          }
          const ref = this.qb.createComponent(componentFactory);
          ref.changeDetectorRef.detectChanges();
         
        },
        error: err => {
          console.warn(err);
        }
      });
  }
}

