// import { getLocationObjects } from './data.js'
// import { getBboxpiles, getdataBboxpiles } from './Bboxes.js'
import { getDataforPiles } from './data.js'

// const Bboxespiles = getBboxpiles();
// const dataBboxespiles = getdataBboxpiles();
const DataBboxespilesEmissions = getDataforPiles();

const ListPilesDbIds = [3648, 3688, 3689, 3690, 3691, 3692, 3693, 3694, 3695, 3696, 3697, 3698, 3699, 3700, 3701, 3702, 3703, 3704, 3705, 3706, 3707, 3708, 3709, 3710, 3711, 3712, 3713, 3714, 3715, 3716, 3717, 3718, 3719, 3720, 3721, 3722, 3723, 3724, 3725, 3726, 3727, 3728, 3729, 3730, 3731, 3732, 3733, 3734, 3735, 3736, 3737, 3738, 3739, 3740, 3741, 3742, 3743, 3744, 3745, 3746, 3747, 3748, 3749, 3750, 3751, 3752, 3753, 3754, 3755, 3756, 3757, 3758, 3759, 3760, 3761, 3762, 3763, 3764, 3765, 3766, 3767, 3768, 3769, 3770, 3771, 3772, 3773, 3774, 3775, 3776, 3777, 3778, 3779, 3780, 3781, 3782, 3783, 3784, 3785, 3786, 3787, 3788, 3789, 3790, 3791, 3792, 3793, 3794, 3795, 3796, 3797, 3798, 3799, 3800, 3801, 3802, 3803, 3804, 3805, 3806, 3807, 3808, 3809, 3810, 3811, 3812, 3813, 3814, 3815, 3816, 3817, 3818, 3819, 3820, 3821, 3822, 3823, 3824, 3825, 3826, 3827, 3828, 3829, 3830, 3831, 3832, 3833, 3834, 3835, 3836];



class PilesHeatmap extends Autodesk.Viewing.Extension {
    
    constructor(viewer, options) {
        super(viewer, options);
        this._extension = null;
        this._group = null;
        this._button = null;
        this._isHeatmapShowing = false;
    }

    load() {

        // setTimeout(() =>  { 
        //     this.AddEmissions();
        // }, 15000)

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
        console.log('PilesHeatmap has been unloaded');
        return true;
    }


