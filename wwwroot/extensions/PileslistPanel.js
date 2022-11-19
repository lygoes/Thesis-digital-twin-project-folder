import { BaseExtension } from './BaseExtension.js';
import { getDataforPiles } from './data.js';

const ListPilesDbIds = [3648, 3688, 3689, 3690, 3691, 3692, 3693, 3694, 3695, 3696, 3697, 3698, 3699, 3700, 3701, 3702, 3703, 3704, 3705, 3706, 3707, 3708, 3709, 3710, 3711, 3712, 3713, 3714, 3715, 3716, 3717, 3718, 3719, 3720, 3721, 3722, 3723, 3724, 3725, 3726, 3727, 3728, 3729, 3730, 3731, 3732, 3733, 3734, 3735, 3736, 3737, 3738, 3739, 3740, 3741, 3742, 3743, 3744, 3745, 3746, 3747, 3748, 3749, 3750, 3751, 3752, 3753, 3754, 3755, 3756, 3757, 3758, 3759, 3760, 3761, 3762, 3763, 3764, 3765, 3766, 3767, 3768, 3769, 3770, 3771, 3772, 3773, 3774, 3775, 3776, 3777, 3778, 3779, 3780, 3781, 3782, 3783, 3784, 3785, 3786, 3787, 3788, 3789, 3790, 3791, 3792, 3793, 3794, 3795, 3796, 3797, 3798, 3799, 3800, 3801, 3802, 3803, 3804, 3805, 3806, 3807, 3808, 3809, 3810, 3811, 3812, 3813, 3814, 3815, 3816, 3817, 3818, 3819, 3820, 3821, 3822, 3823, 3824, 3825, 3826, 3827, 3828, 3829, 3830, 3831, 3832, 3833, 3834, 3835, 3836];


const dataForallPiles = [];
const Emissiondata = [];
const WorkingTime = [];



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
}, 10000)


class PilesListPanel extends BaseExtension {
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
        this._barChartButton = this.createToolbarButton('pile-list-button', 'https://img.icons8.com/external-nawicon-glyph-nawicon/512/external-excavator-construction-nawicon-glyph-nawicon.png', 'Show Pile Info)');
        setTimeout(() => { //needs the timeout else it creates panel as soon as creates the toolbar. Unless changes
            this._barChartPanel = new ModelPanel(this.viewer, this.viewer.container, 'listPilesPanel', 'Piles list');

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
            };

        }, 10000)
        // this._barChartPanel = new PileslistPanel(this, 'piles-panel', 'Piles', { x: 10, y: 10 });
        // this._barChartPanel2 = new MachineInfoPanel2(this, 'machine-info-panel2', 'Machines', { x: 500, y: 10 });




    }

    onModelLoaded(model) {
        super.onModelLoaded(model);
        if (this._barChartPanel && this._barChartPanel.isVisible()) {
            // this._barChartPanel.setModel(model);
        }

    }


}

//this panel is better
class ModelPanel extends Autodesk.Viewing.UI.PropertyPanel {
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

        for (let index = 1; index < 9; index++) {
            const RowTitles = document.createElement('td');
            firstRow.appendChild(RowTitles)
            RowTitles.id = 'Title' + [index]
            RowTitles.style.border = '2px solid black'
        }

        firstRow.querySelector('#Title1').innerText = 'Pile'
        firstRow.querySelector('#Title2').innerText = 'Top Level'
        firstRow.querySelector('#Title3').innerText = 'Depth'
        firstRow.querySelector('#Title4').innerText = 'D(mm)'
        firstRow.querySelector('#Title5').innerText = 'Execution Started'
        firstRow.querySelector('#Title6').innerText = 'Execution Time'
        firstRow.querySelector('#Title7').innerText = 'Embedded CO2 (kg?)'
        firstRow.querySelector('#Title8').innerText = 'Machine CO2 (kg?)'

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
                    return 'no'
                }
                else { return 'yes' }
            }
            execStatus.innerText = execStarted()

            const execTime = document.createElement('td');
            execTime.innerText = `${WorkingTime[index]}`  //make it so that if this is bigger than a value color in red
            if (WorkingTime[index] > 50) { 
                execTime.style.color = 'red'
            }
            const embCO2 = document.createElement('td');
            embCO2.innerText = 'TBD'
            const machCO2 = document.createElement('td');
            machCO2.innerText = `${Emissiondata[index]}` 
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
            allRows.style.textAlign = 'center'
            pileName.addEventListener('click', () => {
                this.viewer.select(ListPilesDbIds[index], Autodesk.Viewing.SelectionMode.REGULAR)

            })

            // th.style.pointerEvents = 'fill'
        }

        this.content.appendChild(table)

        this.scrollContainer.appendChild(this.content); //content needs to go inside scroll container

    }
}




