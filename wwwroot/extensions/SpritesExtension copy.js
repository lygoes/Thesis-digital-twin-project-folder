// import myJsondata from './mypath1.json' assert {type: 'json'};
import { getLocationObjects } from './data.js'

// console.log('this is working')


// console.log(data)

class SpritesExtension extends Autodesk.Viewing.Extension {
    
    constructor(viewer, options) {
        super(viewer, options);
        this._extension = null;
        this._group = null;
        this._button = null;
        this._isSpritesShowing = true;
    }

    load() {
        // console.log('SpritesExtensions has been loaded');
        setTimeout(() => {
            this.loadDataVizExtn();
         }, 7000);
        
        // this.loadDataVizExtn();
        //doesnt need a button necesasry could just load but you could also set up something here as below
        //this.viewer.addEventListener(could put here something that happens when you select something in the viewer)//
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
        console.log('SpritesExtensions has been unloaded');
        return true;
    }

    async loadDataVizExtn() {
        const positiondata = getLocationObjects();
        console.log(positiondata);
        this._extension = await this.viewer.loadExtension("Autodesk.DataVisualization");
        const DataVizCore = Autodesk.DataVisualization.Core;
        const viewableType = DataVizCore.ViewableType.SPRITE;
        const spriteColor = new THREE.Color(0xffffff);
        // const baseURL = "https://shrikedoc.github.io/data-visualization-doc/_static/";
        // const spriteIconUrl = '`${baseURL}fan-00.svg`';
        const spriteIconUrl = './extensions/drilling.png';
        // const spriteIconUrl = './extensions/excavator.png';

        const style = new DataVizCore.ViewableStyle(
            viewableType,
            spriteColor,
            spriteIconUrl
        );



        const viewableData = new DataVizCore.ViewableData();
        viewableData.spriteSize = 58; // Sprites as points of size 24 x 24 pixels

        const myDataList = [
        { position: positiondata[0].Lmv },
        { position: { x: 0, y: 0, z: 0 } },
        { position: { x: 16.4042, y: 16.4042, z: 0 } },
        // { position: { x: 126.52138962929293, y: 62.02648651411437, z: -10.26402282714838 } }


    ];
        console.log(myDataList);


        myDataList.forEach((myData, index) => {
            const dbId = 10 + index;
            const position = myData.position;
            const viewable = new DataVizCore.SpriteViewable(position, style, dbId);

            viewableData.addViewable(viewable);
            // console.log(viewable.dbId); //this is just to understand how the index is working here, it logs 10, 11 and 12. 
        });

        await viewableData.finish();
        this._extension.addViewables(viewableData);

        
        const spritesToUpdate = this._extension.viewableData.viewables.map((v) => v.dbId); //creates an array with all dbids of the viewables
        // console.log('dbids', spritesToUpdate); //dbids are called 10,11,12
        let currentIndex = 1;
        setInterval(() => {
            this._extension.invalidateViewables(spritesToUpdate[0], (viewable) => { //spritesToUpdate[0] means Im getting only 1db of the array that spritestoupdate return
                return {   
                    position: positiondata[currentIndex].Lmv};
                });
           currentIndex = currentIndex + 1;
        //    console.log(positiondata[currentIndex].Lmv);
        //    currentIndex = currentIndex + 1 < positiondata.length ? currentIndex + 1 : 0;

        }, 1000);

    }

    // disableSprites() {
    //     this._extension.removeAllViewables();
    // }

    HideSprites() {
        this._extension.showHideViewables(false, false)
    }

    ShowSprites() {
        this._extension.showHideViewables(true, false)
        
    }



    onToolbarCreated() {
        this._group = this.viewer.toolbar.getControl('dashboard-toolbar-group'); //if it exists it puts here /
        if (!this._group) { // Create a new toolbar group if it doesn't exist
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('SpriteExtensionButton');
        this._button.onClick = (event) => {
            if (this._isSpritesShowing) { // Same as (this._isSpritesShowing === true)
                // If showing disable sprites.
                this.HideSprites();
                this._isSpritesShowing = false;
            } else { // Same as (else if (!this._isSpritesShowing))
                // Else if not showing, enable sprites.
                this.ShowSprites();
                this._isSpritesShowing = true;
            }
            // instead of having the this._isSpritesshowing false and true above could just have this line here
            //  this._isSpritesShowing = !this._isSpritesShowing; // what this does is that whenever the button is clicked it assigns the oposite value.
        }

        this._button.setToolTip('Sprites Extension'); // when wehover the button 
        this._button.addClass('SpritesExtensionIcon'); //css id if we want to style
        this._group.addControl(this._button);

    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('SpritesExtension', SpritesExtension);



// /wasworkingbelow
//         // positiondata.forEach((element, index) => {
//         //     const dbId = 10 + index;
//         //     const position = element.Lmv;
//         //     const viewable = new DataVizCore.SpriteViewable(position, style, dbId);

//         //     viewableData.addViewable(viewable);
//             // console.log(viewable.dbId); //this is just to understand how the index is working here, it logs 10, 11 and 12. 
//         // });