    async loadHeatmap() {
        this._extension = await this.viewer.loadExtension("Autodesk.DataVisualization");

        const {
            SurfaceShadingData,
            SurfaceShadingPoint,
            SurfaceShadingNode,
        } = Autodesk.DataVisualization.Core;
        
        
        const shadingNode1 = new SurfaceShadingNode("Piles1", [3746, 3716, 3745, 3715]);
        const shadingNode2 = new SurfaceShadingNode("Piles2", [3744, 3714, 3743, 3713]); //new SurfaceShadingNode(id, dbIds, shadingPoints(optional), name(optional)) 
        const shadingNode3 = new SurfaceShadingNode("Piles3", [3742, 3712, 3741, 3711]);
        //can use array of dbIds on surface sahding node, read more https://forge.autodesk.com/en/docs/dataviz/v1/reference/Core/SurfaceShadingNode/
        const shadingPoint1 = new SurfaceShadingPoint("Pile-sensor-1", undefined, ["NOx", "CO2"]); //new SurfaceShadingPoint(id, position, types, name, contextData)
        const shadingPoint2 = new SurfaceShadingPoint("Pile-sensor-2", undefined, ["NOx", "CO2"]);
        const shadingPoint3 = new SurfaceShadingPoint("Pile-sensor-3", undefined, ["NOx", "CO2"]);
        // Note that the surface shading point was created without an initial
        // position, but the position can be set to the center point of the
        // bounding box of a given DBid with the function call below.
        shadingPoint1.positionFromDBId(this.viewer.model, 3745); //this.viewer.model is the  (model) in the API description
        shadingNode1.addPoint(shadingPoint1);
        shadingPoint2.positionFromDBId(this.viewer.model, 3743); //this.viewer.model is the  (model) in the API description
        shadingNode2.addPoint(shadingPoint2);
        shadingPoint3.positionFromDBId(this.viewer.model, 3741); //this.viewer.model is the  (model) in the API description
        shadingNode3.addPoint(shadingPoint3);
        
        const heatmapData = new SurfaceShadingData();
        heatmapData.addChild(shadingNode1);
        heatmapData.addChild(shadingNode2);
        heatmapData.addChild(shadingNode3);
        heatmapData.initialize(this.viewer.model);

        
        await this._extension.setupSurfaceShading(this.viewer.model, heatmapData);

        this._extension.registerSurfaceShadingColors("NOx", ['#00ff00', '#ffff00', '#FF0000' ]);
        this._extension.registerSurfaceShadingColors("CO2", ['#00ff00', '#ffff00', '#FF0000' ]); //'#ff0090', '#8c00ff', '#00fffb'


        const testValues = {
            "Pile-sensor-1": { 
                "currentIndex": 0,
                "NOx": [
                    0.2544,
                    0.425,
                    0.66,
                    0.7554,
                    0.4367,
                    0.87658762,
                    0.9679674,
                    0.97696,
                    0.96747554,
                    0.3564367
                ],
            //     "CO2": [
            //         0.87658762,
            //         0.9679674,
            //         0.97696,
            //         0.96747554,
            //         0.3564367,
            //         0.2544,
            //         0.425,
            //         0.66,
            //         0.7554,
            //         0.4367
            //     ]
            // },
            "CO2": [
                (DataBboxespilesEmissions[0].TotalEmissions)/10,
                0.8
            ]
        },
            "Pile-sensor-2": {
                "currentIndex": 0,
                "NOx": [
                    0.5222,
                    0.9679674,
                    0.97696,
                    0.96747554,
                    0.3564367,
                    0.2544,
                    0.425,
                    0.66,
                    0.7554,
                    0.4367
                ],
                "CO2": [
                    (DataBboxespilesEmissions[1].TotalEmissions)/10,
                    0.6
                ]
            },
            "Pile-sensor-3": {
                "currentIndex": 0,
                "NOx": [
                    0.9544,
                    0.425,
                    0.66,
                    0.7554,
                    0.4367,
                    0.87658762,
                    0.9679674,
                    0.97696,
                    0.96747554,
                    0.3564367
                ],
                "CO2": [
                    (DataBboxespilesEmissions[2].TotalEmissions)/10,
                    0.2
                ]
            }
                
        }

        function getSensorValueFromId(shadingPointId, sensorType) {
            const shadingPoint = testValues[shadingPointId];
            const currentIndex = shadingPoint["currentIndex"];
            const typeValues = shadingPoint[sensorType]
            shadingPoint["currentIndex"] = currentIndex + 1 < typeValues.length ? currentIndex + 1 : 0;
            const value = typeValues[currentIndex];
            return value;
        }

        // Function that provides the value. This needs to be updated for generating automatically from list of devices, see referneces herehttps://forge.autodesk.com/en/docs/dataviz/v1/developers_guide/examples/heatmap/create_heatmap_for_rooms/
        function getSensorValue(surfaceShadingPoint, sensorType) {
            console.log(surfaceShadingPoint, sensorType);
            const value = getSensorValueFromId(surfaceShadingPoint.id, sensorType);
            console.log(value);
            return value;
        }
            

        // this._extension.renderSurfaceShading(["Piles1", "Piles2", "Piles3"], "NOx", getSensorValue); //renderSurfaceShading(nodeIds, sensorType, valueCallback, options). nodeIds = One or more identifiers of nodes to render. The callback function that will be invoked when surface shading requires the sensor value to render.
        this._extension.renderSurfaceShading(["Piles1", "Piles2", "Piles3"], "CO2", getSensorValue); //renderSurfaceShading(nodeIds, sensorType, valueCallback, options). nodeIds = One or more identifiers of nodes to render. The callback function that will be invoked when surface shading requires the sensor value to render.

        // this._extension.renderSurfaceShading("Piles2", "Temperature", getSensorValue2); 
            // Update sensor values every 2 sec
        setInterval(() => {
            this._extension.updateSurfaceShading(getSensorValue);
            // this._extension.updateSurfaceShading(getSensorValue2);
        }, 5000);
        
        
      


        console.log('loadheatmapextension logged');
    }


    disableHeatmap() {
        this._extension.removeSurfaceShading(this.viewer.model);
        
    }


