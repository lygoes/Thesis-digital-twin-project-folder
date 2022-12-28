import { BaseExtension } from './BaseExtension.js';
import { getDataforPiles } from './DataProcessing.js';


//this is used in tables, charts and heatmap - sets the order for clicking on the pile and seeing correct data
const ListPilesDbIds = [3648, 3688, 3689, 3690, 3691, 3692, 3693, 3694, 3695, 3696, 3697, 3698, 3699, 3700, 3701, 3702, 3703, 3704, 3705, 3706, 3707, 3708, 3709, 3710, 3711, 3712, 3713, 3714, 3715, 3716, 3717, 3718, 3719, 3720, 3721, 3722, 3723, 3724, 3725, 3726, 3727, 3728, 3729, 3730, 3731, 3732, 3733, 3734, 3735, 3736, 3737, 3738, 3739, 3740, 3741, 3742, 3743, 3744, 3745, 3746, 3747, 3748, 3749, 3750, 3751, 3752, 3753, 3754, 3755, 3756, 3757, 3758, 3759, 3760, 3761, 3762, 3763, 3764, 3765, 3766, 3767, 3768, 3769, 3770, 3771, 3772, 3773, 3774, 3775, 3776, 3777, 3778, 3779, 3780, 3781, 3782, 3783, 3784, 3785, 3786, 3787, 3788, 3789, 3790, 3791, 3792, 3793, 3794, 3795, 3796, 3797, 3798, 3799, 3800, 3801, 3802, 3803, 3804, 3805, 3806, 3807, 3808, 3809, 3810, 3811, 3812, 3813, 3814, 3815, 3816, 3817, 3818, 3819, 3820, 3821, 3822, 3823, 3824, 3825, 3826, 3827, 3828, 3829, 3830, 3831, 3832, 3833, 3834, 3835, 3836];

// console.log(ListPilesDbIds); 

//necessary for the heatmap 
const DataBboxespilesEmissions = getDataforPiles(); //I think this is the same as data ForallPiles - test
const PilesNames = []
for (let i = 1; i < ListPilesDbIds.length + 1; i++) {
    const Names = 'Pile' + i
    PilesNames.push(Names)
}

// console.log(PilesNames)

const SensorPointsNames = []
for (let i = 1; i < ListPilesDbIds.length + 1; i++) {
    const PointNames = 'Pile-sensor-' + i
    SensorPointsNames.push(PointNames)
}

//necessary for the charts 
const dataForallPiles = [];
const Emissiondata = [];
const WorkingTime = [];

let newchartData = [];
let newChartLabel = [];
let newChartWorkingTime = [];

// const PilesNames = ['Pile 1', 'Pile 2', 'Pile 3', 'Pile 4'] //for piles charts - will use the above

setTimeout(() => {
    const data = getDataforPiles();
    dataForallPiles.push(data);
    dataForallPiles[0].forEach(i => {
        Emissiondata.push(i.TotalEmissions)
        WorkingTime.push(i.WorkingTime)

    })
    // console.log('here is the data', dataForallPiles);
    // console.log(Emissiondata)
    // console.log('emission data 0 for test', Emissiondata[0])   
}, 10000) //not sure if this is needed here because there is another one down there when creating the panels


class SiteSensorsList extends BaseExtension {
    constructor(viewer, options) {
        super(viewer, options);
        // this._barChartButton = null;
        this._barChartPanel = null;
        this._SensorListPanel = null;
        this._ActivitiesOverviewPanel = null;
        this._extension = null; //heATMAP
        this._isHeatmapShowing = false; //heatmap
        this.Sprites = null;



    }

    async load() {
        super.load();
        await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js', 'Chart');
        Chart.defaults.plugins.legend.display = true;
        // console.log('DatachartPile loaded.');
        return true;
    }

    unload() {
        super.unload();
        for (const button of [this._barChartButton]) {
            this.removeToolbarButton(button);
        }
        this._barChartButton = null;
        for (const panel of [this._barChartPanel]) {
            panel.setVisible(false);
            panel.uninitialize();
        }
        this._barChartPanel = null;
        console.log('DatachartPile unloaded.');
        return true;
    }

