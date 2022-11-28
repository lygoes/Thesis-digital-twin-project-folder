import { BaseExtension } from './BaseExtension.js';
import { getDataforPiles } from './data.js';


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

console.log(PilesNames)

const SensorPointsNames = []
for (let i = 1; i < ListPilesDbIds.length + 1; i++) {
    const PointNames = 'Pile-sensor-' + i
    SensorPointsNames.push(PointNames)
}

//necessary for the charts and maybe heatmap. Stores all values so that it can find by index when selcetion changes
const dataForallPiles = [];
const Emissiondata = []; //this is CO2
const WorkingTime = [];
const AvgPowers = [];
const AvgSpeeds = [];

let newChartLabel = [];
let newchartCO2Data = [];
let newchartNO2Data = [];
let newchartPMData = [];
let newchartPowerData = [];
let newChartDrillingTime = [];
let newChartDrillingSpeed = [];

// const PilesNames = ['Pile 1', 'Pile 2', 'Pile 3', 'Pile 4'] //for piles charts - will use the above

//also for the charts but it can probably use for heatmaps too
setTimeout(() => {
    const data = getDataforPiles();
    dataForallPiles.push(data);
    dataForallPiles[0].forEach(i => {
        // Emissiondata.push(i.TotalEmissions) //replace with i.SumCO2
        Emissiondata.push(i.SumCO2 / 1000) //for now divides by 1000 because is in grams to kgs
        WorkingTime.push(i.WorkingTime)
        AvgPowers.push(i.AvgPower)
        AvgSpeeds.push(i.AvgSpeed)

    })
    // console.log('here is the data', dataForallPiles);
    console.log(Emissiondata)
    // console.log('emission data 0 for test', Emissiondata[0])   
}, 10000) //not sure if this is needed here because there is another one down there when creating the panels

let countPilesfinished = 0

