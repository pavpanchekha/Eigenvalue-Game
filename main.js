function randn() {
    var a = 0;
    for (var i = 0; i < 25; i++) {
        a += Math.random() * 2 - 1;
    }
    return a;
}

function gaussianmat() {
    return [[randn(), randn()], [randn(), randn()]];
}

function randmat() {
    do {
        var a = gaussianmat();
        var charpol = [a[0][0]*a[1][1] - a[1][0]*a[0][1], a[0][0] + a[1][1], 1];
        var desc = charpol[1]*charpol[1] - 4 * charpol[0] * charpol[2];
    } while (desc < 0);
    return a;
}

function matapply(v) {
    return [mat[0][0] * v[0] + mat[0][1] * v[1],
            mat[1][0] * v[0] + mat[1][1] * v[1]];
}

function norm(v) {
    return Math.sqrt(dot(v, v));
}

function dot(v, w) {
    return v[0] * w[0] + v[1] * w[1];
}

function angle(v, w) {
    return Math.acos(Math.abs(dot(v, w) / (norm(v) * norm(w))));
}

function setup() {
    r2 = document.getElementById("R2");
    rc = r2.getContext("2d");
    reset();
    r2.addEventListener("click", on_click, false);
}

function reset() {
    rc.beginPath();
    r2.width = r2.width;
    rc.moveTo(300.5, 0);
    rc.lineTo(300.5, 600);
    rc.moveTo(0, 300.5);
    rc.lineTo(600, 300.5);
    rc.lineWidth = 3;
    rc.strokeStyle = "#2e3436";
    rc.stroke();

    mat = randmat();
    eig = [];
    clicks = 0;
}

function draw_vector(v, color) {
    color = color ? color : "#888";

    rc.beginPath();
    rc.moveTo(300, 300);
    rc.lineTo(v[0] + 300, 300 - v[1]);
    rc.strokeStyle = color;
    rc.lineWidth = 2;
    rc.lineCap = "square";
    rc.stroke();
}

function on_click(evt) {
    var x = evt.clientX - r2.offsetLeft - 300;
    var y = 300 - (evt.clientY - r2.offsetTop);

    var init = [x, y];
    var image = matapply(init);

    draw_vector(init, "#5c3566");
    if (angle(init, image) < .1) {
        // Eigenvector!
        draw_vector(image, "#4e9a06");
        
        if (!eig.length) {
            eig.push(image);
        }

        for (var v in eig) {
            if (angle(eig[v], image) > .2) {
                eig.push(image);
                break;
            }
        }

        var value = Math.sqrt(image[0] / init[0] * image[1] / image[1]);
    } else {
        draw_vector(image, "#729fcf");
        clicks += 1;
    }
    
    update_clicks();
    update_points();

    return false;
}

function update_clicks() {
    var c = document.getElementById("clicks");
    c.innerHTML = clicks;
}

function update_points() {
    var p = document.getElementById("points");
    p.innerHTML = eig.length;
}