    onToolbarCreated() {
        this._barChartPanel = new SiteSensorData(this, 'datachart-site-sensors', 'Site Sensors Data', { x: 10, y: 10, chartType: 'bar' });
        this._Button = this.createToolbarButton('sensor-list-button', 'https://img.icons8.com/external-sbts2018-outline-sbts2018/452/external-sensor-basic-ui-elements-2.3-sbts2018-outline-sbts2018.png', 'Show Site Sensors List');

        setTimeout(() => { //needs the timeout else it creates panel as soon as creates the toolbar. Unless changes
            this._SensorListPanel = new SensorListPanel(this.viewer, this.viewer.container, 'SiteSensorsList', 'Site Sensors list');
            // this._SensorListPanel = new SensorListPanel(this.viewer, this.viewer.container, 'listPilesPanel', 'Piles list');
            this._SiteHeatmapSwitchPanel = new SiteHeatmapSwitchPanel(this.viewer, this.viewer.container, 'SiteHeatmapPanel', 'Site Sensors Heatmap');
        }, 10000)
        this._Button.onClick = () => {
            this.loadSprites()
            this._SensorListPanel.setVisible(!this._SensorListPanel.isVisible());
            this._Button.setState(this._SensorListPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            if (this._SensorListPanel.isVisible() && this.viewer.model) {
                // this._barChartPanel.setModel(this.viewer.model);
            }


            //Gets button to add click event to appear list of piles
            this._SensorListPanel.content.querySelector('#ChartsButton').addEventListener('click', () => {
                // this._SensorListPanel.setVisible(!this._barChartPanel.isVisible());
                // this._Button.setState(this._SensorListPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);

                this._barChartPanel.setVisible(!this._barChartPanel.isVisible());
                this._Button.setState(this._barChartPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
                //Gets button to add click event to initialize piles heatmap 

            })
            this._SensorListPanel.content.querySelector('#HeatmapButton').addEventListener('click', () => {
                this._SiteHeatmapSwitchPanel.setVisible(!this._SiteHeatmapSwitchPanel.isVisible());
                this._Button.setState(this._SiteHeatmapSwitchPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);

                if (this._isHeatmapShowing) { // Same as (this._isHeatmapShowing === true)
                    // If showing disable heatmap.
                    this.disableHeatmap();
                    this._isHeatmapShowing = false;
                } else { // Same as (else if (!this._isHeatmapShowing))
                    // Else if not showing, enable heatmap.
                    this.loadHeatmap();
                    this._isHeatmapShowing = true;
                }

            })

            //below is for updating chart when select container changes
            const selectElement = this._barChartPanel.container.querySelector('select.props');
            selectElement.onchange = (event) => {
                const value = event.target.value;

                switch (value) {
                    case 'CO2':
                        this._barChartPanel.chart.data.datasets[0].data = [30, 50, 60, 20, 70, 80]; //CO2
                        this._barChartPanel.chart.data.datasets[0].label = 'CO2'
                        this._barChartPanel.chart.data.datasets[0].backgroundColor = '#3e95cd'
                        this._barChartPanel.chart.data.datasets[0].borderColor = '#3e95cd'
                        this._barChartPanel.chart.update();
                        console.log('co2 maaand');
                        break;
                    case 'NOx':
                        this._barChartPanel.chart.data.datasets[0].data = [50, 30, 60, 20, 40, 30]; //CO2
                        this._barChartPanel.chart.data.datasets[0].label = 'NOx'
                        this._barChartPanel.chart.data.datasets[0].backgroundColor = "#8e5ea2"
                        this._barChartPanel.chart.data.datasets[0].borderColor = "#8e5ea2"
                        this._barChartPanel.chart.update();
                        console.log('NOx maaand');
                        break;
                    case 'PM':
                        this._barChartPanel.chart.data.datasets[0].data = [20, 10, 30, 20, 5, 10]; //CO2
                        this._barChartPanel.chart.data.datasets[0].label = 'PM'
                        this._barChartPanel.chart.data.datasets[0].backgroundColor = "#FFA500"
                        this._barChartPanel.chart.data.datasets[0].borderColor = "#FFA500"


 
                        this._barChartPanel.chart.update();

                        console.log('PM maaand');
                        break;
                    default:
                        break;
                }
            }
        };



    }

    onModelLoaded(model) {
        super.onModelLoaded(model);
        // if (this._barChartPanel && this._barChartPanel.isVisible()) {
        //     // this._barChartPanel.setModel(model);
        // }

    }

    async onSelectionChanged(model, dbids) {
        // setTimeout(() =>  { 
        super.onSelectionChanged(model, dbids);
        // for (let i = 0; i < ListPilesDbIds.length; i++) {
        //     if (dbids[0] === ListPilesDbIds[i]) {
        //         // console.log('emissiondatapile', Emissiondata[i])
        //         newchartData = Emissiondata[i]
        //         newChartLabel = PilesNames[i]
        //         newChartWorkingTime = WorkingTime[i]
        //         console.log('chartdata', newchartData);
        //         // console.log(this._barChartPanel);
        //         this._barChartPanel.chart.data.datasets[0].data[0] = newchartData;
        //         this._barChartPanel.chart.data.datasets[0].label = newChartLabel;
        //         this._barChartPanel.chart.data.datasets[1].data[0] = newChartWorkingTime;
        //         this._barChartPanel.chart.update();
        //         // this._barChartPanel.setVisible(!this._barChartPanel.isVisible());
        //     }


        // }
        // }, 12000) 
    }

     async loadSprites() {
        console.log('hii')
        // this.Sprites = await this.viewer.loadExtension("Autodesk.DataVisualization");
        // const DataVizCore = Autodesk.DataVisualization.Core;
        // const viewableType = DataVizCore.ViewableType.SPRITE;
        // const spriteColor = new THREE.Color(0xffffff);
        // const highlightColor = new THREE.Color(0xffffff);
        // // const baseURL = "https://shrikedoc.github.io/data-visualization-doc/_static/";
        // // const spriteIconUrl = '`${baseURL}fan-00.svg`';
        // const spriteIconUrl = './extensions/drilling.png';
        // // const spriteIconUrl = './extensions/excavator.png';
       

        // const style = new DataVizCore.ViewableStyle(
        //     viewableType,
        //     spriteColor,
        //     spriteIconUrl,
        //     highlightColor,
        //     spriteIconUrl,
        //     );
            
            
            
        //     const viewableData = new DataVizCore.ViewableData();
        //     viewableData.spriteSize = 58; // Sprites as points of size 24 x 24 pixels
            
        //     const myDataList = [
        //         { position: { x: 0, y: 0, z: 0 } },
        //         { position: { x: 16.4042, y: 16.4042, z: 0 } },
        //         // { position: { x: 126.52138962929293, y: 62.02648651411437, z: -10.26402282714838 } }
                
                
        //     ];
        //     console.log(myDataList);
            
            
        //     myDataList.forEach((myData, index) => {
        //         const dbId = 20 + index;
        //         const position = myData.position;
        //         const viewable = new DataVizCore.SpriteViewable(position, style, dbId);
                
        //         viewableData.addViewable(viewable);
        //         // console.log(viewable.dbId); //this is just to understand how the index is working here, it logs 10, 11 and 12. 
        //     });
            
        //     await viewableData.finish();
        //     this.Sprites.addViewables(viewableData);
    }
    async loadHeatmap() {
        // this._extension = await this.viewer.loadExtension("Autodesk.DataVisualization");

        // const {
        //     SurfaceShadingData,
        //     SurfaceShadingPoint,
        //     SurfaceShadingNode,
        // } = Autodesk.DataVisualization.Core;

        // const ShadingNodes = []
        // for (let i = 0; i < ListPilesDbIds.length; i++) {
        //     const Nodes = new SurfaceShadingNode(PilesNames[i], ListPilesDbIds[i])
        //     // console.log(Nodes)
        //     ShadingNodes.push(Nodes)
        // }

        // const ShadingPoints = []
        // for (let i = 0; i < ListPilesDbIds.length; i++) {
        //     const Points = new SurfaceShadingPoint(SensorPointsNames[i], undefined, ["NOx", "CO2"])
        //     ShadingPoints.push(Points)
        //     ShadingPoints[i].positionFromDBId(this.viewer.model, ListPilesDbIds[i])

        // }
        // console.log('pointssss', ShadingPoints)


        // const heatmapData = new SurfaceShadingData();

        // for (let i = 0; i < ListPilesDbIds.length; i++) {
        //     ShadingNodes[i].addPoint(ShadingPoints[i])
        //     heatmapData.addChild(ShadingNodes[i])
        // }
        // // console.log('Nodesssss', ShadingNodes)

        // //logging name sensor point and emission values to test
        // // for (let i = 0; i < ListPilesDbIds.length; i++) {
        // // console.log('id of points', ShadingPoints[i].id)
        // // console.log('emission values for each', DataBboxespilesEmissions[i].TotalEmissions)
        // // }


        // heatmapData.initialize(this.viewer.model);


        // await this._extension.setupSurfaceShading(this.viewer.model, heatmapData);

        // this._extension.registerSurfaceShadingColors("NOx", ['#00ff00', '#ffff00', '#FF0000']);
        // this._extension.registerSurfaceShadingColors("CO2", ['#00ff00', '#ffff00', '#FF0000']); //'#ff0090', '#8c00ff', '#00fffb'

        // //for clamping values but not sure if thats necessary yet - depends on mx and min
        // const ClampedValues = []
        // DataBboxespilesEmissions.forEach(i => {
        //     const clamp = Math.min(Math.max(i.TotalEmissions / 100, 0.0), 1.0); //Math.min(Math.max(num, min), max);
        //     ClampedValues.push(clamp)
        // })

        // console.log('clamped values', ClampedValues)

        // const testValues = {};
        // for (let i = 0; i < ListPilesDbIds.length; i++) {
        //     testValues[ShadingPoints[i].id] = {
        //         currentIndex: 0,
        //         NOx: [
        //             5
        //         ],
        //         CO2: [
        //             (DataBboxespilesEmissions[i].TotalEmissions) / 100, //divides by 100 bc values need to be < 1
        //         ]
        //     }


        // }

        // console.log('here is the obj', testValues)



        // function getSensorValueFromId(shadingPointId, sensorType) {
        //     const shadingPoint = testValues[shadingPointId];
        //     const currentIndex = shadingPoint["currentIndex"];
        //     const typeValues = shadingPoint[sensorType]
        //     shadingPoint["currentIndex"] = currentIndex + 1 < typeValues.length ? currentIndex + 1 : 0;
        //     const value = typeValues[currentIndex];
        //     return value;
        // }

        // // Function that provides the value. This needs to be updated for generating automatically from list of devices, see referneces herehttps://forge.autodesk.com/en/docs/dataviz/v1/developers_guide/examples/heatmap/create_heatmap_for_rooms/
        // function getSensorValue(surfaceShadingPoint, sensorType) {
        //     console.log(surfaceShadingPoint, sensorType);
        //     const value = getSensorValueFromId(surfaceShadingPoint.id, sensorType);
        //     console.log('value', value);
        //     return value;
        // }


        // // this._extension.renderSurfaceShading(["Piles1", "Piles2", "Piles3"], "NOx", getSensorValue); //renderSurfaceShading(nodeIds, sensorType, valueCallback, options). nodeIds = One or more identifiers of nodes to render. The callback function that will be invoked when surface shading requires the sensor value to render.
        // this._extension.renderSurfaceShading(PilesNames, "CO2", getSensorValue); //renderSurfaceShading(nodeIds, sensorType, valueCallback, options). nodeIds = One or more identifiers of nodes to render. The callback function that will be invoked when surface shading requires the sensor value to render.

        // // this._extension.renderSurfaceShading("Piles2", "Temperature", getSensorValue2); 
        // // Update sensor values every 2 sec
        // setInterval(() => {
        //     this._extension.updateSurfaceShading(getSensorValue);
        //     // this._extension.updateSurfaceShading(getSensorValue2);
        // }, 5000);





        // console.log('loadheatmapextension logged');
    }


    disableHeatmap() {
        // this._extension.removeSurfaceShading(this.viewer.model);

    }


}

//Creates Data chart Panel
class SiteSensorData extends Autodesk.Viewing.UI.DockingPanel {
    constructor(extension, id, title, options) {
        super(extension.viewer.container, id, title, options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 500) + 'px';
        this.container.style.height = (options.height || 400) + 'px';
        this.container.style.resize = 'none';
        this.chartType = options.chartType || 'bar'; // See https://www.chartjs.org/docs/latest for all the supported types of charts
        this.chart = this.createChart();
        // this.newchart = this.updateChart();
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.closer = this.createCloseButton();
        this.initializeMoveHandlers(this.title);
        this.initializeCloseHandler(this.closer);
        this.container.appendChild(this.title);
        this.container.appendChild(this.closer);
        this.content = document.createElement('div');
        this.content.style.height = '350px';
        this.content.style.backgroundColor = 'white';
        this.content.innerHTML = `
        <div class="props-container" style="position: relative; height: 25px; padding: 0.5em;">
        <select class="props">
            <option value="CO2">CO2</option>
            <option value="NOx">NOx</option>
            <option value="PM">PM</option>
        </select>
        </div>
        <div class="chart-container" style="position: relative; height: 325px; padding: 0.5em;">
        <canvas class="chart"></canvas>
        </div>
        `;

        //moved this to the top sot hat could update
        // const selectElement = this.content.querySelector('select.props');
        // selectElement.onchange = this.updateChart;
        // this.select = selectElement;


        this.canvas = this.content.querySelector('canvas.chart');
        this.container.appendChild(this.content);
    }

    // updateChart(event) {
    //     const value = event.target.value;

    //     switch (value) {
    //         case 'CO2':
    //             console.log('co2 maaand');
    //             break;
    //         case 'NOx':
    //             this.chart.data.datasets[0].data = [50,30,60,20,40,30]; //CO2
    //             this.chart.data.datasets[0].label = 'NOx' 
    //             this.chart.update();
    //             console.log('NOx maaand');
    //             break;
    //         case 'PM':
    //             console.log('PM maaand');
    //             break;
    //         default:
    //             break;
    //     }
    // }

    createChart() {
        return new Chart(this.canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['06/10/22 14:50', '06/10/22 14:51', '06/10/22 14:52', '06/10/22 14:53', '06/10/22 14:54', '06/10/22 14:55'], //get time stamps
                datasets: [{
                    data: [30, 50, 60, 20, 70, 80],
                    label: "CO2 ",
                    borderColor: "#3e95cd",
                    backgroundColor: "#3e95cd",
                    fill: false
                },
                    // {
                    //     data: [50,30,60,20,40,30],
                    //     label: "PM",
                    //     borderColor: "#8e5ea2",
                    //     backgroundColor: "#8e5ea2",
                    //     fill: false
                    // }, {
                    //     data: [450,40,30,70,60,20],
                    //     label: "NO2",
                    //     borderColor: "#FFA500",
                    //     backgroundColor: "#FFA500",
                    //     fill: false
                    // }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Data Piledriver'
                }
            }
        });

    }
}


