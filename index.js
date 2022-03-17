let theModel;
const container = document.querySelector('.container');
const header =  document.querySelector('.header-left')
const width = container.offsetWidth;
const height = container.offsetHeight;
//create scene 
const scene  =new THREE.Scene();
const color = new THREE.Color(0xbbbbbb)
scene.background = color
//create camera
const camera = new THREE.PerspectiveCamera( 15, width / height, 1, 1000 );
camera.position.set( 15, 10, 15 );
scene.add( camera );

// camera.position.z = 5
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height)
container.appendChild(renderer.domElement);
const gridHelper = new THREE.GridHelper( 10, 20, 0xffffff, 0xffffff );
scene.add( gridHelper );    
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
//light
const light =new THREE.DirectionalLight(0xffffff,3);
light.position.set(7,2,-2)
const backLight =new THREE.DirectionalLight(0xffffff,3);
backLight.position.set(-7,-2,2)
scene.add(backLight)
scene.add(light)
scene.add( ambientLight );
//for pixel 
renderer.setPixelRatio( window.devicePixelRatio );
//controls 
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.screenSpacePanning = true;
controls.minDistance = 5;
controls.maxDistance = 40;
controls.target.set( 0, 2, 0 );
controls.update();
// camera.position.z = 5;
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
var loader = new THREE.GLTFLoader();
loader.load('table.glb', function (gltf) {
    theModel = gltf.scene
    scene.add(theModel);
    renderDom(theModel)

})

animate();
//handle for input file
let fileName;
const selected_file =document.querySelector('#choose-file') 
selected_file.addEventListener('click',function(e){
    document.getElementById('model').click()
})

function renderDom(obj) {
    const pickColor = document.querySelector('#pickColor')

  pickColor.addEventListener('input', function (e) {
    const mtl = new THREE.MeshPhongMaterial({ color: e.target.value, shininess: 10 });
    obj.children.forEach(el => {
      el.material = mtl
    })
  })
    obj.children.forEach(el=>{
    const checkbox = document.createElement('input')
    checkbox.setAttribute('type', 'checkbox')
    checkbox.setAttribute('id', el.name)
    checkbox.checked = el.visible
    checkbox.addEventListener('change', function () {
      el.visible = !el.visible
    })
    const label = document.createElement('label')
    label.appendChild(checkbox)
    label.append(el.name)
    label.htmlFor = el.name
    header.appendChild(label)
    })

  };
  //read file for model
  document.querySelector('#model').addEventListener('change', function (e) {
    let file = e.target.files[0];
    if(file){
      selected_file.value = file.name
      fileName = file.name;
    }
    
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = gltfText => {
      let loader = new THREE.GLTFLoader();
      loader.parse(gltfText.target.result, '', (gltfData) => {
        theModel.children.forEach(el=>{
            if(el.name.toLowerCase()==='table'){
                el.visible = !el.visible
                //if i want tocheckbox for new element
                // renderDom(gltfData.scene)
            }
        })
        gltfData.scene.position.y =1
        scene.add(gltfData.scene)
        renderer.render( scene, camera );
  
      },
        errMassage => { console.error(errMassage) })
    }
  })
  //for texture 
  document.querySelector('#texture').addEventListener('change', function (e) {
    let userImage = e.target.files[0];
    let userImageURL = URL.createObjectURL(userImage);
  
    let loader = new THREE.TextureLoader();
    loader.setCrossOrigin("");
    let texture = loader.load(userImageURL);
  
    // update texture
    // shader.uniforms.texture1.value = texture;
    theModel.children.forEach(el => {
      el.material = new THREE.MeshPhongMaterial({ map: texture });
    })
  })