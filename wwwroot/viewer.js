/// import * as Autodesk from "@types/forge-viewer";
import './extensions/data.js';
// import './extensions/LoggerExtension.js';
import './extensions/SummaryExtension.js';
import './extensions/SiteSensorsList.js';  //can be deleted now
import './extensions/SpritesExtension.js';
// import './extensions/PilesHeatmap.js'; //can be deleted if it works
import './extensions/DatachartPile.js';
import './extensions/GeoLocationExtension.js';
// import './extensions/TestHeatmapwithAirLab.js'; // //needs to be added to device list panel
// import './extensions/TestHeatmapForArea.js'; //can probably be deleted now
// import './extensions/TestHeatmapForEarthwork.js'; //needs to be added to piles list panel
// import './extensions/DrawLines.js'; //can be deleted now
// import './extensions/Custompropertypanel.js';
// import './extensions/MachineSelection.js'; //can be deleted now
import './extensions/AppearObjects.js';
import './extensions/MachineInfoPanel.js'; 
import './extensions/PileslistPanel.js';  //can be deleted now



var av = Autodesk.Viewing;

async function getAccessToken(callback) {
    try {
        const resp = await fetch('/api/auth/token');
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
        const { access_token, expires_in } = await resp.json();
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);
    }
}

let viewer;

export function initViewer(container) {
    return new Promise(function (resolve, reject) {
        Autodesk.Viewing.Initializer({ getAccessToken }, function () {
            const config = {
                extensions: [
                    'dataconversion',
                    'Autodesk.DocumentBrowser',
                    // 'LoggerExtension',
                    'SummaryExtension',
                    'SiteSensorsList',
                    'SpritesExtension',
                    // 'PilesHeatmap', //can be deleted if it works
                    'GisToolExtension',
                    // 'TestHeatmapwithAirLab', //needs to be added to device list panel
                    // 'TestHeatmapForArea',
                    'DatachartPilenew',
                    // 'TestHeatmapForEarthwork', //needs to be added to piles list panel
                    // 'DrawLinesExtension', //can be deleted now
                    // 'CustomPropertyPanelExtension',
                    // 'MachineSelection', //can be deleted now
                    'AppearObjects',
                    'MachineInfoPanel',
                    // 'PilesListPanel' //can be deleted now
                   
                    
                ]
            };
            const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            viewer.start();
            viewer.setTheme('light-theme');
            resolve(viewer);
        });
    });
}

export function loadModel(viewer, urn) { //alter the doc.getroot below if you want to see another view when opening the model.
    return new Promise(function (resolve, reject) {
        function onDocumentLoadSuccess(doc) {
            resolve(viewer.loadDocumentNode(doc, (doc, doc.getRoot().getDefaultGeometry()))); 
            // resolve(viewer.loadDocumentNode(doc, (doc, doc.getRoot().findByGuid("c884ae1b-61e7-4f9d-0001-719e20b22d0b-0007d852")))); //(doc, doc.getRoot().findByGuid("c884ae1b-61e7-4f9d-0001-719e20b22d0b-0007d852"))); will load the view you want as the first thing.
        }
        function onDocumentLoadFailure(code, message, errors) {
            reject({ code, message, errors });
        }
        viewer.setLightPreset(0);
        // const modelOpts = {
        //     applyScaling: 'm'
        // };
        Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
        // Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure, modelOpts);
    });
}