//Creates list of piles panel
// class SensorListPanel extends Autodesk.Viewing.UI.PropertyPanel {
//     constructor(viewer, container, id, title, options) {
//         super(container, id, title, options);
//         this.viewer = viewer;
//         this.container.style.height = "500px";
//         this.container.style.width = "300px";
//         //  this.scrollContainer.style.width = "auto";
//         // this.scrollContainer.style.height = "auto";
//         // this.scrollContainer.style.resize = "auto";


//         this.content = document.createElement('div');

//         const h1 = document.createElement('h1');
//         h1.innerText = 'Click on piles on the list or in the model to see its charts'
//         h1.style.fontSize = '15px'
//         const h2 = document.createElement('h1');
//         h2.innerText = 'Execution Times and CO2 Emissions above average appear in red color'
//         h2.style.fontSize = '15px'
//         this.content.appendChild(h1)
//         this.content.appendChild(h2)

//         const table = document.createElement('table');
//         table.style.border = '2px solid black'
//         table.style.borderCollapse = 'collapse'
//         table.style.width = '100%'


//         const firstRow = document.createElement('tr');
//         table.appendChild(firstRow)

//         for (let index = 1; index < 9; index++) {
//             const RowTitles = document.createElement('td');
//             firstRow.appendChild(RowTitles)
//             RowTitles.id = 'Title' + [index]
//             RowTitles.style.border = '2px solid black'
//         }

