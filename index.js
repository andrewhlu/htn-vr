const serverWs = new WebSocket("wss://0656-129-97-124-10.ngrok.io");

serverWs.onopen = () => {
    console.log("Server connection open!");
};

serverWs.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Server message:", data);

    const titleText = document.querySelector('#title-text');
    titleText.setAttribute('text', {
        value: Math.round(data.x)
    }); 

    const gazeBall = document.querySelector('#gaze-tracker');
    gazeBall.setAttribute('position', `${data.x} ${data.y} -1`);
};

AFRAME.registerComponent('right-hand', {
    init: function () {
        console.log("Initialized right hand");

        this.el.addEventListener("triggerdown", (event) => {
            console.log("Trigger down");
            serverWs.send(JSON.stringify({type: "calibration"}));
        });
    }
});
