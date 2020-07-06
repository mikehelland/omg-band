function OMGEmbeddedViewerGIG (viewer) {
    let data = viewer.data
    let html = `
    <style>.gig-caption{color: #606060; display:inline-block; width:80px}</style>
    <span class="gig-caption">Status: </span>
    ${data.status}
    <br>
    <span class="gig-caption">Who/What: </span>
    ${data.whowhat}
    <br>
    <span class="gig-caption">When:</span>
    ${data.when}
    <br>
    <span class="gig-caption">Where:</span>
    ${data.where}
    <br>
    <span class="gig-caption">Equipment:</span>
    ${data.equipment}
    <br>
    <span class="gig-caption">Notes:</span>
    ${data.notes}
    <br>
    `
    viewer.embedDiv.innerHTML = html

}

if (typeof omg === "object" && omg.types) {
    if (omg.types["GIG"]) {
        omg.types["GIG"].embedClass = OMGEmbeddedViewerGIG
    }
}
