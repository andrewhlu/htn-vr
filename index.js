const serverWs = new WebSocket("wss://ec16-129-97-124-2.ngrok.io/");

serverWs.onopen = () => {
    console.log("Server connection open!");

    titleText.setAttribute('text', {
        value: "Connected!"
    });
};

serverWs.onmessage = (event) => {
    const titleText = document.querySelector('#title-text');
    const data = JSON.parse(event.data);
    // console.log("Server message:", data);

    if (data.type === "gaze") {
        // titleText.setAttribute('text', {
        //     value: Math.round(data.x)
        // }); 

        const gazeBall = document.querySelector('#gaze-tracker');
        gazeBall.setAttribute('position', `${data.x} ${data.y} -1`);
    } else if (data.type === "blink") {
        console.log("Blink event detected!");
        titleText.setAttribute('text', {
            value: "You blinked!"
        });

        setTimeout(() => {
            titleText.setAttribute('text', {
                value: "Hello!"
            });
        }, 1500);
    }
};

AFRAME.registerComponent('right-hand', {
    init: function () {
        console.log("Initialized right hand");

        this.el.addEventListener("triggerdown", (event) => {
            console.log("Trigger down");
            serverWs.send(JSON.stringify({type: "calibration-point"}));
        });

        this.el.addEventListener("abuttondown", (event) => {
            console.log("A button down, Quick Start activated");
            serverWs.send(JSON.stringify({type: "quickstart"}));
        });

        this.el.addEventListener("thumbstickdown", (event) => {
            console.log("Thumbstick down");
            serverWs.send(JSON.stringify({type: "calibration-start"}));
        }
    }
});
