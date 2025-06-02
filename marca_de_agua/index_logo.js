// version 1.04 template index made by heine.froholdt@gmail.com
// modificado por leon para logos sin textos

let isOn = false;
let framesMilliseconds;
let fontsLoaded = false;
let animLoaded = false;
let animElementsLength;
let markers = {}
let markersLoop = {}

//loop handling
let loopExits = false;
let loopAnimation = false;
let loopDelay = 0;
let loopExternal = false;
let loopRepeat;
let loopDuration;
let loopTiming;


//update
let   = false;
let updateDelay = 0;
let nextAnimation;
let imagesReplace = {};


let animContainer = document.getElementById('bm');
let loopContainer = document.getElementById('loop');

let logo = "logo1";


const loadAnimation = (data, container) => {
    console.log('loading ' + data)
    return lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: data
    });
}

let anim = loadAnimation(json_file, animContainer)
let externalLoop;



//checking if the animation is ready
const makeAnimPromise = () => {
    return new Promise(function (resolve, reject) {
        if (animLoaded) {
            resolve('Animation ready to play')
        } else {
            anim.addEventListener('DOMLoaded', function (e) {
                animLoaded = true;
                resolve('Animation ready to play')
            });
        }
    })
};


const isMarker = (obj, keyItem, markerName) => {
    return new Promise((resolve, reject) => {
        let markers = obj.markers
        markers.forEach((item, index) => {
            for (let key in item) {
                if (item[key][keyItem] === markerName) {
                    resolve(true)
                } else if (item.length === key) {
                    reject(false)
                }
            }
        })
    })
}

const getMarkerValue = (obj, keyItem, defaultValue) => {
    return new Promise((resolve, reject) => {
        let markers = obj.markers
        markers.forEach((item, index) => {
            for (let key in item) {
                if (item[key].hasOwnProperty(keyItem)) {
                    resolve(item[key][keyItem])
                } else if (item.length === key) {
                    reject(defaultValue)
                }
            }
        })
    })
}



//anim ready
anim.addEventListener('config_ready', function (e) {
    //setting the animation framerate
    let mainAnimation = anim.renderer.data
    framesMilliseconds = 1000 / mainAnimation.fr

    if (anim.hasOwnProperty('markers')) {
        anim.markers.forEach((item, index) => {
            markers[item.payload.name] = item;

        })
    }
    

    //checking for a update animation in the animation 
    isMarker(anim, 'name', 'update').then((res) => {
        updateAnimation = res
        if (res) {
            getMarkerValue(anim, 'updateDelay', 0).then((res) => {
                updateDelay = Number(res)
            })
        }
    })


});

const animPromise = makeAnimPromise()

webcg.on('data', function (data) {
    let updateTiming = 0
    logo = data["logo"]
    console.log('data from casparcg received')
    animPromise.then(resolve => {
            anim.goToAndPlay(logo, true)
            console.log(resolve)
            setTimeout(() => {
            }, updateTiming);

        })
        .catch(error => console.log(error))
});




//casparcg control
webcg.on('play', function () {
    animPromise.then((resolve) => {
        console.log(logo)
        anim.goToAndPlay(logo, true);
        if (loopExits && loopExternal) {
            externalLoop.goToAndPlay(logo, true);
        }
        isOn = true;
        nextAnimation = 'no animation';
    });

});

webcg.on('stop', function () {
    console.log('stop')
            anim.goToAndPlay('stop', true)
            isOn = false
});

webcg.on('playAnimation', function (animationName) {
    console.log('trying to playAnimation ' + animationName)
    if(isOn){
       anim.goToAndPlay(animationName, true);
    }else{
        console.log('isOn is False')
    }
   
    
});

webcg.on('update', function () {
    if (!loopExternal) {
        clearTimeout(loopRepeat);
    }

    if (anim.isPaused || loopExternal) {
        loopTiming = 0

    } else if (isOn) {
        loopTiming = loopDuration - Math.round(anim.currentFrame)

    }
});
