
// import myJsondata from './mypath1.json' assert {type: 'json'};
import { getLocationObjects } from './data.js'

//can probably update stuff here to show trajectory overtime like Sprites extebnsion using setInterval

const positiondata = []
class DrawLinesExtension extends Autodesk.Viewing.Extension {
    
    constructor(viewer, options) {
        super(viewer, options);
        this._extension = null;
        this.geometry = null;
        this.linesMaterial = null;
        this.lines = null;
        this._group = null;
        this._button = null;
        this._areLinesShowing = false;
    }

    load() {

        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('DrawLinesExtension has been unloaded');
        return true;
    }


     
     drawLines() {
        this.geometry = new THREE.Geometry();
        const positiondata = getLocationObjects();
        console.log(positiondata)
        const positiondouble = positiondata.flatMap(i => [i,i]);
        for (let i = 1; i < positiondouble.length-1; i++) {
            this.geometry.vertices.push(positiondouble[i].Lmv);
            
          }
        
        console.log(this.geometry.vertices);


        this.linesMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(0x7FFF00),
            transparent: true,
            depthWrite: false,
            depthTest: true,
            linewidth: 10, //will awlways be 1
            opacity: 1.0
        });

        this.lines = new THREE.Line(this.geometry,
            this.linesMaterial,
            THREE.LinePieces)
        
            this.viewer.impl.createOverlayScene(
                'myOverlay', this.linesMaterial)
              
              this.viewer.impl.addOverlay (
                'myOverlay', this.lines)
              
              this.viewer.impl.invalidate (true)

     

   
        console.log('DrawLinesFunction was called');
    }

    eraseLines() {
        this.viewer.impl.removeOverlay(
            'myOverlay', this.lines)
            console.clear();
    }


    onToolbarCreated() {
        this._group = this.viewer.toolbar.getControl('dashboard-toolbar-group'); //if it exists it puts here /
        if (!this._group) { // Create a new toolbar group if it doesn't exist
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('DrawLinesButton');
        this._button.onClick = (event) => {
            if (this._areLinesShowing) { // Same as (this._isSpritesShowing === true)
                // If showing disable sprites.
                this.eraseLines();
                this._areLinesShowing = false;
            } else { // Same as (else if (!this._isSpritesShowing))
                // Else if not showing, enable sprites.
                this.drawLines();
                this._areLinesShowing = true;
            }
            // instead of having the this._isSpritesshowing false and true above could just have this line here
            //  this._isSpritesShowing = !this._isSpritesShowing; // what this does is that whenever the button is clicked it assigns the oposite value.
        }

        this._button.setToolTip('DrawLinesExtension'); // when wehover the button 
        this._button.addClass('DrawLinesIcon'); //css id if we want to style
        this._group.addControl(this._button);

    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('DrawLinesExtension', DrawLinesExtension);

