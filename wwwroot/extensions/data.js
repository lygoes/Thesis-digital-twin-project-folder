
import { BaseExtension } from './BaseExtension.js';
// import myJsondata from './mypath1.json' assert {type: 'json'};
import myJsondata from './test2-DataFiltered-Minute.json' assert {type: 'json'};


//array and function for storing data with position converted
const PositionData = [];

export function getLocationObjects() {
    return PositionData;
}

//for exporting the machineInfo object
const DataMachineInfo = []

export function getMachineInfo () {
    return DataMachineInfo[0]
}

//inputs for Machine Bbox based on machine position data (Lmv)
const Incx = 13.4042; //needs to be in ft to work in the viewer - 5 meters equals 16.4 meters
const Incy = 13.4042; //5 METERS IS 16,4 FEET
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
    
const spheresPiles = []



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
                const centerbox = box.getCenter()
                const newCenterBox = new THREE.Vector3(centerbox.x, centerbox.y, centerbox.z + 22.9647)
                const SphereBox = new THREE.Sphere(newCenterBox, 1.968)
                console.log('centerbox', centerbox)
                console.log('newcenterbox', newCenterBox)
                spheresPiles.push(SphereBox)

            });
            console.log('boxes', Bboxespiles)
            console.log('dataBboxpiles', dataBboxespiles)
            console.log(spheresPiles)
        
        this.geoTool = await this.viewer.loadExtension('Autodesk.Geolocation');
        const data = myJsondata; //if I set Interval here to read the data every 3sec it would be like real time data?
        console.log('dataaaaa', data)
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
            i.sphere = new THREE.Sphere(i.Lmv, 16.4)
            MachineBboxData.push(i)

        });
        console.log('Position data' ,PositionData); 
        
        //for creating an object with machine information 
        const MachineTotalCO2 = []
        const MachineTotalFuel = []
        const DistanceTravelled = []
        PositionData.forEach(i => {
            MachineTotalCO2.push(i.sumCO2Emission)
            MachineTotalFuel.push(i['Fuel Consumption'])
            DistanceTravelled.push(i['Distance travelled'])
        })

        const countIdling = PositionData.filter((obj) => obj.Status === 'Idling').length;
        const countDriving = PositionData.filter((obj) => obj.Status === 'Driving').length;
        const countDrilling = PositionData.filter((obj) => obj.Status === 'Working').length;

        const MachineInfo = {
            OperationTime: PositionData.length,
            IdlingTime: countIdling,
            DrillingTime: countDrilling,
            DrivingTime: countDriving,
            TotalCO2: MachineTotalCO2.reduce((a,b) => a + b, 0),
            TotalFuel: MachineTotalFuel.reduce((a,b) => a + b, 0), 
            DistanceTravelled: DistanceTravelled[PositionData.length-1] //BECAUSE LENGTH is 4 but we want the last index which is 3
        };
        DataMachineInfo.push(MachineInfo)
        console.log('machineeeeeee', MachineInfo)


        
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
            // MachineBboxData.forEach(obj => { if (obj.bbox.intersectsBox(Bboxespiles[i])=== true) {
            //     dataBboxespiles[i].push(obj)
            //     }}
            //     )
                MachineBboxData.forEach(obj => { if (obj.sphere.intersectsSphere(spheresPiles[i])=== true) {
                    dataBboxespiles[i].push(obj)
                    }}
                    )
            };
                // console.log('dataBbox1', dataBboxespiles[0]);

        // add emissions data
        dataBboxespiles.forEach(i => {
            // // const timeWorkingonPile = i.length 
            // // const KeyFactorCO2= 0.5; //second
            // // // i.WorkingTime = timeWorkingonPile
            // // i.EmissionPerSecond=KeyFactorCO2
            // // i.TotalEmissions = timeWorkingonPile*KeyFactorCO2
            i.WorkingTime = i.length / 8 //divides by no. piles it can reach //this is total minutes but if the piles get both idling and drilling, we want drilling time (filter by status)
           
            const CO2s = []
            const AllAvgPowers = []
            const AllAvgSpeeds = []
            i.forEach(obj => {
                CO2s.push(obj.sumCO2Emission)
                //needs to divide working time by no. of piles the machine can reach with if condition that if
           //machine is within any of the corners, divides by double e.g. if obj.machineBbox intersects (or contains a smaller corner Bbox) any of corners Bbox, sumCO2emission divides by 10
                AllAvgPowers.push(obj.AvgEnginePower)
                AllAvgSpeeds.push(obj.AvgDrillingSpeed)
            })
            i.SumCO2 = CO2s.reduce((a,b) => a + b, 0) /8 //this is total sum but we need to divide by no. of piles machine can reach
            i.AvgPower = AllAvgPowers.reduce((a,b) => a + b, 0) / AllAvgPowers.length 
            i.AvgSpeed = AllAvgSpeeds.reduce((a,b) => a + b, 0) / AllAvgSpeeds.length 
            DataBboxespilesEmissions.push(i)
        });
        console.log('DataBboxespiles with Emissions', DataBboxespilesEmissions);
        console.log(DataBboxespilesEmissions[1].TotalEmissions);
    }


    
}

Autodesk.Viewing.theExtensionManager.registerExtension('dataconversion', dataconversion);


