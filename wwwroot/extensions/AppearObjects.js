import { BaseExtension } from './BaseExtension.js';
import { getDataforPiles } from './DataProcessing.js'

const DataBboxespilesEmissions = getDataforPiles();

const ListPilesDbIds = [3646,3686,3687,3688,3689,3690,3691,3692,3693,3694,3695,3696,3697,3698,3699,3700,3701,3702,3703,3704,3705,3706,3707,3708,3709,3710,3711,3712,3713,3714,3715,3716,3717,3718,3719,3720,3721,3722,3723,3724,3725,3726,3727,3728,3729,3730,3731,3732,3733,3734,3735,3736,3737,3738,3739,3740,3741,3742,3743,3744,3745,3746,3747,3748,3749,3750,3751,3752,3753,3754,3755,3756,3757,3758,3759,3760,3761,3762,3763,3764,3765,3766,3767,3768,3769,3770,3771,3772,3773,3774,3775,3776,3777,3778,3779,3780,3781,3782,3783,3784,3785,3786,3787,3788,3789,3790,3791,3792,3793,3794,3795,3796,3797,3798,3799,3800,3801,3802,3803,3804,3805,3806,3807,3808,3809,3810,3811,3812,3813,3814,3815,3816,3817,3818,3819,3820,3821,3822,3823,3824,3825,3826,3827,3828,3829,3830,3831,3832,3833,3834]


class AppearObjects extends BaseExtension {
    load() {
        super.load();
        console.log('AppearObjects loaded.');
        return true;
    }
    
    unload() {
        super.unload();
        console.log('AppearObjects unloaded.');
        return true;
    }
    
    async onModelLoaded(model) {
        super.onModelLoaded(model);
        this.viewer.hide(3561) //structural beam
        this.viewer.hide(ListPilesDbIds)
        setTimeout(() => { //Set interval for updating every 5 sec
            for (let i = 0; i < ListPilesDbIds.length; i++) {
                if (DataBboxespilesEmissions[i].WorkingTime !== 0) {
                    this.viewer.show(ListPilesDbIds[i])
                }
            }
        }, 5000);
        console.log('Objects not constructed yet have disappeared');
    }
    
}

Autodesk.Viewing.theExtensionManager.registerExtension('AppearObjects', AppearObjects);

