

import { BaseExtension } from './BaseExtension.js';
import { getLocationObjects } from './data.js'

class MachineInfo extends BaseExtension {
    constructor(viewer, options) {
        super(viewer, options);
        // this._barChartButton = null;
        this._barChartPanel = null;
        this._barChartPanel2 = null;


    }

    async load() {
        super.load();
        await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js', 'Chart');
        Chart.defaults.plugins.legend.display = true;
        // console.log('machine info panel loaded.');
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
        console.log('machine info panel unloaded.');
        return true;
    }

    onToolbarCreated() {
        this._barChartPanel = new MachinesOverviewPanel(this.viewer, this.viewer.container, 'machine-list-panel', 'Machines Overview');
        // this._barChartPanel2 = new MachineInfoPanel2(this, 'machine-info-panel2', 'Machines', { x: 500, y: 10 });

        this._barChartButton = this.createToolbarButton('machine-info-button', 'https://img.icons8.com/external-nawicon-glyph-nawicon/512/external-excavator-construction-nawicon-glyph-nawicon.png', 'Show Machines Information');
        this._barChartButton.onClick = () => {
            this._barChartPanel.setVisible(!this._barChartPanel.isVisible());
            this._barChartButton.setState(this._barChartPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            if (this._barChartPanel.isVisible() && this.viewer.model) {
                // this._barChartPanel.setModel(this.viewer.model);
            }


            // this._barChartPanel2.setVisible(!this._barChartPanel2.isVisible());
            // this._barChartButton.setState(this._barChartPanel2.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            // if (this._barChartPanel2.isVisible() && this.viewer.model) {
            //     // this._barChartPanel.setModel(this.viewer.model);
            // }

            if (!this.viewer.isNodeVisible(10740)) {
                this.viewer.show(10740)
            } else {
                this.viewer.hide(10740)
            }

            if (!this.viewer.isNodeVisible(10677)) {
                this.viewer.show(10677)
            } else {
                this.viewer.hide(10677)
            }

        };

        this._PileDriverChartPanel = new PileDriverDataPanel(this, 'Piledriver-data-panel', 'Datachart Piledriver', { x: 10, y: 10, chartType: 'line' });
        this._ExcavatorChartPanel = new ExcavatorDataPanel(this, 'Excavator-data-panel', 'Datachart Excavator', { x: 10, y: 10, chartType: 'line' });
        if (this._PileDriverChartPanel && this._PileDriverChartPanel.isVisible()) {
            // this._PileDriverChartPanel.setModel(model);
        }
        if (this._ExcavatorChartPanel && this._ExcavatorChartPanel.isVisible()) {
            // this._PileDriverChartPanel.setModel(model);
        }

    }

    onModelLoaded(model) {
        super.onModelLoaded(model);
        this.viewer.hide([10740, 10677])
        if (this._barChartPanel && this._barChartPanel.isVisible()) {
            // this._barChartPanel.setModel(model);
        }


             //creating a bounding box around the machine
             const geometry = new THREE.BoxGeometry( 32, 32, 70 );
             const material = new THREE.MeshBasicMaterial({
                 color: new THREE.Color(0x7FFF00),
                 opacity: 0.75,
                 transparent: true,
                 side: THREE.DoubleSide,
                 wireframe: true,
                 wireframeLinewidth: 1
             });
             
             
             let cube = new THREE.Mesh( geometry, material );
             //    cube.position.set(67, -19, 20)
             cube.position.set(103,29, 20)
             //    cube.rotateZ(70)
             
             this.viewer.impl.createOverlayScene(
                 'myOverlay2', material)
                 
                 this.viewer.impl.addOverlay (
                     'myOverlay2', cube)
                
               this.viewer.impl.invalidate (true)
    }

    async onSelectionChanged(model, dbids) {
        super.onSelectionChanged(model, dbids);
        if (dbids[0] === 10677) {
            console.log('Pile driver selected');
            this._PileDriverChartPanel.setVisible(!this._PileDriverChartPanel.isVisible());
            // this._barChartButton.setState(this._PileDriverChartPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            if (this._PileDriverChartPanel.isVisible() && this.viewer.model) {
                // this._PileDriverChartPanel.setModel(this.viewer.model);
            }
        }  
        if (dbids[0] === 10740) {
            console.log('Excavator selected');
            this._ExcavatorChartPanel.setVisible(!this._ExcavatorChartPanel.isVisible());
            // this._barChartButton.setState(this._PileDriverChartPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            if (this._ExcavatorChartPanel.isVisible() && this.viewer.model) {
                // this._PileDriverChartPanel.setModel(this.viewer.model);
            }
        }  
    }


}

