 // HACK: dbIDs of all piles, get by NOP_VIEWER.search('D1180', console.log, console.error)
            // [3628, 3629, 3630, 3631, 3645, 3647, 3648, 3688, 3689, 3690, 3691, 3692, 3693, 3694, 3695, 3696, 3697, 3698, 3699, 3700, 3701, 3702, 3703, 3704, 3705, 3706, 3707, 3708, 3709, 3710, 3711, 3712, 3713, 3714, 3715, 3716, 3717, 3718, 3719, 3720, 3721, 3722, 3723, 3724, 3725, 3726, 3727, 3728, 3729, 3730, 3731, 3732, 3733, 3734, 3735, 3736, 3737, 3738, 3739, 3740, 3741, 3742, 3743, 3744, 3745, 3746, 3747, 3748, 3749, 3750, 3751, 3752, 3753, 3754, 3755, 3756, 3757, 3758, 3759, 3760, 3761, 3762, 3763, 3764, 3765, 3766, 3767, 3768, 3769, 3770, 3771, 3772, 3773, 3774, 3775, 3776, 3777, 3778, 3779, 3780]
            //then use 
            // NOP_VIEWER.select([array])

//Defining Bboxes for all the piles

// let bBox1_max = new THREE.Vector3 (99.31927490234375,-31.68408203125, -10.264021873474121)
// let bBox1_min = new THREE.Vector3 (95.44788360595703, -35.55547332763672, -69.31913757324219)
// let bBox_1 = new THREE.Box3 (bBox1_min, bBox1_max);


// let bBox2_max = new THREE.Vector3(101.0450439453125, -28.81694221496582, -10.264021873474121)
// let bBox2_min = new THREE.Vector3(97.17365264892578, -32.688331604003906, -69.31913757324219)
// let bBox_2 = new THREE.Box3(bBox2_min, bBox2_max)

// DbiDs list for test
//[3746, 3716,3745, 3715, 3744, 3714, 3743, 3713, 3742, 3712, 3741, 3711, 3740, 3710, 3739, 3709,3738, 3708, 3737, 3707, 3736, 3706, 3735, 3705, 3734, 3704, 3733, 3703, 3732, 3702] 


let bBox1_max = new THREE.Vector3 (149.36660766601562, 51.46296310424805, -10.264021873474121)
let bBox1_min = new THREE.Vector3 (145.49522399902344, 47.59157180786133, -69.31913757324219)
let bBox_1 = new THREE.Box3 (bBox1_min, bBox1_max);

let bBox2_max = new THREE.Vector3(147.64083862304688, 48.5958251953125, -10.264021873474121)
let bBox2_min = new THREE.Vector3(143.7694549560547, 44.72443389892578, -69.31913757324219)
let bBox_2 = new THREE.Box3(bBox2_min, bBox2_max);

let bBox3_max = new THREE.Vector3(145.91506958007812, 45.72868347167969, -10.264021873474121)
let bBox3_min = new THREE.Vector3(142.04368591308594, 41.85729217529297, -69.31913757324219)
let bBox_3 = new THREE.Box3(bBox3_min, bBox3_max);

let bBox4_max = new THREE.Vector3(144.18930053710938, 42.86154556274414, -10.264021873474121)
let bBox4_min = new THREE.Vector3(140.3179168701172, 38.99015426635742, -69.31913757324219)
let bBox_4 = new THREE.Box3(bBox4_min, bBox4_max);
    



const Bboxpiles = [bBox_1, bBox_2, bBox_3, bBox_4];


// Defining data arrays for all the piles

const numberPiles = 156;

let data = new Array(numberPiles)


export function createEmptyDataArrays() {
    for (let i = 0; i < data.length; i++) {
        data[i] = []
     }
    return data
    // data.forEach(i => {
    //     i = new Array();
    // })
    
}


// const databBox_1 = [];
// const databBox_2 = [];
// const databBox_3 = [];
// const databBox_4 = [];
// const dataBboxespiles = [databBox_1, databBox_2, databBox_3, databBox_4];



export function getBboxpiles() {
    return Bboxpiles;
}

export function getdataBboxpiles() {
    return dataBboxespiles;
}