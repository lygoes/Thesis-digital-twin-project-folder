

class TestHeatmapForArea extends Autodesk.Viewing.Extension {
    
    constructor(viewer, options) {
        super(viewer, options);
        this._extension = null;
        this._group = null;
        this._button = null;
        this._isHeatmapShowing = false;
    }

    load() {
        // console.log('TestHeatmapForArea has been loaded');
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
        console.log('TestHeatmapFor has been unloaded');
        return true;
    }

    async loadHeatmap() {
        this._extension = await this.viewer.loadExtension("Autodesk.DataVisualization");
       
        const structureInfo = new Autodesk.DataVisualization.Core.ModelStructureInfo(this.viewer.model);

        const devices = [
            {
                id: "Room 6", // An ID to identify this device
                position: { "x":139.9202427940741,"y":152.23634559304645,"z":-19.456626892089787 }, //  coordinates of this device, remember it needs to be Lmv (viewer coordinates)
                sensorTypes: ["temperature"], // The types/properties this device exposes, can have more
            },
            {
                id: "Room 7", // An ID to identify this device
                position: {"x":135.87221126060746,"y":40.59099486916733,"z":-19.456626892089844}, //  coordinates of this device, remember it needs to be Lmv (viewer coordinates)
                sensorTypes: ["temperature"], // The types/properties this device exposes, can have more
            },
            {
                id: "Room 8", // An ID to identify this device
                position: {"x":63.57436448382825,"y":-90.24414982597978,"z":-19.456626892089844}, //  coordinates of this device, remember it needs to be Lmv (viewer coordinates)
                sensorTypes: ["temperature"], // The types/properties this device exposes, can have more
            },
  
            {
                id: "Room 9", // An ID to identify this device
                position: {"x":-38.35929081879158,"y":-133.81300469013678,"z":-19.456626892089787}, //  coordinates of this device, remember it needs to be Lmv (viewer coordinates)
                sensorTypes: ["temperature"], // The types/properties this device exposes, can have more
            },
  
            {
                id: "Room 1", // An ID to identify this device
                position: {"x":-86.14471811523866,"y":7.6707910346543144,"z":-19.456626892089844}, //  coordinates of this device, remember it needs to be Lmv (viewer coordinates)
                sensorTypes: ["temperature"], // The types/properties this device exposes, can have more
            },

            {
                id: "Room 2", // An ID to identify this device
                position: {"x":-102.37118442707171,"y":162.99634368212742,"z":-19.4566268920899}, //  coordinates of this device, remember it needs to be Lmv (viewer coordinates)
                sensorTypes: ["temperature"], // The types/properties this device exposes, can have more
            },
            {
                id: "Room 7", // An ID to identify this device
                position: {"x":-86.07555941514305,"y":158.81083388458956,"z":-19.456626892089844}, //  coordinates of this device, remember it needs to be Lmv (viewer coordinates)
                sensorTypes: ["temperature"], // The types/properties this device exposes, can have more
            },
            {
                id: "Room 3", // An ID to identify this device
                position: {"x":0.1422753633430407,"y":1.3952649589107944,"z":-19.456626892089844}, //  coordinates of this device, remember it needs to be Lmv (viewer coordinates)
                sensorTypes: ["temperature"], // The types/properties this device exposes, can have more
            },
  
  
        ];
        
        // Generates `SurfaceShadingData` after assigning each device to a room.
        const shadingData = await structureInfo.generateSurfaceShadingData(devices);
        
        // Use the resulting shading data to generate heatmap from.
        await this._extension.setupSurfaceShading(this.viewer.model, shadingData, {
            // type: "PlanarHeatmap",
            // placementPosition: 0.0,
            // slicingEnabled: true,
        });
        
        // Register color stops for the heatmap. Along with the normalized sensor value
        // in the range of [0.0, 1.0], `renderSurfaceShading` will interpolate the final
        // heatmap color based on these specified colors.
        const sensorColors = [0x0000ff, 0x00ff00, 0xffff00, 0xff0000];
        
        // Set heatmap colors for temperature
        const sensorType = "temperature";
        this._extension.registerSurfaceShadingColors(sensorType, sensorColors);


        // Function that provides sensor value in the range of [0.0, 1.0]
        let currentSensorIndex = 0
        function getSensorValue() {
                // return Math.random();; //return a number e.g. return 2
                
                    const sensorVals = [ 
                        {ts: 1664920742000, value: 24.535155000000124},                   
                        {ts: 1664920682000, value: 29.626842499999842},                  
                        {ts: 1664920622000, value: 22.851172499999958},                
                        {ts: 1664920562000, value: 50.57262249999999},                 
                        {ts: 1664920502000, value: 70.592862499999974},                   
                        {ts: 1664920442000, value: 30.832412500000117},                    
                        {ts: 1664920382000, value: 40.298247499999853},                    
                        {ts: 1664920322000, value: 25.329955000000094},                     
                        {ts: 1664920262000, value: 18.325779999999984},
                        {ts: 1664920202000, value: 88.164917500000165},
                        {ts: 1664920202000, value: 56.164917500000165},
                        {ts: 1664920202000, value: 67.164917500000165},
                        {ts: 1664920202000, value: 35.164917500000165},
                        {ts: 1664920202000, value: 87.164917500000165},
                        {ts: 1664920202000, value: 97.164917500000165},
                        {ts: 1664920202000, value: 34.164917500000165},

                    
                        ]
                        const returnValue = sensorVals[currentSensorIndex].value / 100; //values need to be between 0 and 1 
                        console.log(returnValue);
                currentSensorIndex = currentSensorIndex + 1 < sensorVals.length ? currentSensorIndex + 1 : 0;
                // currentSensorIndex = currentSensorIndex++;
                 return returnValue;
            }

        // This value can also be a room instead of a floor
        const floorName = "Level 0"; //its important that this is defined
        this._extension.renderSurfaceShading(floorName, sensorType, getSensorValue);

        setInterval(() => {
            this._extension.updateSurfaceShading(getSensorValue);
        }, 2000);


        console.log('heatmapforareafunction logged');
    }

    disableHeatmap() {
        this._extension.removeSurfaceShading(this.viewer.model);
    }


    onToolbarCreated() {
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar'); //if it exists it puts here
        if (!this._group) { // Create a new toolbar group if it doesn't exist
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('TestHeatmapForAreaButton');
        this._button.onClick = (event) => {
            if (this._isHeatmapShowing) { // Same as (this._isHeatmapShowing === true)
                // If showing disable sprites.
                this.disableHeatmap();
                this._isHeatmapShowing = false;
            } else { // Same as (else if (!this._isHeatmapShowing))
                // Else if not showing, enable sprites.
                this.loadHeatmap();
                this._isHeatmapShowing = true;
            }
            // instead of having the this._isHeatmapShowing false and true above could just have this line here
            //  this._isHeatmapShowing = !this._isHeatmapShowing; // what this does is that whenever the button is clicked it assigns the oposite value.
        }

        this._button.setToolTip('Test Heatmap for Area Extension'); // when wehover the button 
        this._button.addClass('TestHeatmapForAreaButton'); //css id if we want to style
        this._group.addControl(this._button);

    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('TestHeatmapForArea', TestHeatmapForArea);

