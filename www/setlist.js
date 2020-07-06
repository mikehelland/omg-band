// this will be the final thing
let setList = {type: "SETLIST", sets: [[], [], [], []]}

// this includes the master list and set lists so the app can treat them equal
// master list first, then 4 others
let allsets = [[], [], [], [], []]
let setCount
let setDivs = document.getElementsByClassName("set")
let bpmGraphs = document.getElementsByClassName("set-bpm-graph")

let setCountInput = document.getElementById("set-count")
setCountInput.onchange = e => {
    setCount = parseInt(setCountInput.value)
    for (var i = 0; i < setDivs.length; i++) {
        setDivs[i].style.display = i <= setCount ? "block" : "none"
    }    i
}
setCountInput.onchange()

let loadMasterList = () => {
    let masterListDiv = document.getElementById("master-list")
    fetch("/data?type=SONGINFO&perPage=200").then(res => res.json()).then(results => {
        allsets[0] = results
        for (var i = results.length - 1; i >= 0; i--) {
            
            if (edittingSetList && isInSetList(results[i])) {
                results.splice(i, 1)
                continue
            }
            
            var el = makeSongTile(results[i])
            masterListDiv.appendChild(el)    
            makeDraggable(el, results[i], allsets[0])
        }
    }).catch(e => console.error(e))
    
    document.getElementById("main-body").onmousedown = e=>e.preventDefault()
    masterListDiv.onmousedown = e=>e.preventDefault()    
}

let makeSongTile = songInfo => {

    let el = document.createElement('div')
    el.className = "song"
    el.innerHTML = songInfo.name
    
    let bpm = document.createElement('div')
    bpm.className = "song-bpm"
    bpm.innerHTML = songInfo.bpm
    el.appendChild(bpm)

    return el
}


let edittingSetList
omg.server.getUser(user => {
    if (!user) {
        window.location = "/signin.htm?fwd=" + encodeURIComponent(window.location.href)
    }
})
let params = omg.util.getPageParams()
if (params.id) {
    omg.server.getId(params.id, result => {
        if (!result || !result.id) {
            return
        }

        edittingSetList = result

        allsets[1] = result.sets[0] || []
        allsets[2] = result.sets[1] || []
        allsets[3] = result.sets[2] || []
        allsets[4] = result.sets[3] || []
        document.getElementById("setlist-name").value = result.name || ""
        setCountInput.value = result.setCount || 3
        loadMasterList()
        loadSavedSets()
        drawBPMGraphs()
    })
}
else {
    loadMasterList()
}

let loadSavedSets = () => {
    for (let i = 1; i < allsets.length; i++) {
        for (let j = 0; j < allsets[i].length; j++) {
            var el = makeSongTile(allsets[i][j])
            setDivs[i].appendChild(el)    
            makeDraggable(el, allsets[i][j], allsets[i])
        }
    }
}


// drag n drop context
let dndContext = {}
dndContext.screenDiv = document.getElementById("dnd-handler")
let makeDraggable = (div, songInfo, sourceSet) => {
    div.style.pointerEvents = "initial"

    div.onmousedown = e => {
        e.preventDefault()
        dndContext.ondown(e.pageX, e.pageY, div, songInfo, sourceSet)
    }

    div.addEventListener("touchstart", e => {
        e.preventDefault()
        dndContext.ondown(e.targetTouches[0].pageX, e.targetTouches[0].pageY, div, songInfo, sourceSet)

    })
}

dndContext.ondown = (x,y, div, songInfo, sourceSet) => {
    let now = Date.now()
    dndContext.startedAt = now
    dndContext.startedX = x
    dndContext.startedY = y
    dndContext.dX = 0
    dndContext.dY = 0
    setTimeout(() => {
        if (dndContext.startedAt !== now) {
            return
        }

        if (dndContext.dX < 10 && dndContext.dY < 10) {
            //todo edit
            dndContext.screenDiv.removeChild(dndContext.draggingDiv)
            dndContext.screenDiv.style.display = "none"
            dndContext.startedAt = 0
            dndContext.draggingDiv = undefined
            dndContext.div.style.opacity = 1
    
        }

    }, 1000)

    dndContext.div = div
    dndContext.thing = songInfo
    dndContext.sourceSet = sourceSet
    
    dndContext.div.style.opacity = 0.5
    dndContext.draggingDiv = document.createElement("div")
    dndContext.draggingDiv.innerHTML = div.innerHTML
    dndContext.draggingDiv.className = "song"
    dndContext.draggingDiv.style.position = "absolute"
    dndContext.draggingDiv.style.pointerEvents = "none"
    dndContext.screenDiv.appendChild(dndContext.draggingDiv)
    dndContext.screenDiv.style.display = "block"
    dndContext.draggingDiv.style.left = x - dndContext.draggingDiv.clientWidth / 2 - 10 + "px"
    dndContext.draggingDiv.style.top = y - dndContext.draggingDiv.clientHeight / 2 - 10 + "px"

}

dndContext.screenDiv.onmousemove = e => {
    dndContext.onmove(e.pageX, e.pageY)
}

document.body.addEventListener("touchmove", e => {
    dndContext.onmove(e.targetTouches[0].pageX, e.targetTouches[0].pageY)
})