Autodesk.Viewing.theExtensionManager.registerExtension('PilesListPanel', PilesListPanel);


 // const table = document.createElement('table');

    // const tr1 = document.createElement('tr');
    // table.appendChild(tr1)
    // const td1 = document.createElement('td');
    // const td2 = document.createElement('td');
    // const td3 = document.createElement('td');

    //     for (let index = 1; index < 150; index++) {
    //         const tr = document.createElement('tr');
    //         table.appendChild(tr)
    //         const th = document.createElement('th');
    //         th.innerText = 'D1180-' + [index];
    //         // th.id = [index]
    //         tr.appendChild(th)
    //         const td = document.createElement('td');
    //         td.innerText = index;
    //         tr.appendChild(td)
    //         th.addEventListener('click', () => {
    //             this.viewer.select(ListPilesDbIds[index], Autodesk.Viewing.SelectionMode.REGULAR)
    //         })
    //         // th.style.pointerEvents = 'fill'
    //     }
    // table.id = 'tabletest'

     //if want to add more stuff after
        // const table2 = document.querySelector('#tabletest');

               
        //         const titles2 = ['pile100', 'pile200', 'pile300', 'pile400', 'pile500', 'pile600','pile700', 'pile700','pile8','pile9','pile10', 'pile1', 'pile2', 'pile3', 'pile4', 'pile5', 'pile6','pile7', 'pile7','pile8','pile9','pile10']
        //          for (let index = 0; index < 20; index++) {
        //             const tr = document.createElement('tr');
        //             table2.appendChild(tr)
        //             const th = document.createElement('th');
        //             th.innerText = titles2[index];
        //             tr.appendChild(th)
        //             const td = document.createElement('td');
        //             td.innerText = index;
        //             tr.appendChild(td)
                    
        //         }


//Creates Panel
// class PileslistPanel extends Autodesk.Viewing.UI.DockingPanel {
//     constructor(extension, id, title, options) {
//         super(extension.viewer.container, id, title, options);
//         this.extension = extension;
//         this.container.style.left = (options.x || 0) + 'px';
//         this.container.style.top = (options.y || 0) + 'px';
//         this.container.style.width = (options.width || 400) + 'px';
//         this.container.style.height = (options.height || 300) + 'px';
//         this.container.style.resize = 'none';
//     }

//     initialize() {
//         this.title = this.createTitleBar(this.titleLabel || this.container.id);
//         this.initializeMoveHandlers(this.title);
//         this.container.appendChild(this.title);
//         //close button to show
//         this.closer = this.createCloseButton();
//         this.title.appendChild(this.closer);
//         this.initializeCloseHandler(this.closer);
//         // this.closer.addEventListener('click', () => {
//         //     this.container.setVisible( true );
//         //   })

//         this.content = document.createElement('div');
//         // this.content.style.overflow = 'scroll'
//         this.content.style.height = '300px';
//         this.content.style.backgroundColor = 'white'

//         const divscroll = document.createElement('div');


//         divscroll.style.overflowY = 'scroll'

//         divscroll.style.paddingBottom = '20px'
//         divscroll.style.height = '220px'
//         this.content.appendChild(divscroll)

//         const table = document.createElement('table');

//         const titles = ['pile1', 'pile2', 'pile3', 'pile4', 'pile5', 'pile6', 'pile7', 'pile7', 'pile8', 'pile9', 'pile10', 'pile1', 'pile2', 'pile3', 'pile4', 'pile5', 'pile6', 'pile7', 'pile7', 'pile8', 'pile9', 'pile10']
//         for (let index = 0; index < 20; index++) {
//             const tr = document.createElement('tr');
//             table.appendChild(tr)
//             const th = document.createElement('th');
//             th.innerText = titles[index];
//             tr.appendChild(th)
//             const td = document.createElement('td');
//             td.innerText = index;
//             tr.appendChild(td)

//         }

//         table.id = 'tabletest'
//         divscroll.appendChild(table)
//         // this.content.appendChild(table)

//         this.container.appendChild(this.content);


//     }
// }