//Creates panel for machine overview 

class MachinesOverviewPanel extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        this.viewer = viewer;
        this.geometry = null;
        this.linesMaterial = null;
        this.lines = null;
        this._areLinesShowing = false;
        this.container.style.height = "350px";
        this.container.style.width = "900px";
        //  this.scrollContainer.style.width = "auto";
        // this.scrollContainer.style.height = "auto";
        // this.scrollContainer.style.resize = "auto";

        // this.title.style.backgroundColor = 'LightGray'
        // this.footer.style.backgroundColor = 'LightGray'
        this.content = document.createElement('div');
        // this.content.style.backgroundColor = 'LightGray'

        
        const machineList = document.createElement('table');
        machineList.style.border = '2px solid black'
        machineList.style.borderCollapse = 'collapse'
        machineList.style.width ='60%'
        machineList.style.marginTop = '15px'
        
        this.content.appendChild(machineList)
        
            
        const firstRowMachineList = document.createElement('tr');
        machineList.appendChild(firstRowMachineList)
        firstRowMachineList.style.backgroundColor = 'gainsboro' //	lightgray
        
        
                for (let index = 1; index < 16; index++) {
                  const RowTitleMachineList = document.createElement('th');
                  firstRowMachineList.appendChild(RowTitleMachineList)
                  RowTitleMachineList.id = 'Title'+ [index]
                  RowTitleMachineList.style.border = '2px solid black'
                  }
        
                  firstRowMachineList.querySelector('#Title1').innerText = 'Model name' //this could also be retrieved automatically from machine BIM model
                  firstRowMachineList.querySelector('#Title2').innerText = 'Type'
                  firstRowMachineList.querySelector('#Title3').innerText = 'Specs'
                  firstRowMachineList.querySelector('#Title4').innerText = 'Work start / end'
                  firstRowMachineList.querySelector('#Title5').innerText = 'Total working hours'
                  firstRowMachineList.querySelector('#Title6').innerText = 'Drilling hours'
                  firstRowMachineList.querySelector('#Title7').innerText = 'Idling hours'
                  firstRowMachineList.querySelector('#Title8').innerText = 'Driving hours'
                  firstRowMachineList.querySelector('#Title9').innerText = 'Distance travelled (km)'
                  firstRowMachineList.querySelector('#Title10').innerText = 'Total fuel consumed (l)' //tank capacity is 1200 L
                  firstRowMachineList.querySelector('#Title11').innerText = 'Avg fuel per hour (l)'
                  firstRowMachineList.querySelector('#Title12').innerText = 'Total fuel cost (DKK)'
                  firstRowMachineList.querySelector('#Title13').innerText = 'Total CO2 Emissions (kg)'
                  firstRowMachineList.querySelector('#Title14').innerText = 'Avg. CO2 per hour (kg)'
                  firstRowMachineList.querySelector('#Title15').innerText = 'Performance'
        
        const secondRowMachineList = document.createElement('tr');
          machineList.appendChild(secondRowMachineList)
        
          for (let index = 1; index < 16; index++) {
            const secondrowData = document.createElement('td');
            secondRowMachineList.appendChild(secondrowData)
            secondrowData.style.border = '2px solid black'
            secondrowData.style.minWidth ='50px'
            secondrowData.style.padding ='2px 5px'
            secondrowData.id = 'data'+ [index]
            }
            secondRowMachineList.querySelector('#data1').innerText = 'Bauer BG 55 V'
            secondRowMachineList.querySelector('#data2').innerText = 'Drilling rig'
            // secondRowMachineList.querySelector('#data3').innerText = 'Specs'
            secondRowMachineList.querySelector('#data3').innerHTML = '<a href="https://www.bauer.de/export/shared/documents/pdf/bma/datenblatter/BG_Rotary_Drilling_Rig/BG_55_BS_115_RotaryDrilling_Rig_EN_905_871_2.pdf";>Specs</a>'
            secondRowMachineList.querySelector('#data4').innerText = '01-09-22 / 01-12-22'
            secondRowMachineList.querySelector('#data5').innerText = '38' //Gets length of machine array and divides by 60
            secondRowMachineList.querySelector('#data6').innerText = '25' //Gets length of array with data as 'drilling' only and divides by 60
            secondRowMachineList.querySelector('#data7').innerText = '10' //Gets length of array with data as 'idling' only and divides by 60
            secondRowMachineList.querySelector('#data8').innerText = '3' //Gets length of array with data as 'driving' only and divides by 60
            secondRowMachineList.querySelector('#data9').innerText = '50' //Gets distance in last object of array
            secondRowMachineList.querySelector('#data10').innerText = '300'
            secondRowMachineList.querySelector('#data11').innerText = '7.89' //divides total fuel by total working hours
            secondRowMachineList.querySelector('#data12').innerText = '4500,00' //multiplies total fuel consumption by diesel cost per litre DKK15 today
            secondRowMachineList.querySelector('#data13').innerText = '300'
            secondRowMachineList.querySelector('#data14').innerText = '7.89'
            secondRowMachineList.querySelector('#data15').innerText = 'Excessive idling' //function that if avg hours/CO2 per hour/fuel exceeds desired amount it says high hours/CO2 emissions/high fuel consumption
            secondRowMachineList.querySelector('#data15').style.color = 'red'
        
          const thirdRowMachineList = document.createElement('tr');
          machineList.appendChild(thirdRowMachineList)
        
          for (let index = 1; index < 16; index++) {
            const thirdRowData = document.createElement('td');
            thirdRowData.style.border = '2px solid black'
            thirdRowMachineList.appendChild(thirdRowData)
            thirdRowData.id = 'data'+ [index]
            }
            thirdRowMachineList.querySelector('#data1').innerText = 'Hitachi ZX135US-6'
            thirdRowMachineList.querySelector('#data2').innerText = 'Excavator'
            thirdRowMachineList.querySelector('#data3').innerText = 'Specs'
            thirdRowMachineList.querySelector('#data3').innerHTML = '<a href="https://www.hitachicm.eu/wp-content/uploads/2018/08/KA-EN283EU.pdf";>Specs</a>'
            thirdRowMachineList.querySelector('#data4').innerText = '20-11-22 / 20-12-23'
            thirdRowMachineList.querySelector('#data5').innerText = '50' //Gets length of machine array and divides by 60
            thirdRowMachineList.querySelector('#data6').innerText = '25' //Gets length of array with data as 'drilling' only and divides by 60
            thirdRowMachineList.querySelector('#data7').innerText = '15' //Gets length of array with data as 'idling' only and divides by 60
            thirdRowMachineList.querySelector('#data8').innerText = '10' //Gets length of array with data as 'driving' only and divides by 60
            thirdRowMachineList.querySelector('#data9').innerText = '100' //Gets distance in last object of array
            thirdRowMachineList.querySelector('#data10').innerText = '500'
            thirdRowMachineList.querySelector('#data11').innerText = '10' //divides total fuel by total working hours
            thirdRowMachineList.querySelector('#data12').innerText = '7500,00' //multiplies total fuel consumption by diesel cost per litre DKK15 today
            thirdRowMachineList.querySelector('#data13').innerText = '500'
            thirdRowMachineList.querySelector('#data14').innerText = '10'
            thirdRowMachineList.querySelector('#data15').innerText = 'Excessive CO2 ' //function that if avg hours/CO2 per hour/fuel exceeds desired amount it says high hours/CO2 emissions/high fuel consumption
            //if function that depending on status color writes in red
            thirdRowMachineList.querySelector('#data15').style.color = 'red'
            
            //Text 
            const h1 = document.createElement('h1');
            h1.innerText = 'Select machine in the model to see charts'
            h1.style.fontSize = '15px'
            this.content.appendChild(h1)
        
        //buttons 
            const machineButtonstable = document.createElement('table');
            machineButtonstable.style.marginTop = '10px'
            const machineButtonRows = document.createElement('tr');
            machineButtonstable.appendChild(machineButtonRows)
            const machineButtonsCell1 = document.createElement('td')
            const machineButtonsCell2 = document.createElement('td')
            const machineButtonsCell3 = document.createElement('td')
            machineButtonRows.appendChild(machineButtonsCell1)
            machineButtonRows.appendChild(machineButtonsCell2)
            machineButtonRows.appendChild(machineButtonsCell3)
            const machineButton1 = document.createElement('button')
            const machineButton2 = document.createElement('button')
            const machineButton3 = document.createElement('button')
            machineButtonsCell1.appendChild(machineButton1)
            machineButtonsCell2.appendChild(machineButton2)
            machineButtonsCell3.appendChild(machineButton3)
            // machineButton3.innerHTML = '<a href="mailto:goes.lylian@gmail.com" style="text-decoration:none; color:red">Send alert</a>'
            machineButton3.innerHTML = '<a href="mailto:goes.lylian@gmail.com" style="text-decoration:none; color:black">Send alert</a>'
            machineButton3.style.borderRadius = '4px'
            machineButton3.style.cursor = 'pointer'
            // button1.onclick()
        

            
            
            machineButton1.textContent = 'Draw / Erase Trajectory' //make two buttons form achine 1 and two
            machineButton1.style.borderRadius = '4px'
            machineButton1.style.cursor = 'pointer'
            machineButton1.addEventListener('click', () => {
            if (this._areLinesShowing) { // Same as (this._isSpritesShowing === true)
                // If showing disable sprites.
                this.eraseLines();
                this._areLinesShowing = false;
            } else { // Same as (else if (!this._isSpritesShowing))
                // Else if not showing, enable sprites.
                this.drawLines();
                this._areLinesShowing = true;
            }
        })
        
        machineButton2.textContent = 'Simulate performance'
        machineButton2.style.borderRadius = '4px'
        machineButton2.style.cursor = 'pointer'
            this.content.appendChild(machineButtonstable)
            
            this.scrollContainer.appendChild(this.content); //content needs to go inside scroll container
            
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

    }
    



    
    Autodesk.Viewing.theExtensionManager.registerExtension('MachineInfoPanel', MachineInfo);