//         firstRow.querySelector('#Title1').innerText = 'Pile'
//         firstRow.querySelector('#Title2').innerText = 'Top Level'
//         firstRow.querySelector('#Title3').innerText = 'Depth'
//         firstRow.querySelector('#Title4').innerText = 'D(mm)'
//         firstRow.querySelector('#Title5').innerText = 'Execution Started'
//         firstRow.querySelector('#Title6').innerText = 'Execution Time'
//         firstRow.querySelector('#Title7').innerText = 'Embedded CO2 (kg?)'
//         firstRow.querySelector('#Title8').innerText = 'Machine CO2 (kg?)'

//         //add a button for marking pile as completed, then on appear objects show only completed, on progress change color,
//         //or completed show as green



//         for (let index = 0; index < 150; index++) {
//             const allRows = document.createElement('tr');
//             table.appendChild(allRows)
//             const pileName = document.createElement('th');
//             pileName.innerText = 'D1180-' + (index + 1);
//             // th.id = [index]
//             allRows.appendChild(pileName)
//             const topLevel = document.createElement('td');
//             topLevel.innerText = '+2.0';
//             const Depth = document.createElement('td');
//             Depth.innerText = '16m';
//             const Dmm = document.createElement('td');
//             Dmm.innerText = '118';
//             const execStatus = document.createElement('td');
//             function execStarted() { //to return yes or no for execution started
//                 if (WorkingTime[index] === 0) {
//                     return 'no'
//                 }
//                 else { return 'yes' }
//             }
//             execStatus.innerText = execStarted()

