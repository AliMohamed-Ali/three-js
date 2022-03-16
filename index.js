var theModel;
let MODEL_PATH ='table.glb'
const BACKGROUND_COLOR = 0xf1f1f1;
const header = document.querySelector('#header')
var loaded = false;
const DRAG_NOTICE = document.getElementById('js-drag-notice');
// Init the scene
const scene = new THREE.Scene();

// Set background
scene.background = new THREE.Color(BACKGROUND_COLOR );
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

const canvas = document.querySelector('#c');
// Init the renderer
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
var cameraFar = 5;
// Add a camera
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.x = 0;
// Initial material
const INITIAL_MTL = new THREE.MeshPhongMaterial( { color: 0xf1f1f1, shininess: 10 } );
const INITIAL_MAP = [
  {childID: "back", mtl: INITIAL_MTL},
  {childID: "base", mtl: INITIAL_MTL},
  {childID: "cushions", mtl: INITIAL_MTL},
  {childID: "leg", mtl: INITIAL_MTL},
  {childID: "support", mtl: INITIAL_MTL},
  {childID: "table", mtl: INITIAL_MTL},
];
// Init the object loader
var loader = new THREE.GLTFLoader();
loader.load(MODEL_PATH, function(gltf) {
  theModel = gltf.scene;
  console.log(theModel)
  theModel.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });

// Set the models initial scale   
  // theModel.scale.set(.5,.5,.5);
  theModel.scale.set(1,1,1);
  theModel.rotation.y = Math.PI;

  // Offset the y position a bit
  theModel.position.y = -1;
  // Set initial textures
  for (let object of INITIAL_MAP) {
    initColor(theModel, object.childID, object.mtl);// Set initial textures
    for (let object of INITIAL_MAP) {
      initColor(theModel, object.childID, object.mtl);
    }
  }
  renderDom(theModel)


  // Add the model to the scene
  scene.add(theModel);
  

}, undefined, function(error) {
  console.error(error)
});
// Function - Add the textures to the models
function initColor(parent, type, mtl) {
  parent.traverse((o) => {
   if (o.isMesh) {
     if (o.name.toLowerCase().includes(type)) {
          o.material = mtl;
          o.nameID = type; // Set a new property to identify this object
       }
   }
 });
}
// Add lights
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.61 );
    hemiLight.position.set( 0, 50, 0 );
// Add hemisphere light to scene   
scene.add( hemiLight );

var dirLight = new THREE.DirectionalLight( 0xffffff, 0.54 );
    dirLight.position.set( -8, 12, 8 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
// Add directional Light to scene    
    scene.add( dirLight );
// Floor
var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xeeeeee,
  shininess: 0
});

var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -1;
scene.add(floor);
// Add controls
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;
controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
controls.autoRotateSpeed = 0.2; // 30
    function animate() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
        if (theModel != null && loaded == false) {
            initialRotation();
            DRAG_NOTICE.classList.add('start');
          }
      }
  
  animate();
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvasPixelWidth = canvas.width / window.devicePixelRatio;
    var canvasPixelHeight = canvas.height / window.devicePixelRatio;
  
    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  function renderDom(obj){
    const pickColor = document.querySelector('#pickColor')

    pickColor.addEventListener('input',function(e){
        const mtl = new THREE.MeshPhongMaterial( { color: e.target.value, shininess: 10 } );
        obj.children.forEach(el=>{
            el.material = mtl
        })
    })

    obj.children.forEach(el=>{
        const label = document.createElement('label')
        label.textContent = el.name
        const checkbox = document.createElement('input')
        checkbox.setAttribute('type','checkbox')
        checkbox.checked = el.visible
        checkbox.addEventListener('change',function(){
            el.visible = !el.visible
        })
        label.appendChild(checkbox)
        header.appendChild(label)
    })
      
  }
  // Function - Opening rotate
let initRotate = 0;

function initialRotation() {
  initRotate++;
if (initRotate <= 120) {
    theModel.rotation.y += Math.PI / 60;
  } else {
    loaded = true;
  }
}