    onToolbarCreated() {
        this._group = this.viewer.toolbar.getControl('dashboard-toolbar-group'); //if it exists it puts here
        if (!this._group) { // Create a new toolbar group if it doesn't exist
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('TestHeatmapButton');
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

        this._button.setToolTip('Piles Heatmap Extension'); // when wehover the button 
        this._button.addClass('HeatmapExtension'); //css id if we want to style
        this._group.addControl(this._button);

    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('PilesHeatmap', PilesHeatmap);




////       old data
//  const sensorVals = [ 
            //             {ts: 1664920742000, value: 24.535155000000124},                   
            //             {ts: 1664920682000, value: 29.626842499999842},                  
            //             {ts: 1664920622000, value: 22.851172499999958},                
            //             {ts: 1664920562000, value: 50.57262249999999},                 
            //             {ts: 1664920502000, value: 70.592862499999974},                   
            //             {ts: 1664920442000, value: 30.832412500000117},                    
            //             {ts: 1664920382000, value: 40.298247499999853},                    
            //             {ts: 1664920322000, value: 25.329955000000094},                     
            //             {ts: 1664920262000, value: 18.325779999999984},
            //             {ts: 1664920202000, value: 88.164917500000165},
            //             {ts: 1664920202000, value: 56.164917500000165},
            //             {ts: 1664920202000, value: 67.164917500000165},
            //             {ts: 1664920202000, value: 35.164917500000165},
            //             {ts: 1664920202000, value: 87.164917500000165},
            //             {ts: 1664920202000, value: 97.164917500000165},
            //             {ts: 1664920202000, value: 34.164917500000165},

                    
            //             ]
            //             const returnValue = sensorVals[currentSensorIndex].value / 100; //values need to be between 0 and 1 
            //             console.log(returnValue);
            //     currentSensorIndex = currentSensorIndex + 1 < sensorVals.length ? currentSensorIndex + 1 : 0;
            //     // currentSensorIndex = currentSensorIndex++;
            //      return returnValue;
            // }

            // function getSensorValue2() {
            //     const val = Math.random();  
            //     console.log(val); 
            //     return val;
            // }


//let sensorVals = []; in the beginning???

// async loadHeatmap() {
//     this._extension = await this.viewer.loadExtension("Autodesk.DataVisualization");

//     const {
//         SurfaceShadingData,
//         SurfaceShadingPoint,
//         SurfaceShadingNode,
//     } = Autodesk.DataVisualization.Core;
    
//     const shadingNode = new SurfaceShadingNode("Piles", [3747, 3748, 3749, 3750, 3751, 3752, 3753, 3754]); //new SurfaceShadingNode(id, dbIds, shadingPoints(optional), name(optional)) 
//     //can use array of dbIds on surface sahding node, read more https://forge.autodesk.com/en/docs/dataviz/v1/reference/Core/SurfaceShadingNode/
//     const shadingPoint = new SurfaceShadingPoint("Pile-sensor-1", undefined, ["Temperature"]); //new SurfaceShadingPoint(id, position, types, name, contextData)
    
//     // Note that the surface shading point was created without an initial
//     // position, but the position can be set to the center point of the
//     // bounding box of a given DBid with the function call below.
//     shadingPoint.positionFromDBId(this.viewer.model, 3751); //this.viewer.model is the  (model) in the API description
//     shadingNode.addPoint(shadingPoint);
    
//     const heatmapData = new SurfaceShadingData();
//     heatmapData.addChild(shadingNode);
//     heatmapData.initialize(this.viewer.model);
    
//     await this._extension.setupSurfaceShading(this.viewer.model, heatmapData);

//     this._extension.registerSurfaceShadingColors("Temperature", ['#00ff00', '#ffff00', '#FF0000' ]);

//     // Function that provides the value. This needs to be updated for generating automatically from list of devices, see referneces herehttps://forge.autodesk.com/en/docs/dataviz/v1/developers_guide/examples/heatmap/create_heatmap_for_rooms/
//     let currentSensorIndex = 0
//     function getSensorValue() {
//             // return Math.random();; //return a number e.g. return 2
            
//                 const sensorVals = [ 
//                     {ts: 1664920742000, value: 24.535155000000124},                   
//                     {ts: 1664920682000, value: 29.626842499999842},                  
//                     {ts: 1664920622000, value: 22.851172499999958},                
//                     {ts: 1664920562000, value: 50.57262249999999},                 
//                     {ts: 1664920502000, value: 70.592862499999974},                   
//                     {ts: 1664920442000, value: 30.832412500000117},                    
//                     {ts: 1664920382000, value: 40.298247499999853},                    
//                     {ts: 1664920322000, value: 25.329955000000094},                     
//                     {ts: 1664920262000, value: 18.325779999999984},
//                     {ts: 1664920202000, value: 88.164917500000165},
//                     {ts: 1664920202000, value: 56.164917500000165},
//                     {ts: 1664920202000, value: 67.164917500000165},
//                     {ts: 1664920202000, value: 35.164917500000165},
//                     {ts: 1664920202000, value: 87.164917500000165},
//                     {ts: 1664920202000, value: 97.164917500000165},
//                     {ts: 1664920202000, value: 34.164917500000165},

                
//                     ]
//                     const returnValue = sensorVals[currentSensorIndex].value / 100; //values need to be between 0 and 1 
//                     console.log(returnValue);
//             currentSensorIndex = currentSensorIndex + 1 < sensorVals.length ? currentSensorIndex + 1 : 0;
//             // currentSensorIndex = currentSensorIndex++;
//              return returnValue;
//         }

//     this._extension.renderSurfaceShading("Piles", "Temperature", getSensorValue); //renderSurfaceShading(nodeIds, sensorType, valueCallback, options). nodeIds = One or more identifiers of nodes to render. The callback function that will be invoked when surface shading requires the sensor value to render.
//     this._extension.renderSurfaceShading("Piles2", "Temperature", getSensorValue); 
//         // Update sensor values every 2 sec
//     setInterval(() => {
//         this._extension.updateSurfaceShading(getSensorValue);
//     }, 2000);
    
//     // this._extension.updateSurfaceShading(getSensorValue);


//     console.log('loadheatmapextension logged');
// }