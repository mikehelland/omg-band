function OMGEmbeddedViewerGIG (viewer) {
    let data = viewer.data
    let html = `
    <style>.gig-caption{color: #606060; display:inline-block; width:80px}</style>
    <div class='omg-thing-p'>
    <span class="gig-caption">Status: </span>
    <span style='background-color: ${data.status === "PROPOSED" ? "#FF8888" : "#88FF88"}'>
    ${data.status}
    </span>
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
    </div>
    `
    viewer.embedDiv.innerHTML = html

}