//             const execTime = document.createElement('td');
//             execTime.innerText = `${WorkingTime[index]}`  //make it so that if this is bigger than a value color in red
//             if (WorkingTime[index] > 50) {
//                 execTime.style.color = 'red'
//             }
//             const embCO2 = document.createElement('td');
//             embCO2.innerText = 'TBD'
//             const machCO2 = document.createElement('td');
//             machCO2.innerText = `${Emissiondata[index]}`
//             if (Emissiondata[index] > 50) {  //make it so that if this is bigger than a value color in red
//                 machCO2.style.color = 'red'
//             }
//             allRows.appendChild(topLevel)
//             allRows.appendChild(Depth)
//             allRows.appendChild(Dmm)
//             allRows.appendChild(execStatus)
//             allRows.appendChild(execTime)
//             allRows.appendChild(embCO2)
//             allRows.appendChild(machCO2)
//             allRows.style.textAlign = 'center'
//             pileName.addEventListener('click', () => {
//                 this.viewer.select(ListPilesDbIds[index], Autodesk.Viewing.SelectionMode.REGULAR)

//             })

//             // th.style.pointerEvents = 'fill'
//         }

//         this.content.appendChild(table)

//         this.scrollContainer.appendChild(this.content); //content needs to go inside scroll container

//     }
// }

