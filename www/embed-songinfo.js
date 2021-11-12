function OMGEmbeddedViewerBANDSONG (viewer) {
    let data = viewer.data

    let attachments = ""
    if (data.attachments) {
        data.attachments.forEach(media => {
            attachments += "<div> * " + media.mimeType + " <a href='" + media.url + "'>" + media.name + "</a></div>"
            if (media.mimeType.startsWith("audio")) {
                attachments += "<audio controls='' preload='none' src='" + media.url + "'></audio>"
            }
        })
    }


    let html = `
    <style>.gig-caption{color: #606060;}</style>
    <div class='omg-thing-p'>
    <span class="gig-caption">Attachments:</span>
    ${attachments}
    <hr>
    <span class="gig-caption">Status: </span>
    ${data.status || ""}
    <br>
    <span class="gig-caption">Singer:</span>
    ${data.singer || ""}
    <span class="gig-caption">Starts With:</span>
    ${data.starts || ""}
    <br>
    <span class="gig-caption">BPM:</span>
    ${data.bpm || ""}
    <span class="gig-caption">Key:</span>
    ${data.key || ""}
    </div>
    `

    viewer.embedDiv.innerHTML = html
}
