
import { BaseExtension } from './BaseExtension.js';
import myJsondata from './mypath1.json' assert {type: 'json'};

//array and function for storing data with position converted
const PositionData = [];

export function getLocationObjects() {
    return PositionData;
}

//inputs for Machine Bbox based on machine position data (Lmv)
const Incx = 16.4042; //needs to be in ft to work in the viewer - 5 meters equals 16.4 meters
const Incy = 16.4042;
const Incz = Math.hypot(Incx, Incy); //this is wrong, doesn't need hypot, fix itt


//array for storing Bbox of all piles
const Bboxespiles = [];

//array for storing data for each Pile
const numberPiles = 150;
// const nameofPiles = ['Pile 1', 'pile 2', 'pile3'] //for naming it if wanted.
let dataBboxespiles = new Array(numberPiles);
for (let i = 0; i < dataBboxespiles.length; i++) {
    dataBboxespiles[i] = []
    // dataBboxespiles[i].push(nameofPiles[i]) //for naming if wanted.
        }


//Array for storing arrays with Emission values
const DataBboxespilesEmissions = [];

export function getDataforPiles() {
    return DataBboxespilesEmissions
}

 class dataconversion extends BaseExtension {
    load() {
        super.load();
        console.log('data processing has started');
        return true;
        
    }

    unload() {
        super.unload();
        console.log('dataconversion unloaded.');
        return true;
    }

     async onModelLoaded(model) {
        super.onModelLoaded(model);

        //for getting Bbox of all piles //this takes a bit longer
        // this.viewer.search('D1180',
        //     (ids) => {
        //         const dbids = ids
        //         dbids.splice(0,6) ////removes first 6 dbids bc dont existe
        //         //originally the dbid count starts at 3628, should start at dbid 3648 after removing 6 elements
        //         //count finishes at dbid 3836
        //         console.log('list of dbids', dbids)
        //         dbids.forEach(element => {
        //             this.viewer.select(element, Autodesk.Viewing.SelectionMode.REGULAR)
        //             const box = this.viewer.utilities.getBoundingBox(false);
        //             Bboxespiles.push(box)
        //         });

        //         console.log('Bboxes piles', Bboxespiles)
        //     },
        //     () => {
        //         console.log('error')
        //     });
            
        //     console.log('dataBboxpiles', dataBboxespiles)

         //for getting Bbox of all piles
        //pile dbids are alternated. They skip one between. E.g., piles ([3699,3700,3728,3729]) are 4 piles next to each other but ids not in order.
            //may have to separate latee between first round and second round of piles
            const arr = [3648, 3688, 3689, 3690, 3691, 3692, 3693, 3694, 3695, 3696, 3697, 3698, 3699, 3700, 3701, 3702, 3703, 3704, 3705, 3706, 3707, 3708, 3709, 3710, 3711, 3712, 3713, 3714, 3715, 3716, 3717, 3718, 3719, 3720, 3721, 3722, 3723, 3724, 3725, 3726, 3727, 3728, 3729, 3730, 3731, 3732, 3733, 3734, 3735, 3736, 3737, 3738, 3739, 3740, 3741, 3742, 3743, 3744, 3745, 3746, 3747, 3748, 3749, 3750, 3751, 3752, 3753, 3754, 3755, 3756, 3757, 3758, 3759, 3760, 3761, 3762, 3763, 3764, 3765, 3766, 3767, 3768, 3769, 3770, 3771, 3772, 3773, 3774, 3775, 3776, 3777, 3778, 3779, 3780, 3781, 3782, 3783, 3784, 3785, 3786, 3787, 3788, 3789, 3790, 3791, 3792, 3793, 3794, 3795, 3796, 3797, 3798, 3799, 3800, 3801, 3802, 3803, 3804, 3805, 3806, 3807, 3808, 3809, 3810, 3811, 3812, 3813, 3814, 3815, 3816, 3817, 3818, 3819, 3820, 3821, 3822, 3823, 3824, 3825, 3826, 3827, 3828, 3829, 3830, 3831, 3832, 3833, 3834, 3835, 3836];

            arr.forEach(element => {
                this.viewer.select(element, Autodesk.Viewing.SelectionMode.REGULAR)
                const box = this.viewer.utilities.getBoundingBox(false);
                Bboxespiles.push(box)
            });
            console.log('boxes', Bboxespiles)
            console.log('dataBboxpiles', dataBboxespiles)
        
        
        this.geoTool = await this.viewer.loadExtension('Autodesk.Geolocation');
        const data = myJsondata; //if I set Interval here to read the data every 3sec it would be like real time data?
        
        const MachineBboxData = []
        data.forEach(i => {
            i.vector = new THREE.Vector3(i.y, i.x, i.z)
            i.Lmv = this.geoTool.lonLatToLmv(i.vector)
            PositionData.push(i);
            //Stores i.CO2Emissions in a CO2 emissions array where can take the total sum
            //do the same for fuel consumption if its not Level, but a value by minute
            //for distance travelled and adblue level add also to an array where I get only the latest values

            const bbox_min = new THREE.Vector3(i.Lmv.x - Incx, i.Lmv.y - Incy, i.Lmv.z - Incz)
            const bbox_max = new THREE.Vector3(i.Lmv.x + Incx, i.Lmv.y + Incy, i.Lmv.z + Incz)
            i.bbox = new THREE.Box3 (bbox_min, bbox_max);
            MachineBboxData.push(i)
        });
        console.log('Position data' ,PositionData); 
        
        
        //BELOW WAS MOVED TO THE LOOP ABOVE FOR TRYIGN TO OPTIMIZE TIME, if with a bgi array it takes too long moves back
        //creates Bbox for each position data -  
        // const MachineBboxData = PositionData;
        // MachineBboxData.forEach(i => {
        //     const bbox_min = new THREE.Vector3(i.Lmv.x - Incx, i.Lmv.y - Incy, i.Lmv.z - Incz)
        //     const bbox_max = new THREE.Vector3(i.Lmv.x + Incx, i.Lmv.y + Incy, i.Lmv.z + Incz)
        //     i.bbox = new THREE.Box3 (bbox_min, bbox_max);
        //     });
            console.log('MachineBboxData', MachineBboxData);

        //segreggates data for each pile based on machine bbox
        for (let i = 0; i < Bboxespiles.length; i++) {
            MachineBboxData.forEach(obj => { if (obj.bbox.intersectsBox(Bboxespiles[i])=== true) {
                dataBboxespiles[i].push(obj)
                }}
                )};
                console.log('dataBbox1', dataBboxespiles[0]);
                console.log('dataBbox2', dataBboxespiles[1]);
                console.log('dataBbox13', dataBboxespiles[13]);
                console.log('dataBbox4', dataBboxespiles[14]);
        // add emissions data
        dataBboxespiles.forEach(i => {
            const timeWorkingonPile = i.length 
            const KeyFactorCO2= 0.5; //second
            i.WorkingTime = timeWorkingonPile
            i.EmissionPerSecond=KeyFactorCO2
            i.TotalEmissions = timeWorkingonPile*KeyFactorCO2
            DataBboxespilesEmissions.push(i)
        });
        console.log('DataBboxespiles with Emissions', DataBboxespilesEmissions);
        console.log(DataBboxespilesEmissions[1].TotalEmissions);
    }


    
}

Autodesk.Viewing.theExtensionManager.registerExtension('dataconversion', dataconversion);


