const ipcRenderer = require('electron').ipcRenderer
const dirTree = require('directory-tree')
const numeral = require('numeral')
var imagesDOM

//Folder Size Processing
var formatSize = (folderSize) => {
    var prefix = ['bytes', 'KB', 'MB', 'GB', 'TB']
    var prefixCounter = 0
    while(folderSize > 1024){
        folderSize = folderSize / 1024
        prefixCounter = prefixCounter + 1
    }
    return (numeral(folderSize).format('0.0') + " " + prefix[prefixCounter])
}

//IPC Listener
ipcRenderer.on('directory-path', (e, path) => {
    var images = dirTree(path, {extensions: /(\.jpg|\.png|\.jpeg)/i}).children
    var pictureList = document.querySelector('.picture-list')
    var mediaDetailList = document.querySelector('.media-detail-area')
    mediaDetailList.innerHTML = "<p style='flex-basis: 60%'>Please hover on an image for details</p>"
    var panelInnerHTML = ""
    document.querySelector('.item-count').innerHTML = "<p>" + images.length + " items</p>"
    var folderSize = 0
    images.forEach((image) => {
        panelInnerHTML = panelInnerHTML + "<div class='panel'><img height='100%' src='" + image.path + "'></div>"
        folderSize = folderSize + image.size
    })
    document.querySelector('.folder-size').innerHTML = "<p>" + formatSize(folderSize) + "</p>"
    pictureList.innerHTML = panelInnerHTML
    //Image click Listeners
    imagesDOM = document.querySelectorAll('img')
    imagesDOM.forEach((image, idx) => {
        //Image Click Listener
        image.addEventListener('click', () => {
            modal.classList.toggle('modal-is-active')
            modal.classList.toggle('modal-is-inactive')
            document.querySelector('.modal-content').innerHTML = "<img width='80%' src='" + image.src + "'/>"
            currImageIdx = idx
        })
        //Image Hover Listeners
        image.addEventListener('mouseenter', () => {
            var detail = "<p>Name: " + images[idx].name + "</p><p>Size: " + formatSize(images[idx].size)
            mediaDetailList.innerHTML = detail;
        })
        image.addEventListener('mouseout', () => {
            mediaDetailList.innerHTML = "<p>Please hover on an image for details</p>"
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