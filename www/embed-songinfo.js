function OMGEmbeddedViewerGIG (viewer) {
    let data = viewer.data
    let html = `
    <style>.gig-caption{color: #606060;}</style>
    <div class='omg-thing-p'>
    <span class="gig-caption">Status: </span>
    ${data.status || ""}
    <br>
    <span class="gig-caption">Name: </span>
    ${data.name || ""}
    <br>
    <span class="gig-caption">Singer:</span>
    ${data.singer || ""}
    <br>
    <span class="gig-caption">Starts With:</span>
    ${data.starts || ""}
    <br>
    <span class="gig-caption">BPM:</span>
    ${data.bpm || ""}
    <br>
    <span class="gig-caption">Key:</span>
    ${data.key || ""}
    </div>
    `

    viewer.embedDiv.innerHTML = html
}

if (typeof omg === "object" && omg.registerEmbeddedViewer) {
    omg.registerEmbeddedViewer("BANDSONG", OMGEmbeddedViewerGIG)
}