class ActivitiesOverview extends BaseExtension {
    constructor(viewer, options) {
        super(viewer, options);
        // this._barChartButton = null;
        this._barChartPanel = null;
        this._PileslistPanel = null;
        this._PilesSimulationPanel = null;
        this._ActivitiesOverviewPanel = null;
        this._extension = null; //heATMAP
        this._isHeatmapShowing = false; //heatmap



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
        this._barChartPanel = new DatachartPanel(this, 'datachart-panel-new', 'Piles Data', { x: 10, y: 10, chartType: 'bar' });
        this._barChartButton = this.createToolbarButton('activity-overview-button', 'https://img.icons8.com/ios/344/combo-chart--v1.png', 'Show Activity Overview)');
        setTimeout(() => { //needs the timeout else it creates panel as soon as creates the toolbar. Unless changes
            this._ActivitiesOverviewPanel = new ActivitiesOverviewPanel(this.viewer, this.viewer.container, 'ActivitiesOverviewPanel', 'Show Activities Overview');
            this._PileslistPanel = new PilesListPanel(this.viewer, this.viewer.container, 'listPilesPanel', 'Piles list');
            this._PilesSimulationPanel = new PilesSimulationPanel(this.viewer, this.viewer.container, 'PilesSimulationPanel', 'Piles simulation');
            this._HeatmapSwitchPanel = new HeatmapSwitchPanel(this, 'piles-heatmap-panel', 'Heatmap Piles', { x: 10, y: 10 });
        }, 10000)
        this._barChartButton.onClick = () => {

            this._ActivitiesOverviewPanel.setVisible(!this._ActivitiesOverviewPanel.isVisible());
            this._barChartButton.setState(this._ActivitiesOverviewPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            if (this._ActivitiesOverviewPanel.isVisible() && this.viewer.model) {
                // this._barChartPanel.setModel(this.viewer.model);
            }


            //Gets button to add click event to appear list of piles
            this._ActivitiesOverviewPanel.content.querySelector('#PilesDetailsButton').addEventListener('click', () => {
                this._PileslistPanel.setVisible(!this._PileslistPanel.isVisible());
                this._barChartButton.setState(this._PileslistPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);

                this._barChartPanel.setVisible(!this._barChartPanel.isVisible());
                this._barChartButton.setState(this._barChartPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
                
            })
            
            //Gets button to add click event to appear list of piles
            this._ActivitiesOverviewPanel.content.querySelector('#SimulatePiles').addEventListener('click', () => {
                this._PilesSimulationPanel.setVisible(!this._PilesSimulationPanel.isVisible());
                this._barChartButton.setState(this._PilesSimulationPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);

            })
            
            
            //Gets button to add click event to initialize piles heatmap 
            this._ActivitiesOverviewPanel.content.querySelector('#PilesHeatmapButton').addEventListener('click', () => {
                this._HeatmapSwitchPanel.setVisible(!this._HeatmapSwitchPanel.isVisible());
                this._barChartButton.setState(this._HeatmapSwitchPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);

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


        };



    }

    onModelLoaded(model) {
        super.onModelLoaded(model);
        if (this._barChartPanel && this._barChartPanel.isVisible()) {
            // this._barChartPanel.setModel(model);
        }

    }

    async onSelectionChanged(model, dbids) {
        // setTimeout(() =>  { 
        super.onSelectionChanged(model, dbids);
        for (let i = 0; i < ListPilesDbIds.length; i++) {
            if (dbids[0] === ListPilesDbIds[i]) {
                // console.log('emissiondatapile', Emissiondata[i])
                newChartLabel = PilesNames[i] //needs to get it from the list that says D1180-1
                newchartCO2Data = Emissiondata[i] //CO2 DATA
                newchartNO2Data = Emissiondata[i] //CO2 DATA
                newchartPMData = Emissiondata[i] //CO2 DATA
                // newchartPowerData = AvgPowers[i] //CO2 DATA
                newchartPowerData = 0 //CO2 DATA
                newChartDrillingTime = WorkingTime[i] //neds to be drilling time
                // newChartDrillingSpeed = AvgSpeeds[i] //neds to be drilling time
                newChartDrillingSpeed = 0 //neds to be drilling time
                console.log('chartdata', newchartCO2Data);
                // console.log(this._barChartPanel);
                this._barChartPanel.chart.data.labels[0] = newChartLabel;
                this._barChartPanel.chart.data.datasets[0].data[0] = newchartCO2Data; //CO2
                this._barChartPanel.chart.data.datasets[1].data[0] = newchartNO2Data; //NO2
                this._barChartPanel.chart.data.datasets[2].data[0] = newchartPMData; //PM
                this._barChartPanel.chart.data.datasets[3].data[0] = newchartPowerData; //Avg. Power
                this._barChartPanel.chart.data.datasets[4].data[0] = newChartDrillingTime; //drillign time
                this._barChartPanel.chart.data.datasets[5].data[0] = newChartDrillingSpeed; //avg drillign speed
                this._barChartPanel.chart.update();
                // this._barChartPanel.setVisible(!this._barChartPanel.isVisible());
            }


        }
        // }, 12000) 
    }

    async loadHeatmap() {
        this._extension = await this.viewer.loadExtension("Autodesk.DataVisualization");

        const {
            SurfaceShadingData,
            SurfaceShadingPoint,
            SurfaceShadingNode,
        } = Autodesk.DataVisualization.Core;

        const ShadingNodes = []
        for (let i = 0; i < ListPilesDbIds.length; i++) {
            const Nodes = new SurfaceShadingNode(PilesNames[i], ListPilesDbIds[i])
            // console.log(Nodes)
            ShadingNodes.push(Nodes)
        }

        const ShadingPoints = []
        for (let i = 0; i < ListPilesDbIds.length; i++) {
            const Points = new SurfaceShadingPoint(SensorPointsNames[i], undefined, ["NOx", "CO2"])
            ShadingPoints.push(Points)
            ShadingPoints[i].positionFromDBId(this.viewer.model, ListPilesDbIds[i])

        }
        console.log('pointssss', ShadingPoints)


        const heatmapData = new SurfaceShadingData();

        for (let i = 0; i < ListPilesDbIds.length; i++) {
            ShadingNodes[i].addPoint(ShadingPoints[i])
            heatmapData.addChild(ShadingNodes[i])
        }
        // console.log('Nodesssss', ShadingNodes)

        //logging name sensor point and emission values to test
        // for (let i = 0; i < ListPilesDbIds.length; i++) {
        // console.log('id of points', ShadingPoints[i].id)
        // console.log('emission values for each', DataBboxespilesEmissions[i].TotalEmissions)
        // }


        heatmapData.initialize(this.viewer.model);


        await this._extension.setupSurfaceShading(this.viewer.model, heatmapData);

        this._extension.registerSurfaceShadingColors("NOx", ['#00ff00', '#ffff00', '#FF0000']);
        this._extension.registerSurfaceShadingColors("CO2", ['#00ff00', '#ffff00', '#FF0000']); //'#ff0090', '#8c00ff', '#00fffb'

        //for clamping values but not sure if thats necessary yet - depends on mx and min
        const ClampedValues = []
        DataBboxespilesEmissions.forEach(i => {
            const clamp = Math.min(Math.max(i.SumCO2 / 1000, 0.0), 1.0); //Math.min(Math.max(num, min), max);
            ClampedValues.push(clamp)
        })

        console.log('clamped values', ClampedValues)

        const testValues = {};
        for (let i = 0; i < ListPilesDbIds.length; i++) {
            testValues[ShadingPoints[i].id] = {
                currentIndex: 0,
                NOx: [
                    5
                ],
                CO2: [
                    (DataBboxespilesEmissions[i].SumCO2) / 1000, //divides by 100 bc values need to be < 1
                ]
            }


        }

        console.log('here is the obj', testValues)



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
            console.log('value', value);
            return value;
        }


        // this._extension.renderSurfaceShading(["Piles1", "Piles2", "Piles3"], "NOx", getSensorValue); //renderSurfaceShading(nodeIds, sensorType, valueCallback, options). nodeIds = One or more identifiers of nodes to render. The callback function that will be invoked when surface shading requires the sensor value to render.
        this._extension.renderSurfaceShading(PilesNames, "CO2", getSensorValue); //renderSurfaceShading(nodeIds, sensorType, valueCallback, options). nodeIds = One or more identifiers of nodes to render. The callback function that will be invoked when surface shading requires the sensor value to render.

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


}

//Creates Data chart Panel
class DatachartPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(extension, id, title, options) {
        super(extension.viewer.container, id, title, options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 500) + 'px';
        this.container.style.height = (options.height || 300) + 'px';
        this.container.style.resize = 'none';
        this.chartType = options.chartType || 'bar'; // See https://www.chartjs.org/docs/latest for all the supported types of charts
        this.chart = this.createChart();
        // this.newchart = this.updateChart();
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.closer = this.createCloseButton();
        // this.footer = this.createFooter(); //to resize container
        this.initializeMoveHandlers(this.title);
        this.initializeCloseHandler(this.closer);
        this.container.appendChild(this.title);
        this.container.appendChild(this.closer);
        this.content = document.createElement('div');
        this.content.style.height = '350px';
        this.content.style.backgroundColor = 'white';
        this.content.innerHTML = `
       
        <div class="chart-container" style="position: relative; height: 300px; padding: 0.5em;">
        <canvas class="chart"></canvas>
        </div>
        `;
        //old one with select props
        // this.content.innerHTML = `
        // <div class="props-container" style="position: relative; height: 25px; padding: 0.5em;">
        // <select class="props">
        //     <option value="CO2">CO2</option>
        //     <option value="Fuel">Fuel</option>
        //     <option value="NOx">NOx</option>
        //     <option value="PM">PM</option>
        // </select>
        // </div>
        // <div class="chart-container" style="position: relative; height: 325px; padding: 0.5em;">
        // <canvas class="chart"></canvas>
        // </div>
        // `;

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
    //             console.log('NOx maaand');
    //             break;
    //         case 'Fuel':
    //             console.log('Fuel maaand');
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
            type: 'bar',
            data: {
                labels: ['Pile name'], //or PilesNames[0]
                datasets: [{
                    data: [Emissiondata[0]],
                    label: 'CO2 Emissions',
                    borderColor: "#FF0000",
                    backgroundColor: ["#FF0000"],
                    fill: false
                },
                {
                    data: [WorkingTime[0]],
                    label: "NO2 Emissions",
                    borderColor: "#FFA500",
                    backgroundColor: ["#FFA500"],
                    fill: false
                },
                {
                    data: [WorkingTime[0]],
                    label: "PM Emissions",
                    borderColor: "#FFFF00",
                    backgroundColor: ["#FFFF00"],
                    fill: false
                },
                {
                    data: [WorkingTime[0]],
                    label: "Avg. Power",
                    borderColor: "##008000",
                    backgroundColor: ["#008000"],
                    fill: false
                },
                {
                    data: [WorkingTime[0]],
                    label: "Drilling time",
                    borderColor: "#8e5ea2",
                    backgroundColor: ["#3e95cd"],
                    fill: false
                },
                {
                    data: [WorkingTime[0]],
                    label: "Avg. Drilling Speed",
                    borderColor: "#800080",
                    backgroundColor: ["#800080"],
                    fill: false
                },

                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Data per piles'
                }
            }
        });
    }
}


//Creates list of piles panel
class PilesListPanel extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        this.viewer = viewer;
        this.container.style.height = "500px";
        this.container.style.width = "300px";
        //  this.scrollContainer.style.width = "auto";
        // this.scrollContainer.style.height = "auto";
        // this.scrollContainer.style.resize = "auto";


