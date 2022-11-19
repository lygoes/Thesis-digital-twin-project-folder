import { getAirIntelLatestMeasurements, getAirIntelMeasurement, AGGREGATION_FUNCTIONS } from '../fetch.js';

class TestHeatmapwithvalue extends Autodesk.Viewing.Extension {

    constructor(viewer, options) {
        super(viewer, options);
        this._extension = null;
        this._group = null;
        this._button = null;
        this._isHeatmapShowing = false;
    }

    load() {
        console.log('HeatmapExtension has been loaded');
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
        console.log('HeatmapExtension has been unloaded');
        return true;
    }

    async getMeasurement() {
        const startDate = new Date('09/05/2022');
        const endDate = new Date('10/05/2022');
    
        const measurement = await getAirIntelMeasurement(
            '88069cc0-0b1b-11ec-a709-299dc78f8a52',
            ['NO2', 'PM2.5'],
            startDate.getTime(),
            endDate.getTime(),
            0,
            100,
            AGGREGATION_FUNCTIONS.NONE
        );
        
        measurement.NO2.forEach(i => {
            if (typeof i.value === 'string') {
                i.value = parseFloat(i.value) / 100;
            }
        });
        // return measurement;
        return measurement.NO2; //remember to change this if there are more than NO2
    }

    async loadHeatmap() {
        const sensorVals = await this.getMeasurement(); //calls get measurement and stores it here

        this._extension = await this.viewer.loadExtension("Autodesk.DataVisualization");

        const {
            SurfaceShadingData,
            SurfaceShadingPoint,
            SurfaceShadingNode,
        } = Autodesk.DataVisualization.Core;

        const shadingNode = new SurfaceShadingNode("Pile", 3782); //new SurfaceShadingNode(id, dbIds, shadingPoints(optional), name(optional))
        //can use array of dbIds on surface sahding node, read more https://forge.autodesk.com/en/docs/dataviz/v1/reference/Core/SurfaceShadingNode/
        const shadingPoint = new SurfaceShadingPoint("Pile-sensor-1", undefined, ["Temperature"]); //new SurfaceShadingPoint(id, position, types, name, contextData)

        // Note that the surface shading point was created without an initial
        // position, but the position can be set to the center point of the
        // bounding box of a given DBid with the function call below.
        shadingPoint.positionFromDBId(this.viewer.model, 3782); //this.viewer.model is the  (model) in the API description
        shadingNode.addPoint(shadingPoint);

        const heatmapData = new SurfaceShadingData();
        heatmapData.addChild(shadingNode);
        heatmapData.initialize(this.viewer.model);

        await this._extension.setupSurfaceShading(this.viewer.model, heatmapData);

        this._extension.registerSurfaceShadingColors("Temperature", ['#00ff00', '#ffff00', '#ff0000']);
 

        console.log('loadheatmapextension logged');

        let currentSensorIndex = 0
        function getSensorValue() {

        const returnValue = sensorVals[currentSensorIndex].value; //sensorVals are defined in the beginning 
        console.log(returnValue);
        currentSensorIndex = currentSensorIndex + 1 < sensorVals.length ? currentSensorIndex + 1 : 0;
        return returnValue;
    }

    this._extension.renderSurfaceShading("Pile", "Temperature", getSensorValue);

    setInterval(() => {
        this._extension.updateSurfaceShading(getSensorValue);
    }, 2000);


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
        this._button = new Autodesk.Viewing.UI.Button('TestHeatmapButtonwithvallue');
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

        this._button.setToolTip('Test Heatmap Extensionwithvalue'); // when wehover the button
        this._button.addClass('HeatmapExtensionwithvalue'); //css id if we want to style
        this._group.addControl(this._button);

    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('TestHeatmapwithAirLab', TestHeatmapwithvalue);

