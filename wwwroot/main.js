import { initViewer, loadModel } from './viewer.js';
import { getAirIntelLatestMeasurements, getKeys, getAirIntelMeasurement, AGGREGATION_FUNCTIONS  } from './fetch.js';


initViewer(document.getElementById('preview')).then(viewer => {
    const urn = window.location.hash?.substring(1);
    setupModelSelection(viewer, urn);
    setupModelUpload(viewer);
});

async function setupModelSelection(viewer, selectedUrn) {
    const dropdown = document.getElementById('models');
    dropdown.innerHTML = '';
    try {
        const resp = await fetch('/api/models');
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
        const models = await resp.json();
        dropdown.innerHTML = models.map(model => `<option value=${model.urn} ${model.urn === selectedUrn ? 'selected' : ''}>${model.name}</option>`).join('\n');
        dropdown.onchange = () => onModelSelected(viewer, dropdown.value);
        if (dropdown.value) {
            onModelSelected(viewer, dropdown.value);
        }
    } catch (err) {
        alert('Could not list models. See the console for more details.');
        console.error(err);
    }
}

async function setupModelUpload(viewer) {
    const upload = document.getElementById('upload');
    const input = document.getElementById('input');
    const models = document.getElementById('models');
    upload.onclick = () => input.click();
    input.onchange = async () => {
        const file = input.files[0];
        let data = new FormData();
        data.append('model-file', file);
        if (file.name.endsWith('.zip')) { // When uploading a zip file, ask for the main design file in the archive
            const entrypoint = window.prompt('Please enter the filename of the main design inside the archive.');
            data.append('model-zip-entrypoint', entrypoint);
        }
        upload.setAttribute('disabled', 'true');
        models.setAttribute('disabled', 'true');
        showNotification(`Uploading model <em>${file.name}</em>. Do not reload the page.`);
        try {
            const resp = await fetch('/api/models', { method: 'POST', body: data });
            if (!resp.ok) {
                throw new Error(await resp.text());
            }
            const model = await resp.json();
            setupModelSelection(viewer, model.urn);
        } catch (err) {
            alert(`Could not upload model ${file.name}. See the console for more details.`);
            console.error(err);
        } finally {
            clearNotification();
            upload.removeAttribute('disabled');
            models.removeAttribute('disabled');
            input.value = '';
        }
    };
}

async function onModelSelected(viewer, urn) {
    if (window.onModelSelectedTimeout) {
        clearTimeout(window.onModelSelectedTimeout);
        delete window.onModelSelectedTimeout;
    }
    window.location.hash = urn;
    try {
        const resp = await fetch(`/api/models/${urn}/status`);
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
        const status = await resp.json();
        switch (status.status) {
            case 'n/a':
                showNotification(`Model has not been translated.`);
                break;
            case 'inprogress':
                showNotification(`Model is being translated (${status.progress})...`);
                window.onModelSelectedTimeout = setTimeout(onModelSelected, 5000, viewer, urn);
                break;
            case 'failed':
                showNotification(`Translation failed. <ul>${status.messages.map(msg => `<li>${JSON.stringify(msg)}</li>`).join('')}</ul>`);
                break;
            default:
                clearNotification();
                loadModel(viewer, urn);
                break; 
        }
    } catch (err) {
        alert('Could not load model. See the console for more details.');
        console.error(err);
    }
}

function showNotification(message) {
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = `<div class="notification">${message}</div>`;
    overlay.style.display = 'flex';
}

function clearNotification() {
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = '';
    overlay.style.display = 'none';
}




// function below to log in the console
// async function getStuff() {
// //     const measurements = await getAirIntelLatestMeasurements('88069cc0-0b1b-11ec-a709-299dc78f8a52', ['NO2', 'PM2.5'])
   
// //     measurements.NO2.forEach(i => {
// //         // if (typeof i.value === 'string') {
// //             i.ts = new Date(i.ts);
// //         }
// //     );
// //     console.log('Measurements', measurements);
       

//     const startDate = new Date('09/05/2022'); // this means Sep 05 2022 00:00:00 GMT+0200 (Central European Summer Time)
//     // if its like this (YYYY-MM-DDTHH:mm:ss.sssZ). E.g. ('2022-10-06T17:00:00.000Z') returns Thu Oct 06 2022 19:00:00 GMT+0200 (Central European Summer Time)
//     const endDate = new Date('10/05/2022'); //this means Wed Oct 05 2022 00:00:00 GMT+0200 (Central European Summer Time)

//     const device1 = await getAirIntelMeasurement(
//         '88069cc0-0b1b-11ec-a709-299dc78f8a52',
//         ['NO2', 'PM2.5'],
//         startDate.getTime(),
//         endDate.getTime(),
//         0,
//         100,
//         AGGREGATION_FUNCTIONS.NONE
//     );
//     const device2 = await getAirIntelMeasurement(
//         'a48290a0-0b1d-11ec-a709-299dc78f8a52',
//         ['NO2', 'PM2.5'],
//         startDate.getTime(),
//         endDate.getTime(),
//         0,
//         100,
//         AGGREGATION_FUNCTIONS.NONE
//     );

//     const measurementotal = {device, device2} //if wants to join 2 arrays
// //     //for converting only one value into string
// //     // let value = measurement.NO2[0].value;
// //     // if (typeof measurement.NO2[0].value === 'string') {
// //     //     value = parseFloat(value);
// //     // }
// //     // console.log(value);
// //     // console.log('measurement', new Date(measurement.NO2[0].ts), measurement.NO2[0].value);
    
// //     measurement.NO2.forEach(i => {
// //         if (typeof i.value === 'string') {
// //             i.value = parseFloat(i.value);
// //         }
// //     });
       
//     console.log('measurement', measurementotal);

// }
// getStuff();


        // FUNCTION TO SEPARATE DATA ONLY WITHIN BBOX
        // var bBox1_max = new THREE.Vector3 (-11.123215675354004,25.055110931396484, 24.442256927490234)
        // var bBox1_min = new THREE.Vector3 (-45.638675689697266, -9.460350036621094, 8.038057327270508)
        // var bBox_1 = new THREE.Box3 (bBox1_min, bBox1_max);

        // var bBox2_max = new THREE.Vector3 (-46.123215675354004,25.055110931396484, 24.442256927490234)
        // var bBox2_min = new THREE.Vector3 (-49.638675689697266, -9.460350036621094, 8.038057327270508)
        // var bBox_2 = new THREE.Box3 (bBox2_min, bBox2_max);

        

        // let data = [
        //         {
        //           "timestamp": 0.1,
        //           "vector": new THREE.Vector3 (-48.890937647957045, 5.370324843967358, 22.442256927490234)
        //         },
        //         {
        //             "timestamp": 0.2,
        //             "vector": new THREE.Vector3 (-24.890937647957045, 5.370324843967358, 22.442256927490234)
        //         },
        //         {
        //             "timestamp": 0.3,
        //             "vector": new THREE.Vector3 (-34.890937647957045, 5.370324843967358, 22.442256927490234)
        //         }
        //       ];


        // let databBox1 = [];
        // let databBox2 = [];

        // data.forEach(i => {
        //     if (bBox_1.containsPoint(i.vector)=== true) {
        //         databBox1.push(i);
        //     } else if (bBox_2.containsPoint(i.vector)=== true) {
        //         databBox2.push(i);
        //     }
        // })

        // console.log(databBox1);
        // console.log(databBox2);





                    