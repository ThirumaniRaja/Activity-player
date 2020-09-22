import {
  Component,
  ComponentRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ScriptLoaderService } from '../../services/script-loader.service';

declare var tceVideoPlayerRef: any;
declare var tcePlayerReplay: any;
declare var load_TCE_PLAYER_Angular: any;

@Component({
  selector: 'tce-player-activity-player',
  templateUrl: './activity-player.component.html',
  styleUrls: ['./activity-player.component.scss']
})
export class ActivityPlayerComponent implements OnInit {
  @ViewChild('tcePlayerOutlet', { static: true }) tcePlayerOutlet: ElementRef;
  @ViewChild('mediaOverlayOutlet', { static: true, read: ViewContainerRef })
  mediaOverlayOutlet: ViewContainerRef | undefined;
  mediaOverlayRef: ComponentRef<any>;
  mediaOverlaySubscribers: Subscription = new Subscription();
   @Input() resource: any;
  private containerWidth;
  private containerHeight;
  

  constructor(private scriptLoader: ScriptLoaderService) {}

  ngOnInit(): void {
    this.lazyLoadLibs();
  }

  setMediaOverlayListeners() {
    this.mediaOverlaySubscribers = new Subscription();
    this.mediaOverlaySubscribers.add(
      this.mediaOverlayRef.instance.replayMedia.subscribe(() => {
        this.mediaOverlayRef.destroy();
        tcePlayerReplay(
          (<HTMLElement>this.tcePlayerOutlet.nativeElement).querySelector(
            'iframe'
          )
        );
      })
    );

    // this.mediaOverlaySubscribers.add(
    //   this.mediaOverlayRef.instance.playNewMedia.subscribe(
    //     (newResource: Resource) => {
    //      this.playerCloseEmitter.emit(newResource);
    //     }
    //   )
    // );

    this.mediaOverlayRef.onDestroy(() => {
      this.mediaOverlaySubscribers.unsubscribe();
    });
  }

  getMediaSource() {
    this.resource = {
      Resource : {
        downloadFileExtension: undefined,
        encryptedFilePath:
          'd1846c27bdbaf3e6817b7190dbe02576bf4161d24133b5ee357f73861dd0c377ef99d5eeca8799110afd32f4c39414a4daa5ab698bff0cf42bd61063bacc04db791e',
        fileName: 'energy-skate-park-basics_en.html',
        filterStatus: true,
        metaData: {
          ansKeyId: null,
          assetId: 'tool-02b3f6a9-5b83-4436-b280-0730d1255516',
          assetType: null,
          copyright: null,
          description: null,
          encryptedFilePath:
            'd1846c27bdbaf3e6817b7190dbe02576bf4161d24133b5ee357f73861dd0c377ef99d5eeca8799110afd32f4c39414a4daa5ab698bff0cf42bd61063bacc04db791e',
          fileName: 'energy-skate-park-basics_en.html',
          keywords: null,
          lcmsGradeId: 'Dynamics and Kinematics',
          lcmsSubjectId: 'sub-dcae372d-dc9e-490e-b14c-55f2f7bd2c3d',
          mimeType: 'tool',
          subType: 'tool',
          thumbFileName: null,
          title: 'Energy Skate Park: Basics',
          tpId: null
        },
        playerCapsuleRef: {
          instance: 'PlayerCapsuleComponent'
        },
        resourceId: 'tool-02b3f6a9-5b83-4436-b280-0730d1255516',
        resourceType: 'tcevideo',
        show: true,
        tcetype: 'tool',
        thumbnailParams: '',
        title: 'Energy Skate Park: Basics',
        tpId: null,
        visibility: 1
      }
    };

    let path ="/tce-repo-api/1/web/1/content/fileservice/d1846c27bdbaf3e6817b7190dbe02576bf4161d24133b5ee357f73861dd0c377ef99d5eeca8799110afd32f4c39414a4daa5ab698bff0cf42bd61063bacc04db791e/tool-02b3f6a9-5b83-4436-b280-0730d1255516/"
    const playerOutletElement: HTMLElement = this.tcePlayerOutlet.nativeElement;
    setTimeout(() => {
      this.containerWidth = playerOutletElement.clientWidth;
      this.containerHeight = playerOutletElement.clientHeight;
    }, 1000);

    console.log("path",path)
    console.log("----------resource",this.resource.Resource.metaData.mimeType)
    load_TCE_PLAYER_Angular(playerOutletElement, path, this.resource);

  }

  buildPathAndLoad() {
    // const { resourceId } = this.resource;
    // const { encryptedFilePath } = this.resource.metaData;

    // let requestResourceId = '';
    // if (resourceId.toLowerCase().indexOf('test') !== -1) {
    //   requestResourceId = 'CD1DABD1-C988-4B81-A1D9-0C9A8E521CF7';
    // } else {
    //   requestResourceId = resourceId;
    // }

    // this.path =
    //   this.url + '/' + encryptedFilePath + '/' + requestResourceId + '/';
    this.getMediaSource();
  }

  private lazyLoadLibs() {
    this.scriptLoader.loadScript('assets/vendor/svg.js').subscribe(() => {
      this.scriptLoader
        .loadScripts([
          'assets/tcemedia/mediaplayer/tce_player_integrate.js',
          'assets/tcemedia/external/player-html/player/css/mainIndex.css',
          'assets/tcemedia/external/player-html/player/js/shell/tcePlayer.js',
          'assets/tcemedia/mediaplayer/media.js'
        ])
        .subscribe(() => {
          //this.eRef;
          tceVideoPlayerRef = this;
          this.buildPathAndLoad();
        });
    });
  }
}
