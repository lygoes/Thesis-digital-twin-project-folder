

import { BaseExtension } from './BaseExtension.js';

class MachineSelection extends BaseExtension {
    constructor(viewer, options) {
        super(viewer, options);
        // this._barChartButton = null;
        this._PileDriverChartPanel = null;
        this._ExcavatorChartPanel = null;
        
    }

    async load() {
        super.load();
        await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js', 'Chart');
        Chart.defaults.plugins.legend.display = true;
        // console.log('Machine Selection loaded.');
        
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
          return true;
        }

        unload() {
            super.unload();
            // for (const button of [this._barChartButton]) {
                //     this.removeToolbarButton(button);
                // }
                // this._barChartButton =  null;
                // for (const panel of [this._PileDriverChartPanel]) {
                    //     panel.setVisible(false);
                    //     panel.uninitialize();
                    // }
                    // this._PileDriverChartPanel = null;
                    console.log('DatachartPile unloaded.');
                    return true;
                }
                
                
                onModelLoaded(model) {
                    super.onModelLoaded(model);
                    this._PileDriverChartPanel = new PileDriverDataPanel(this, 'Piledriver-data-panel', 'Datachart Piledriver', { x: 10, y: 10, chartType: 'line' });
                    this._ExcavatorChartPanel = new ExcavatorDataPanel(this, 'Excavator-data-panel', 'Datachart Excavator', { x: 10, y: 10, chartType: 'line' });
                    if (this._PileDriverChartPanel && this._PileDriverChartPanel.isVisible()) {
                        // this._PileDriverChartPanel.setModel(model);
                    }
                    if (this._ExcavatorChartPanel && this._ExcavatorChartPanel.isVisible()) {
                        // this._PileDriverChartPanel.setModel(model);
                    }
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

Autodesk.Viewing.theExtensionManager.registerExtension('MachineSelection', MachineSelection);


// import { BaseExtension } from './BaseExtension.js';

// class MachineSelection extends BaseExtension {
//     load() {
//         super.load();
//         console.log('LoggerExtension loaded.');
//         return true;
//     }

//     unload() {
//         super.unload();
//         console.log('LoggerExtension unloaded.');
//         return true;
//     }

//     async onModelLoaded(model) {
//         super.onModelLoaded(model);
//         // const props = await this.findPropertyNames(this.viewer.model);
//         // console.log('New model has been loaded. Its objects contain the following properties:', props);
//     }

//     async onSelectionChanged(model, dbids) {
//         super.onSelectionChanged(model, dbids);
//         if (dbids[0] === 10677) {
//             console.log('Pile driver selected');
//         } 
        
//     }

//     onIsolationChanged(model, dbids) {
//         super.onIsolationChanged(model, dbids);
//         console.log('Isolation has changed', dbids);
//     }
// }

// Autodesk.Viewing.theExtensionManager.registerExtension('MachineSelection', MachineSelection)