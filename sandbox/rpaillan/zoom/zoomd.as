 package  {

    import flash.display.Sprite;
    import flash.display.StageScaleMode;
    import flash.external.ExternalInterface;
    import flash.system.Security;
 
    [SWF(backgroundColor="#000", width="1", height="20", frameRate="5")]
    public class zoomd extends Sprite {
    
        function zoomd():void {
            Security.allowDomain("*");
            Security.allowInsecureDomain("*");
            this.stage.scaleMode = StageScaleMode.NO_SCALE;
            ExternalInterface.addCallback("getZoomLevel", getZoomLevel);
            ExternalInterface.addCallback("getZoomLevelInfo", getZoomLevelInfo);
        }

        public function getZoomLevel():Number {
            return this.stage.stageHeight / (root.loaderInfo.height || this.stage.stageHeight);
        }
        public function getZoomLevelInfo():String {
            return this.stage.stageHeight + ' ' +  root.loaderInfo.height;
        }
     }
  }