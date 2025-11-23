// app.js




// some confusing code that makes it so that if the monitor is 60 fps, then the game will run using requestAnimationFrame at 60 fps
// otherwise, the game will run at 60 fps using setInterval, since requestAnimationFrame uses the monitor's refresh rate
function startGameloop() {
    const getFPS = () =>
        new Promise(resolve =>
            requestAnimationFrame(t1 =>
                requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
        ));

    let is60FPS = true;
    function setFPS() {
        getFPS().then(fps => {
            // console.log("detected fps: " + fps);
            is60FPS = !(fps > 80 || fps < 30);
        });
    }
    setTimeout(() => {
        setFPS();
        setInterval(() => {
            setFPS();
        }, 1000);
    }, 100);

    let u = () => {
        if(is60FPS)
            update();
        requestAnimationFrame(u);
    };
    requestAnimationFrame(u);

    setInterval(() => {
        if(!is60FPS)
            update();
    }, 1000 / 60);
}



function init() {
    GlobalState.sceneManager = new SceneManager();

    // Load the styx_level
    if (Loader.levels['saloon']) {
        const styxLevel = new SaloonScene(Loader.levels['saloon'].xml);
        styxLevel.init();
        GlobalState.sceneManager.setScene(styxLevel);
    } else {
        console.error('styx_level not found in Loader.levels');
    }
    
    startGameloop();
}

// Main Game Loop
function update() {
    if (typeof updateGamepadInputs === 'function') {
        updateGamepadInputs();
    }

    context.fillStyle = CONSTANTS.BACKGROUND_COLOR;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    



    if(GlobalState.sceneManager) {
        GlobalState.sceneManager.update();
        context.view.update(16);

        GlobalState.sceneManager.draw(context);
    }


    
    // draw border around outside of screen
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.strokeRect(0, 0, WIDTH, HEIGHT);


    updateFrameTimeouts();
    APP_ELAPSED_FRAMES++;




}