class SiteHeatmapSwitchPanel extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        this.viewer = viewer;
        this.container.style.height = "100px";
        this.container.style.width = "100px";
        //  this.scrollContainer.style.width = "auto";
        // this.scrollContainer.style.height = "auto";
        // this.scrollContainer.style.resize = "auto";


        this.content = document.createElement('div');
        const placeholder = document.createElement('h1');
        placeholder.innerText = 'Heatmap options will go here'
        placeholder.style.fontSize = '15px'

        this.content.appendChild(placeholder)

        this.scrollContainer.appendChild(this.content); //content needs to go inside scroll container

    }
}
//Activity overview panel 
class SensorListPanel extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        this.viewer = viewer;
        this.container.style.height = "500px";
        this.container.style.width = "400px";
        //  this.scrollContainer.style.width = "auto";
        // this.scrollContainer.style.height = "auto";
        // this.scrollContainer.style.resize = "auto";


        this.content = document.createElement('div');


        const sensorList = document.createElement('table');
        sensorList.style.borderCollapse = 'collapse'
        sensorList.style.width = '100%'
        sensorList.style.maxWidth = '450px'
        sensorList.style.fontSize = '0.9em'
        sensorList.style.margin = '10px 10px'
        sensorList.style.fontFamily = 'sans-serif'
        sensorList.style.boxShadow = '2px 2px 20px #888888'

        this.content.appendChild(sensorList)

        const firstRowSensorList = document.createElement('tr');
        sensorList.appendChild(firstRowSensorList)

        for (let index = 1; index < 8; index++) {
            const RowTitleSensorList = document.createElement('td');
            firstRowSensorList.appendChild(RowTitleSensorList)
            RowTitleSensorList.id = 'Title' + [index]
            RowTitleSensorList.style.backgroundColor = '#ffc20a' //	
            RowTitleSensorList.style.color = '#000000' //	
            RowTitleSensorList.style.textAlign = 'center' //	
            RowTitleSensorList.style.fontWeight = 'bold' //	
            
        }

        firstRowSensorList.querySelector('#Title1').innerText = 'Device'
        firstRowSensorList.querySelector('#Title2').innerText = 'Level'
        firstRowSensorList.querySelector('#Title3').innerText = 'Type'
        firstRowSensorList.querySelector('#Title4').innerText = 'latest CO2'
        firstRowSensorList.querySelector('#Title5').innerText = 'latest PM'
        firstRowSensorList.querySelector('#Title6').innerText = 'latest NOx'
        firstRowSensorList.querySelector('#Title7').innerText = 'Status'



        for (let index = 0; index < 5; index++) {
            const allRowsSensorList = document.createElement('tr');
            allRowsSensorList.style.borderBottom = '2px solid #dddddd'
            allRowsSensorList.style.padding = '5px 5px'
            allRowsSensorList.style.textAlign = 'center'
            sensorList.appendChild(allRowsSensorList)
            const deviceName = document.createElement('th');
            deviceName.innerText = 'Device' + (index + 1); //use array with device names
            // th.id = [index]
            allRowsSensorList.appendChild(deviceName)
            const Level = document.createElement('td');
            Level.innerText = '0.0';

            const Type = document.createElement('td');
            Type.innerText = 'CO2/PM/NOx';
            const CO2 = document.createElement('td');
            CO2.innerText = 'TBD' //get latest value here
            const PM = document.createElement('td');
            PM.innerText = 'TBD' //make it so that if its toxic turns red
            const NOx = document.createElement('td');
            NOx.innerText = 'TBD'
            const Status = document.createElement('td');
            Status.innerText = 'OK' //make it so that if this is bigger than a value color in red
            // if ('TBD' > 50) { //replace 'TBD with the element that goes inside machCO2 inner text
            //   machCO2.style.color = 'red'
            // }
            allRowsSensorList.appendChild(Level)
            allRowsSensorList.appendChild(Type)
            allRowsSensorList.appendChild(CO2)
            allRowsSensorList.appendChild(PM)
            allRowsSensorList.appendChild(NOx)
            allRowsSensorList.appendChild(Status)
            deviceName.addEventListener('click', () => {
                //needs to highlight sprite 
                // this.viewer.select(ListPilesDbIds[index], Autodesk.Viewing.SelectionMode.REGULAR)
                console.log('device' + [index] + 'was clicked')
            })

            // th.style.pointerEvents = 'fill'
        }

        const AirSensorList = document.createElement('table');
        AirSensorList.style.borderCollapse = 'collapse'
        AirSensorList.style.width = '100%'
        AirSensorList.style.maxWidth = '450px'
        AirSensorList.style.fontSize = '0.9em'
        AirSensorList.style.margin = '10px 10px'
        AirSensorList.style.fontFamily = 'sans-serif'
        AirSensorList.style.boxShadow = '2px 2px 20px #888888'

        this.content.appendChild(AirSensorList)

        const firstRowAirSensorList = document.createElement('tr');
        AirSensorList.appendChild(firstRowAirSensorList)

        for (let index = 1; index < 8; index++) {
            const RowTitleAirSensors = document.createElement('td');
            firstRowAirSensorList.appendChild(RowTitleAirSensors)
            RowTitleAirSensors.id = 'Title' + [index]
            RowTitleAirSensors.style.backgroundColor = '#ffc20a' //	
            RowTitleAirSensors.style.color = '#000000' //	
            RowTitleAirSensors.style.textAlign = 'center' //	
            RowTitleAirSensors.style.fontWeight = 'bold' //	
        }

        firstRowAirSensorList.querySelector('#Title1').innerText = 'Device'
        firstRowAirSensorList.querySelector('#Title2').innerText = 'Level'
        firstRowAirSensorList.querySelector('#Title3').innerText = 'Type'
        firstRowAirSensorList.querySelector('#Title4').innerText = 'latest Wind Speed'
        firstRowAirSensorList.querySelector('#Title5').innerText = 'latest Noise level'
        firstRowAirSensorList.querySelector('#Title6').innerText = 'latest TBD'
        firstRowAirSensorList.querySelector('#Title7').innerText = 'Status'



        for (let index = 0; index < 2; index++) {
            const allRowsAirSensor = document.createElement('tr');
            allRowsAirSensor.style.borderBottom = '2px solid #dddddd'
            allRowsAirSensor.style.padding = '5px 5px'
            allRowsAirSensor.style.textAlign = 'center'
            AirSensorList.appendChild(allRowsAirSensor)
            const deviceName = document.createElement('th');
            deviceName.innerText = 'Device' + (index + 1); //use array with device names
            // th.id = [index]
            allRowsAirSensor.appendChild(deviceName)
            const Level = document.createElement('td');
            Level.innerText = '0.0';

            const Type = document.createElement('td');
            Type.innerText = 'Wind/Noise'; //or wind/noise - get from array
            const Wind = document.createElement('td');
            Wind.innerText = 'TBD' //get latest value here
            const Noise = document.createElement('td');
            Noise.innerText = 'TBD' //make it so that if its toxic turns red
            const TBD = document.createElement('td');
            TBD.innerText = 'TBD'
            const Status = document.createElement('td');
            Status.innerText = 'OK' //make it so that if this is bigger than a value color in red
            // if ('TBD' > 50) { //replace 'TBD with the element that goes inside machCO2 inner text
            //   machCO2.style.color = 'red'
            // }
            allRowsAirSensor.appendChild(Level)

            allRowsAirSensor.appendChild(Type)
            allRowsAirSensor.appendChild(Wind)
            allRowsAirSensor.appendChild(Noise)
            allRowsAirSensor.appendChild(TBD)
            allRowsAirSensor.appendChild(Status)

            deviceName.addEventListener('click', () => {
                //needs to highlight sprite 
                // this.viewer.select(ListPilesDbIds[index], Autodesk.Viewing.SelectionMode.REGULAR)
                console.log('device' + [index] + 'was clicked')
            })

            // th.style.pointerEvents = 'fill'
        }



        const tablebuttons = document.createElement('table');
        tablebuttons.style.padding = '5px 5px'
        const buttonRows = document.createElement('tr');
        tablebuttons.appendChild(buttonRows)
        const cell1 = document.createElement('td')
        const cell2 = document.createElement('td')
        const cell3 = document.createElement('td')
        // const cell4 = document.createElement('td')
        buttonRows.appendChild(cell1)
        buttonRows.appendChild(cell2)
        buttonRows.appendChild(cell3)
        // buttonRows.appendChild(cell4)
        const button1 = document.createElement('button')
        const button3 = document.createElement('button')
        const button2 = document.createElement('button')
        // const button4 = document.createElement('button')
        cell1.appendChild(button1)
        cell2.appendChild(button2)
        cell3.appendChild(button3)
        // cell4.appendChild(button4)
        button1.innerHTML = '<a href="mailto:goes.lylian@gmail.com" style="text-decoration:none; color:black">Send report</a>'
        button1.style.borderRadius = '4px'
        button1.style.cursor = 'pointer'
        button1.style.height = '15px'

        button2.textContent = 'Charts'
        button2.id = 'ChartsButton'
        button2.style.borderRadius = '4px'
        button2.style.cursor = 'pointer'
        button2.style.height = '15px'
        button3.textContent = 'Heatmap'
        button3.id = 'HeatmapButton'
        button3.style.borderRadius = '4px'
        button3.style.cursor = 'pointer'
        button3.style.height = '15px'


        this.content.appendChild(tablebuttons)



        this.scrollContainer.appendChild(this.content); //content needs to go inside scroll container

    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('SiteSensorsList', SiteSensorsList);

