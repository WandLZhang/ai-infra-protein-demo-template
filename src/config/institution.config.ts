export const config = {
  institution: {
    shortName: 'Stanford',
    fullName: 'Stanford University',
    pageTitle: 'Stanford HPC with Google',
    menuSubtitle: 'Stanford Research Computing · TPU vs GPU',
  },
  home: {
    buildingName: 'SLAC NATIONAL ACCELERATOR LABORATORY',
    markerLatLng: { lat: 37.4179, lng: -122.2050 },
    cameraLatLng: { lat: 37.3780, lng: -122.1150 },
    loginNode: 'sh-login',
    markerSubtitle: 'sh-login · Sherlock',
    controllerConsoleHref: 'https://console.cloud.google.com/compute/instancesDetail/zones/us-east5-a/instances/biowulf-controller?project=wz-nih-demo-controller',
    displayBucket: 'gs://stanford-research',
  },
  deploy: {
    firebaseSite: 'hpc-protein-summit-demo',
  },
}
