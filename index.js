const serverWs = new WebSocket("wss://6415-2620-101-f000-700-a857-7b6d-4b89-f2a9.ngrok.io");

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
