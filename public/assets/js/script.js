const ipcRenderer = require('electron').ipcRenderer
const dirTree = require('directory-tree')
var imagesDOM

ipcRenderer.on('directory-path', (e, path) => {
    var images = dirTree(path, {extensions: /(\.jpg|\.png|\.jpeg)/i}).children
    var appContainer = document.querySelector('.app-container')
    var innerHTML = ""
    images.forEach((image) => {
        innerHTML = innerHTML + "<div class='panel'><img height='100%' src='" + image.path + "'></div>"
    })
    appContainer.innerHTML = innerHTML
    //Image click Listeners
    imagesDOM = document.querySelectorAll('img')
    console.log(imagesDOM)
    imagesDOM.forEach((image, idx) => {
        image.addEventListener('click', () => {
            modal.classList.toggle('modal-is-active')
            modal.classList.toggle('modal-is-inactive')
            document.querySelector('.modal-content').innerHTML = "<img width='80%' src='" + image.src + "'/>"
            currImageIdx = idx
        })
    })
})

var currImageIdx = -1
var modal = document.querySelector('.modal')

//Modal Close Listener
document.querySelector('.modal-close').addEventListener('click', () => {
    modal.classList.toggle('modal-is-active')
    modal.classList.toggle('modal-is-inactive')
})

//Modal Nav Listeners
document.querySelector('.modal-nav-left').addEventListener('click', () => {
    if(currImageIdx != 0){
        currImageIdx = currImageIdx - 1
        document.querySelector('.modal-content').innerHTML = "<img width='80%' src='" + imagesDOM[currImageIdx].src + "'/>"
    }
})
document.querySelector('.modal-nav-right').addEventListener('click', () => {
    if(currImageIdx != imagesDOM.length - 1){
        currImageIdx = currImageIdx + 1
        document.querySelector('.modal-content').innerHTML = "<img width='80%' src='" + imagesDOM[currImageIdx].src + "'/>"
    }
})