        this.content = document.createElement('div');

        const h1 = document.createElement('h1');
        h1.innerText = 'Click on piles on the list or in the model to see its charts'
        h1.style.fontSize = '15px'
        const h2 = document.createElement('h1');
        h2.innerText = 'Execution Times and CO2 Emissions above average appear in red color'
        h2.style.fontSize = '15px'
        this.content.appendChild(h1)
        this.content.appendChild(h2)

        const table = document.createElement('table');
        table.style.border = '2px solid black'
        table.style.borderCollapse = 'collapse'
        table.style.width = '100%'


        const firstRow = document.createElement('tr');
        table.appendChild(firstRow)

        for (let index = 1; index < 10; index++) {
            const RowTitles = document.createElement('td');
            firstRow.appendChild(RowTitles)
            RowTitles.id = 'Title' + [index]
            RowTitles.style.border = '2px solid black'
        }

        firstRow.querySelector('#Title1').innerText = 'Pile'
        firstRow.querySelector('#Title2').innerText = 'Top Level'
        firstRow.querySelector('#Title3').innerText = 'Depth'
        firstRow.querySelector('#Title4').innerText = 'D(mm)'
        firstRow.querySelector('#Title5').innerText = 'Execution Status' //Finished / in execution /not started
        firstRow.querySelector('#Title6').innerText = 'Avg. Execution Time' //get length of array and divide by number of piles the machine can reach
        firstRow.querySelector('#Title7').innerText = 'Embedded CO2 (kg)' //Fixed value
        firstRow.querySelector('#Title8').innerText = 'Machine CO2 (kg?)' //get CO2 sum of array and divide by number of piles the machine can reach
        firstRow.querySelector('#Title9').innerText = '' //get CO2 sum of array and divide by number of piles the machine can reach


