window.ondragover = function(e){
    e.preventDefault()
}

window.ondrop = function(e){
    e.preventDefault(); 
    upload(e.dataTransfer.files[0]); 
}

function upload(file) {
    if (!file || !file.type.match(/image.*/)) return;
    
    document.body.className = "uploading";
    var fd = new FormData();
    fd.append("image", file);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.imgur.com/3/image.json");
    xhr.onload = function() {
        document.querySelector("#link").href = JSON.parse(xhr.responseText).data.link;
        document.body.className = "uploaded";
    }
        
    xhr.setRequestHeader('Authorization', 'Client-ID 37aa31c2a25b049');
    xhr.send(fd);
}