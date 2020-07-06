function OMGEmbeddedViewerSETLIST (viewer) {
    let data = viewer.data
console.log(data.setCount)
    for (let i = 0; i < data.setCount; i++) {
        let html = "<span style='opacity: 0.6;'>Set " + (i + 1) + ": </span>"
        for (let j = 0; j < data.sets[i].length; j++) {
            if (j < 5) {
                html += data.sets[i][j].name + (j < data.sets[i].length - 1 ? ", ": "") 
            }
            else if (j === 5) {
                html += "... more ..."
            }
            
        }
        let el = document.createElement('p')
        el.innerHTML = html
        el.className = "omg-thing-p"
        viewer.embedDiv.appendChild(el)
    }
}

if (typeof omg === "object" && omg.registerEmbeddedViewer) {
    omg.registerEmbeddedViewer("SETLIST", OMGEmbeddedViewerSETLIST)
}