        //add a button for marking pile as completed, then on appear objects show only completed, on progress change color,
        //or completed show as green



        for (let index = 0; index < 150; index++) {
            const allRows = document.createElement('tr');
            table.appendChild(allRows)
            const pileName = document.createElement('th');
            pileName.innerText = 'D1180-' + (index + 1);
            // th.id = [index]
            allRows.appendChild(pileName)
            const topLevel = document.createElement('td');
            topLevel.innerText = '+2.0';
            const Depth = document.createElement('td');
            Depth.innerText = '16m';
            const Dmm = document.createElement('td');
            Dmm.innerText = '118';
            const execStatus = document.createElement('td');
            function execStarted() { //to return yes or no for execution started
                if (WorkingTime[index] === 0) {
                    return 'not started'
                }
                else { return 'in execution' }
            }
            execStatus.innerText = execStarted()

            const execTime = document.createElement('td');
            execTime.innerText = `${(WorkingTime[index]).toFixed(2)}`  //make it so that if this is bigger than a value color in red
            if (WorkingTime[index] == 0) {
                execTime.innerText = '-'
            } else if (WorkingTime[index] > 50) {
                execTime.style.color = 'red'
            }
            const embCO2 = document.createElement('td');
            embCO2.innerText = 'TBD'
            const machCO2 = document.createElement('td');
            machCO2.innerText = `${(Emissiondata[index]).toFixed(2)}`
            const ButtonFinishedPile = document.createElement('button')
            ButtonFinishedPile.textContent = 'Mark as Finished'
            ButtonFinishedPile.style.borderRadius = '4px'
            ButtonFinishedPile.style.cursor = 'pointer'

            if (Emissiondata[index] > 50) {  //make it so that if this is bigger than a value color in red
                machCO2.style.color = 'red'
            }
            allRows.appendChild(topLevel)
            allRows.appendChild(Depth)
            allRows.appendChild(Dmm)
            allRows.appendChild(execStatus)
            allRows.appendChild(execTime)
            allRows.appendChild(embCO2)
            allRows.appendChild(machCO2)
            allRows.appendChild(ButtonFinishedPile)
            allRows.style.textAlign = 'center'
            pileName.addEventListener('click', () => {
                this.viewer.select(ListPilesDbIds[index], Autodesk.Viewing.SelectionMode.REGULAR)

            })
            let countPilesfinished = 0
            ButtonFinishedPile.addEventListener('click', () => {
                execStatus.innerText = 'Finished'
                ButtonFinishedPile.textContent = '-' //can change later to change text content to mark as unfinished
                ButtonFinishedPile.disabled = 'true'
                countPilesfinished = countPilesfinished + 1
                // SecondRow.querySelector('#secondData6').innerText = `${countPilesfinished}` 
                //needs to make this panel interact with other panel by putting other panel in the extension properties
            })

            // th.style.pointerEvents = 'fill'
        }

