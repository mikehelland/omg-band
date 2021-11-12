function OMGEmbeddedViewerBANDSONG (viewer) {
    let data = viewer.data

    let attachments = ""
    if (data.attachments) {
        data.attachments.forEach(media => {
            attachments += "<div>" + media.mimeType + " <a href='" + media.url + "'>" + media.name + "</a></div>"
            if (media.mimeType.startsWith("audio")) {
                attachments += "<audio controls='' preload='none' src='" + media.url + "'></audio>"
            }
        })
    }


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
    <br>
    <span class="gig-caption">Attachments:</span>
    ${attachments}
    </div>
    `

    viewer.embedDiv.innerHTML = html
}
