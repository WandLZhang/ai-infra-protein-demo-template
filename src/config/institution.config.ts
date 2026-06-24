export const config = {
  institution: {
    shortName: 'Cornell',
    fullName: 'Cornell University',
    pageTitle: 'Cornell HPC with Google',
    menuSubtitle: 'Cornell Research Computing · TPU vs GPU',
  },
  home: {
    buildingName: 'RHODES HALL',
    markerLatLng: { lat: 42.4434, lng: -76.4817 },
    cameraLatLng: { lat: 42.4186, lng: -76.3857 },
    loginNode: 'cbsulogin',
    markerSubtitle: 'cbsulogin · BioHPC',
    controllerConsoleHref: 'https://console.cloud.google.com/compute/instancesDetail/zones/us-east5-a/instances/biowulf-controller?project=wz-nih-demo-controller',
    displayBucket: 'gs://cornell-research',
  },
  deploy: {
    firebaseSite: 'cornell-protein-demo',
  },
}