        this.content.appendChild(table)

        this.scrollContainer.appendChild(this.content); //content needs to go inside scroll container

    }
}

class PilesSimulationPanel extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        this.viewer = viewer;
        this.container.style.height = "500px";
        this.container.style.width = "300px";
        //  this.scrollContainer.style.width = "auto";
        // this.scrollContainer.style.height = "auto";
        // this.scrollContainer.style.resize = "auto";


        this.content = document.createElement('div');

        const formspace = document.createElement('div')

        formspace.innerHTML = `
<FORM onsubmit="CalculateResult()">
<label for="fname">Machine ID:</label>
<input type="text" id="fname" name="fname"><br><br>
<label for="lname">No. Operation Hours:</label>
<input type="text" id="lname" name="lname"><br><br>
<input type="submit" value="Simulate" class="submit-btn">
</FORM>
`;

// formspace.getElementsByClassName()


        function CalculateResult(event) {
            console.log('CalculateResult');
            console.log(event);
            event.preventDefault()
            var FieldValue = document.getElementById("lname").value;

            if (isNaN(FieldValue) | FieldValue == "") {
                var OutputValue = document.getElementById("OutputValue");
                while (OutputValue.firstChild) OutputValue.removeChild(OutputValue.firstChild)
                var ErrorMessage = document.createTextNode("Incorrect or no content in the input field. Note: The system uses . (dot) as decimal separator!");
                OutputValue.appendChild(ErrorMessage);
            }

            else { //WRITES another IF condition here depending on type of machine
                var OutputValue = document.getElementById("OutputValue");
                while (OutputValue.firstChild) OutputValue.removeChild(OutputValue.firstChild)
                // var Result = document.createTextNode(FieldValue*3);
                var result = FieldValue * 3
                var TextResult = `Expected CO2 Emissions for ${FieldValue} hours of operation based on current data is ${result} kgs of CO2 `
                var text = document.createTextNode(TextResult);
                // var Result = document.createTextNode(Math.pow(FieldValue,2));
                OutputValue.appendChild(text);
            }

        }

        const output = document.createElement('div')
        output.id = 'OutputValue'


        this.content.appendChild(formspace)
        this.content.appendChild(output)

        this.scrollContainer.appendChild(this.content); //content needs to go inside scroll container

    }
}

//can be deleted as property panel
// class HeatmapSwitchPanel extends Autodesk.Viewing.UI.PropertyPanel {
//     constructor(viewer, container, id, title, options) {
//         super(container, id, title, options);
//         this.viewer = viewer;
//         this.container.style.height = "100px";
//         this.container.style.width = "100px";
//         //  this.scrollContainer.style.width = "auto";
//         // this.scrollContainer.style.height = "auto";
//         // this.scrollContainer.style.resize = "auto";


//         this.content = document.createElement('div');
//         const placeholder = document.createElement('h1');
//         placeholder.innerText = 'Heatmap options will go here'
//         placeholder.style.fontSize = '15px'

//         this.content.appendChild(placeholder)

//         this.scrollContainer.appendChild(this.content); //content needs to go inside scroll container

//     }

class HeatmapSwitchPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(extension, id, title, options) {
        super(extension.viewer.container, id, title, options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 300) + 'px';
        this.container.style.height = (options.height || 200) + 'px';
        this.container.style.resize = 'none';
        // this.chartType = options.chartType || 'bar'; // See https://www.chartjs.org/docs/latest for all the supported types of charts
        // this.chart = this.createChart();
        // this.newchart = this.updateChart();
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.closer = this.createCloseButton();
        // this.footer = this.createFooter(); //to resize container
        this.initializeMoveHandlers(this.title);
        this.initializeCloseHandler(this.closer);
        this.container.appendChild(this.title);
        this.container.appendChild(this.closer);
        this.content = document.createElement('div');
        // this.content.style.height = '50px';
        this.content.style.backgroundColor = 'white';
        //delete the select props for this one 

        this.content.innerHTML = `
            <h1 style="color:red;"> Heatmap Options go here </h1>
            <div class="props-container" style="position: relative; height: 25px; padding: 0.5em;">
            <select class="props">
                <option value="CO2">CO2</option>
                <option value="Fuel">Fuel</option>
                <option value="NOx">NOx</option>
                <option value="PM">PM</option>
            </select>
            </div>
            <div class="chart-container" style="position: relative; height: 325px; padding: 0.5em;">
            <canvas class="chart"></canvas>
            </div>
            `;

        const selectElement = this.content.querySelector('select.props');
        selectElement.onchange = this.updateChart;