dndContext.onmove = (x, y) => {

    if (dndContext.highlightedDiv) {
        dndContext.highlightedDiv.style.borderBottom = "initial"
    }

    if (!dndContext.draggingDiv) {
        return
    }

    if (Math.abs(x - dndContext.startedX) > dndContext.dX) {
        dndContext.dX = Math.abs(x - dndContext.startedX)
    }
    if (Math.abs(y - dndContext.startedY) > dndContext.dY) {
        dndContext.dY = Math.abs(y - dndContext.startedY)
    }

    dndContext.draggingDiv.style.left = x - dndContext.draggingDiv.clientWidth / 2 - 10 + "px"
    dndContext.draggingDiv.style.top = y - dndContext.draggingDiv.clientHeight / 2 - 10 + "px"

    if (dndContext.dX < 10 && dndContext.dY < 10) {
        return
    }
    
    for (let i = allsets.length - 1; i >= 0; i--) {
        
        if (x > setDivs[i].offsetLeft && x < setDivs[i].offsetLeft + setDivs[i].clientWidth) {
            setDivs[i].style.border =  "1px solid #009900"
            dndContext.currentSet = i
            dndContext.currentSetDiv = setDivs[i]
            
            let searching = true
            for (let j = allsets[i].length; j >= 0; j--) {
                if (searching && 
                            (y > setDivs[i].children[j].offsetTop + setDivs[i].children[j].clientHeight
                            || j === 0)) {
                    dndContext.highlightedDiv = setDivs[i].children[j]
                    dndContext.highlightedDiv.style.borderBottom = "30px solid #008800"
                    searching = false

                    dndContext.currentSong = j - 1
                }
                else {
                    setDivs[i].children[j].style.borderBottom = "initial"
                }
            }
        }
        else {
            setDivs[i].style.border = "1px solid transparent"
        }
    }
    
}

dndContext.screenDiv.onmouseup = e => {
    dndContext.onend(e.pageX, e.pageY)
}

document.body.addEventListener("touchend", e => {
    //dndContext.onend(e.targetTouches[0].pageX, e.targetTouches[0].pageY)
    dndContext.onend()
})

dndContext.onend = (x, y) => {

    if (!dndContext.draggingDiv) {
        return 
    }

    dndContext.screenDiv.removeChild(dndContext.draggingDiv)

    dndContext.screenDiv.style.display = "none"
    
    if (typeof dndContext.currentSet === "number") {
        allsets[dndContext.currentSet].splice(dndContext.currentSong + 1, 0, dndContext.thing)
        dndContext.draggingDiv.style.position = "initial"
        
        if (dndContext.highlightedDiv) {
            dndContext.highlightedDiv.style.borderBottom = "initial"
            dndContext.currentSetDiv.insertBefore(dndContext.draggingDiv, dndContext.highlightedDiv.nextSibling)
        }
        else {
            dndContext.currentSetDiv.appendChild(dndContext.draggingDiv)
        }
        
        dndContext.div.parentElement.removeChild(dndContext.div)
        let sourceI = dndContext.sourceSet.indexOf(dndContext.thing)
        if (sourceI > -1) {
            dndContext.sourceSet.splice(sourceI, 1)
        }
        
        makeDraggable(dndContext.draggingDiv, dndContext.thing, allsets[dndContext.currentSet])

        if (dndContext.currentSet > 0) {
            drawBPMGraph(dndContext.currentSet - 1)
        }
        dndContext.currentSetDiv.style.border = "1px solid transparent"
        dndContext.currentSet = undefined
        dndContext.currentSetDiv = undefined
        dndContext.highlightedDiv == undefined
        
    }
    else {
        dndContext.div.style.opacity = 1
    }

    dndContext.startedAt = 0
    dndContext.draggingDiv = undefined
}

let drawBPMGraphs = () => {
    drawBPMGraph(0)
    drawBPMGraph(1)
    drawBPMGraph(2)
    drawBPMGraph(3)
}
let drawBPMGraph = (setI) => {
    let canvas = bpmGraphs[setI]
    let ctx = canvas.getContext("2d")

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
 
    
    let set = allsets[setI + 1]
    let songLength = canvas.width / set.length
    
    ctx.strokeStyle = "red"
    ctx.beginPath()
    for (var i = 0; i < set.length; i++) {
        if (!set[i].bpm) {
            continue
        }

        if (i === 0) {
            ctx.moveTo(0, canvas.height - (set[0].bpm / 200 * canvas.height))
            ctx.lineTo(songLength, canvas.height - (set[i].bpm / 200 * canvas.height))
        }
        else {
            ctx.lineTo(i * songLength, canvas.height - (set[i].bpm / 200 * canvas.height))
            ctx.lineTo((i + 1) * songLength, canvas.height - (set[i].bpm / 200 * canvas.height))
        }
    }
    ctx.stroke()
}

document.getElementById("save-button").onclick = e => {

    let thing = edittingSetList || {type: "SETLIST"}
    
    if (thing.id) {
        if (thing.user_id === omg.user.id) {
            // ask to overwrite
        }
        else {
            delete thing.id
        }
    }

    thing.name = document.getElementById("setlist-name").value || ""
    thing.setCount = setCount
    thing.sets = [
        allsets[1], 
        allsets[2], 
        allsets[3], 
        allsets[4]
    ]

    omg.server.post(thing, result=>{
        window.location = "setlist.htm?id=" + result.id
    })
}

let isInSetList = songInfo => {
    for (var i = 0; i < allsets.length - 1; i++) {
        for (var j = 0; j < allsets[i + 1].length; j++) {
            if (songInfo.name === allsets[i + 1][j].name) {
                return true
            }
        }
    }
    return false
}