//Creates Panel for Drilling Machine

class PileDriverDataPanel extends Autodesk.Viewing.UI.DockingPanel {
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
    
    updateChart(event) {
        const value = event.target.value;

        switch (value) {
            case 'CO2':
                console.log('co2 maaand');
                break;
            case 'NOx':
                console.log('NOx maaand');
                break;
            case 'Fuel':
                console.log('Fuel maaand');
                break;
            case 'PM':
                console.log('PM maaand');
                break;
            default:
                break;
        }
    }
    
    async createChart() {
        return new Chart(this.canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['06/10/22 14:50','06/10/22 14:51','06/10/22 14:52','06/10/22 14:53','06/10/22 14:54','06/10/22 14:55'],
                datasets: [{ 
                    data: [0.5, 0.6, 0.3, 0.4, 0.2, 0.1],
                    label: "Total Emissions",
                    borderColor: "#3e95cd",
                    fill: false
                }, { 
                    data: [0.7, 0.9, 0.2, 0.3, 0.7, 0.8],
                    label: "Fuel Consumption",
                    borderColor: "#8e5ea2",
                    fill: false
                }
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

//Creates excavator panel
class ExcavatorDataPanel extends Autodesk.Viewing.UI.DockingPanel {
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
        // <select class="props" onchange="" onfocus="this.selectedIndex = -1;">
        this.content.innerHTML = `
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
    
    updateChart(event) {
        const value = event.target.value;

        switch (value) {
            case 'CO2':
                console.log('co2 maaand');
                break;
            case 'NOx':
                console.log('NOx maaand');
                break;
            case 'Fuel':
                console.log('Fuel maaand');
                break;
            case 'PM':
                console.log('PM maaand');
                break;
            default:
                break;
        }
    }
    

    async createChart() {
        return new Chart(this.canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', ' Week 3', 'Total'],
                datasets: [{
                    data: [50, 50, 50, 150], //'week 1, week 2, week 3, total
                    label: "Hours Working",
                    borderColor: "#3e95cd",
                    backgroundColor: ["#3e95cd"],
                },
                {
                    data: [70, 30, 40, 140],
                    label: "Distance Travelled",
                    borderColor: "#8e5ea2",
                    backgroundColor: ["#c45850"],
                },
                {
                    data: [30, 30, 120, 180],
                    label: "Fuel Consumption",
                    borderColor: "#8e5ea2",
                    backgroundColor: ["#8e5ea2"],
                }
            ],
            
            
            
        },
        options: {
            title: {
                display: true,
                text: 'Data Excavator'
            }
        }
    });
}
}

//Creates Panel
// class MachineInfoPanel extends Autodesk.Viewing.UI.DockingPanel {
//     constructor(extension, id, title, options) {
//         super(extension.viewer.container, id, title, options);
//         this.extension = extension;
//         this.container.style.left = (options.x || 0) + 'px';
//         this.container.style.top = (options.y || 0) + 'px';
//         this.container.style.width = (options.width || 400) + 'px';
//         this.container.style.height = (options.height || 300) + 'px';
//         this.container.style.resize = 'none';
// }

//     initialize() {
//         this.title = this.createTitleBar(this.titleLabel || this.container.id);
//         this.initializeMoveHandlers(this.title);
//         this.container.appendChild(this.title);
//         this.content = document.createElement('div');
//         // this.content.style.overflow = 'scroll'
//         this.content.style.height = '300px';
//         this.content.style.backgroundColor = 'white'


//         // HTML Inline css styling
//         this.content.innerHTML = `
//             <div style="overflow-y: scroll; padding-bottom: 20px; height: 220px">
//             <h1 style="font-size: 20px; ">Pile driver</h1>
          
//                 <table style="font-size: 20px; border: 1px solid black; border-collapse: collapse; width: 80%; font-family: calibri; "> 
                    

//                 <tr>
//                     <th style="text-align: center;">Name Model</th>
//                     <td style="text-align: center;"> Model </td>

//                 </tr>
//                 <tr>
//                     <th>Specs Model</th>

//                     <td style="text-align: center;"><a href="https://www.google.com/" target="_blank">Specs</a></td>
//                 </tr>
//                 <tr>
//                     <th>Total Worked hours</th>
//                     <td style="text-align: center;"23</td>

//                 </tr>

//                 <tr>
//                 <th>Drilling Hours</th>
//                 <td style="text-align: center;">10</td>

//                 </tr>

//                 <tr>
//                 <th>Idling Hours</th>
//                 <td style="text-align: center;">5</td>

//                 </tr>

//                 <tr>
//                 <th>Distance Travelled</th>
//                 <td style="text-align: center;">20km</td>

                
//                 </tr>
//                 <tr>
//                    <th>Fuel Consumption</th>
//                    <td style="text-align: center;">a</td>

//                 </tr>
//                 <tr>
//                     <th style="text-align: center;">Name Model</th>
//                     <td style="text-align: center;"> Model </td>

//                 </tr>
//                 <tr>
//                     <th>Specs Model</th>

//                     <td style="text-align: center;"><a href="https://www.google.com/" target="_blank">Specs</a></td>
//                 </tr>
//                 <tr>
//                     <th>Total Worked hours</th>
//                     <td style="text-align: center;"23</td>

//                 </tr>

//                 <tr>
//                 <th>Drilling Hours</th>
//                 <td style="text-align: center;">10</td>

//                 </tr>

//                 <tr>
//                 <th>Idling Hours</th>
//                 <td style="text-align: center;">5</td>

//                 </tr>

//                 <tr>
//                 <th>Distance Travelled</th>
//                 <td style="text-align: center;">20km</td>

                
//                 </tr>
//                 <tr>
//                    <th>Fuel Consumption</th>
//                    <td style="text-align: center;">a</td>

//                 </tr>



//             </table>
//             </div>
//         `;
//         this.container.appendChild(this.content);







//another way of doing it
        // const div = document.createElement('div');
        // div.style.marginTop = '10px'
        // div.style.backgroundColor = 'grey'
        // const table = document.createElement('table');

        // const row1 = document.createElement('tr');
        // const row2 = document.createElement('tr');

        // const header1 = document.createElement('h1');
        // header1.innerText = 'CO2'
        // header1.style.fontSize = '20px'
        // row1.appendChild(header1)

        // const header2 = document.createElement('h2');
        // header2.innerText = 'NOx'
        // row2.appendChild(header2)

        // const data1 = document.createElement('td');
        // data1.innerText = '10kg';
        // row1.appendChild(data1)

        // const data2 =  document.createElement('td');
        // data2.innerText = '20kg';
        // row2.appendChild(data2)
        
        // const data3 =  document.createElement('td');
        // const button = document.createElement('button')
        // button.innerText = 'send email'
        // button.onclick = doStuff
        // data3.appendChild(button)

        // row2.appendChild(data3)

        // function doStuff() {
        //     alert('email sent to user')
        // }
        // // for (let index = 0; index < 3; index++) {
        // //     const th = document.createElement('th');
        // //     th.innerText = index;
        // //     tr.appendChild(th)
        // // }

        // table.appendChild(row1)
        // table.appendChild(row2)
        // div.appendChild(table)
        // this.content.appendChild(div)
//     }
// }

// class MachineInfoPanel2 extends Autodesk.Viewing.UI.DockingPanel {
//     constructor(extension, id, title, options) {
//         super(extension.viewer.container, id, title, options);
//         this.extension = extension;
//         this.container.style.left = (options.x || 0) + 'px';
//         this.container.style.top = (options.y || 0) + 'px';
//         this.container.style.width = (options.width || 400) + 'px';
//         this.container.style.height = (options.height || 400) + 'px';
//         this.container.style.resize = 'none';
//     }

//     initialize() {
//         this.title = this.createTitleBar(this.titleLabel || this.container.id);
//         this.initializeMoveHandlers(this.title);
//         this.container.appendChild(this.title);
//         this.content = document.createElement('div');
//         this.content.style.height = '350px';
//         this.content.style.backgroundColor = 'white';

//         // HTML Inline css styling
//         this.content.innerHTML = `
//             <div>
//                 <h1>Machine Information</h1>
//                 <table style="background-color: grey; font-size: 40px;">
//                     <tr>
//                         <th>col1</th>
//                         <th>col2</th>
//                         <th>col3</th>
//                     </tr>
//                     <tr>
//                         <td>${a}</td>
//                         <td>${b}</td>
//                         <td>3</td>
//                     </tr>
//                     <tr>
//                         <td>1a</td>
//                         <td>2a</td>
//                         <td>3a</td>
//                     </tr>
//                 </table>
//             </div>
//         `;
//         this.container.appendChild(this.content);


//         const div = document.createElement('div');
//         div.style.marginTop = '10px'
//         div.style.backgroundColor = 'magenta'
//         const table = document.createElement('table');
//         const tr = document.createElement('tr');
//         for (let index = 0; index < 60; index++) {
//             const th = document.createElement('th');
//             th.innerText = index;
//             tr.appendChild(th)
//         }
//         table.appendChild(tr)
//         div.appendChild(table)
//         this.content.appendChild(div)
//     }
// }