        this.select = selectElement;
        this.canvas = this.content.querySelector('canvas.chart');
        this.container.appendChild(this.content);
    }

    //     updateHeatmap(event) {
    //         // const value = event.target.value;

    //         // switch (value) {
    //         //     case 'CO2':
    //         //         console.log('co2 maaand');
    //         //         break;
    //         //     case 'NOx':
    //         //         console.log('NOx maaand');
    //         //         break;
    //         //     case 'Fuel':
    //         //         console.log('Fuel maaand');
    //         //         break;
    //         //     case 'PM':
    //         //         console.log('PM maaand');
    //         //         break;
    //         //     default:
    //         //         break;
    //         // }
    //     }

    //     createHeatmap() {

    // }
}
//Activity overview panel 
class ActivitiesOverviewPanel extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        this.viewer = viewer;
        this.container.style.height = "400px";
        this.container.style.width = "700px";
        // this.container.style.position = 'absolute'
        // this.container.style.left = '20px';
        // this.container.style.top = '20px';
        //  this.scrollContainer.style.width = "auto";
        // this.scrollContainer.style.height = "auto";
        // this.scrollContainer.style.resize = "auto";


        this.content = document.createElement('div');

        const h1 = document.createElement('h1');
        h1.innerText = 'Pile drilling Overview'
        h1.style.fontSize = '20px'
        this.content.appendChild(h1)

        const h2 = document.createElement('h2');
        h2.innerText = 'Description of activity, no. of piles etc'
        h2.style.fontSize = '10px'
        this.content.appendChild(h2)




        //table 1 pile drilling
        const table1Drill = document.createElement('table');
        table1Drill.style.border = '2px solid black'
        table1Drill.style.borderCollapse = 'collapse'
        table1Drill.style.maxWidth = '60%'




        const firstRow = document.createElement('tr');
        // firstRow.style.backgroundColor = 'gainsboro'
        firstRow.style.backgroundColor = 'LightGrey'
        table1Drill.appendChild(firstRow)

        for (let index = 1; index < 14; index++) {
            const RowTitles = document.createElement('td');
            firstRow.appendChild(RowTitles)
            RowTitles.style.minWidth = '20px'
            RowTitles.style.padding = '0px 5px'
            RowTitles.id = 'Title' + [index]
            RowTitles.style.border = '2px solid black'
            RowTitles.style.fontWeight = 'bold'
            RowTitles.style.textAlign = 'center'
        }


        firstRow.querySelector('#Title1').innerText = 'Start date'
        firstRow.querySelector('#Title2').innerText = 'Expected duration (days)'
        firstRow.querySelector('#Title3').innerText = 'Current duration (days)'
        firstRow.querySelector('#Title4').innerText = 'Expected cost (DKK)'
        firstRow.querySelector('#Title5').innerText = 'Current cost (DKK)' //Sums fixed + machine cost by time working on piles
        firstRow.querySelector('#Title6').innerText = 'No. piles executed' //based on marking piles as finished
        firstRow.querySelector('#Title7').innerText = 'No. piles to be exec.'
        firstRow.querySelector('#Title8').innerText = 'Total drilling time ()'
        firstRow.querySelector('#Title9').innerText = 'Avg. time per pile (h)'
        firstRow.querySelector('#Title10').innerText = 'Avg. cost per pile (DKK)'
        firstRow.querySelector('#Title11').innerText = 'Avg. CO2 emissions per pile (kg)'
        firstRow.querySelector('#Title12').innerText = 'Total CO2 emissions (kg)'
        firstRow.querySelector('#Title13').innerText = 'Status' //(ok/delayed/high emissions) //can it send automatic alert


        const SecondRow = document.createElement('tr');
        table1Drill.appendChild(SecondRow)

        for (let index = 1; index < 14; index++) {
            const secondrowtitles = document.createElement('td');
            SecondRow.appendChild(secondrowtitles)
            // secondrowtitles.style.width = '10%'
            secondrowtitles.style.minWidth = '20px'

            secondrowtitles.id = 'secondData' + [index]
            secondrowtitles.style.border = '2px solid black'
            secondrowtitles.style.textAlign = 'center'
        }


        SecondRow.querySelector('#secondData1').innerText = '01-09-22'
        SecondRow.querySelector('#secondData2').innerText = '30'
        SecondRow.querySelector('#secondData3').innerText = '5'
        SecondRow.querySelector('#secondData4').innerText = '60.000,00'
        SecondRow.querySelector('#secondData5').innerText = '6.000,00'
        SecondRow.querySelector('#secondData6').innerText = '15' //bring it from marks as executed
        SecondRow.querySelector('#secondData7').innerText = '135'
        SecondRow.querySelector('#secondData8').innerText = `${(WorkingTime.reduce((a, b) => a + b, 0)).toFixed(2)}`
        SecondRow.querySelector('#secondData9').innerText = `${(WorkingTime.reduce((a, b) => a + b, 0) / WorkingTime.length).toFixed(2)}`
        SecondRow.querySelector('#secondData10').innerText = '400,00'
        SecondRow.querySelector('#secondData11').innerText = `${(Emissiondata.reduce((a, b) => a + b, 0) / Emissiondata.length).toFixed(2)}` //maybe needs to come from the machine data as drilling
        SecondRow.querySelector('#secondData12').innerText = `${(Emissiondata.reduce((a, b) => a + b, 0)).toFixed(2)}`
        SecondRow.querySelector('#secondData13').innerText = 'Delayed' //(ok/delayed/high emissions) //can it send automatic alert
        SecondRow.querySelector('#secondData13').style.color = 'red' //(ok/delayed/high emissions) //can it send automatic alert


        const tablebuttons = document.createElement('table');
        tablebuttons.style.marginTop = '10px'
        const buttonRows = document.createElement('tr');
        tablebuttons.appendChild(buttonRows)
        const cell1 = document.createElement('td')
        const cell2 = document.createElement('td')
        const cell3 = document.createElement('td')
        const cell4 = document.createElement('td')
        buttonRows.appendChild(cell2)
        buttonRows.appendChild(cell3)
        buttonRows.appendChild(cell1)
        buttonRows.appendChild(cell4)
        const button3 = document.createElement('button')
        const button2 = document.createElement('button')
        const button1 = document.createElement('button')
        const button4 = document.createElement('button')
        cell2.appendChild(button2)
        cell3.appendChild(button3)
        cell1.appendChild(button1)
        cell4.appendChild(button4)
        button1.innerHTML = '<a href="mailto:goes.lylian@gmail.com" style="text-decoration:none; color:black">Send alert</a>'
        button1.style.borderRadius = '4px'
        button1.style.cursor = 'pointer'
        // button1.onclick()

        button2.textContent = 'Simulate activity'
        button2.id = 'SimulatePiles'
        button2.style.borderRadius = '4px'
        button2.style.cursor = 'pointer'
        button3.textContent = "Piles details"
        button3.style.borderRadius = '4px'
        button3.style.cursor = 'pointer'
        button3.id = 'PilesDetailsButton'
        button4.textContent = "Piles Heatmap"
        button4.style.borderRadius = '4px'
        button4.style.cursor = 'pointer'
        button4.id = 'PilesHeatmapButton'


        this.content.appendChild(table1Drill)
        this.content.appendChild(tablebuttons)


        //Excavation overview header
        const h3 = document.createElement('h1');
        h3.innerText = 'Excavation Overview'
        h3.style.fontSize = '20px'
        h3.style.marginTop = '20px'
        this.content.appendChild(h3)

        //excavation table
        const table1Exc = document.createElement('table');
        table1Exc.style.border = '2px solid black'
        table1Exc.style.borderCollapse = 'collapse'
        table1Exc.style.width = '60%'


        const firstRowExc = document.createElement('tr');
        firstRowExc.style.backgroundColor = 'gainsboro'
        table1Exc.appendChild(firstRowExc)

        for (let index = 1; index < 14; index++) {
            const RowTitles = document.createElement('td');
            firstRowExc.appendChild(RowTitles)
            RowTitles.style.width = '10%'
            RowTitles.id = 'Title' + [index]
            RowTitles.style.border = '2px solid black'
        }


        firstRowExc.querySelector('#Title1').innerText = 'Start date'
        firstRowExc.querySelector('#Title2').innerText = 'Expected end date'
        firstRowExc.querySelector('#Title3').innerText = 'Expected duration'
        firstRowExc.querySelector('#Title4').innerText = 'Current duration'
        firstRowExc.querySelector('#Title5').innerText = 'Expected cost'
        firstRowExc.querySelector('#Title6').innerText = 'Current cost' //Sums fixed + machine cost by time working on piles
        firstRowExc.querySelector('#Title7').innerText = 'No. piles executed/in execution' //maybe can split if I add drilling depth into the game
        firstRowExc.querySelector('#Title8').innerText = 'No. piles not started'


        const SecondRowExc = document.createElement('tr');
        table1Exc.appendChild(SecondRowExc)

        for (let index = 1; index < 14; index++) {
            const secondrowtitles = document.createElement('td');
            SecondRowExc.appendChild(secondrowtitles)
            secondrowtitles.style.width = '10%'
            secondrowtitles.id = 'secondData' + [index]
            secondrowtitles.style.border = '2px solid black'
        }


        SecondRowExc.querySelector('#secondData1').innerText = 'Start date'
        SecondRowExc.querySelector('#secondData2').innerText = 'Expected end date'
        SecondRowExc.querySelector('#secondData3').innerText = 'Expected duration'
        SecondRowExc.querySelector('#secondData4').innerText = 'Current duration'
        SecondRowExc.querySelector('#secondData5').innerText = 'Expected cost'
        SecondRowExc.querySelector('#secondData6').innerText = 'Current cost' //Sums fixed + machine cost by time working on piles
        SecondRowExc.querySelector('#secondData7').innerText = 'No. piles executed/in execution' //maybe can split if I add drilling depth into the game
        SecondRowExc.querySelector('#secondData8').innerText = 'No. piles not started'


        const table2Exc = document.createElement('table');
        table2Exc.style.border = '2px solid black'
        table2Exc.style.borderCollapse = 'collapse'
        table2Exc.style.width = '60%'
        table2Exc.style.marginTop = '5px'


        const tablebuttonsExc = document.createElement('table');
        const buttonRowsExc = document.createElement('tr');
        tablebuttonsExc.appendChild(buttonRowsExc)
        const cell1Exc = document.createElement('td')
        const cell2Exc = document.createElement('td')
        const cell3Exc = document.createElement('td')
        buttonRowsExc.appendChild(cell1Exc)
        buttonRowsExc.appendChild(cell2Exc)
        buttonRowsExc.appendChild(cell3Exc)
        const button1Exc = document.createElement('button')
        const button3Exc = document.createElement('button')
        const button2Exc = document.createElement('button')
        cell1Exc.appendChild(button1Exc)
        cell2Exc.appendChild(button2Exc)
        cell3Exc.appendChild(button3Exc)
        button1Exc.innerHTML = '<a href="mailto:goes.lylian@gmail.com" style="text-decoration:none; color:red">Send email</a>'
        button2Exc.style.color = 'red'
        button1Exc.style.borderRadius = '4px'
        button1Exc.style.cursor = 'pointer'
        // button1.onclick()

        button2Exc.textContent = 'Open simulation tab'
        button3Exc.textContent = 'See piles details'



        this.content.appendChild(table1Exc)
        this.content.appendChild(tablebuttonsExc)


        this.scrollContainer.appendChild(this.content); //content needs to go inside scroll container

    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('ActivitiesOverview', ActivitiesOverview);

