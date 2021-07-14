document.addEventListener("DOMContentLoaded", init);
let loadedTopVideos = 0;
let fetchedDataTopVideos;
let loaded = 0;
let fetchedData;
let selectedVideo;

function init() {
    getTopVideos();
    getVideos();
    document.querySelector("#search").addEventListener("submit", searchKeyword);
    document.addEventListener("click", checkPopupClose);
    // document.getElementById("sliderRating").oninput = function () {
    //     var value = (this.value - this.min) / (this.max - this.min) * 100;
    //     this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + value + '%, #d3d3d3 ' + value + '%, #d3d3d3 100%)';
    //     document.getElementById("submitRating").style.display = "block";
    // };
    // document.getElementById("submitRating").addEventListener("click", submitRating);
    //  document.getElementById("previous").addEventListener("click", navigationPopup);
    // document.getElementById("next").addEventListener("click", navigationPopup);

}



async function getTopVideos() {

    const url = '/api/media/topVideos';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }


        });
        const json = await response.json();
        if (json.success == true) {

            console.log(json.data);

            fetchedDataTopVideos = json.data;

            if (fetchedDataTopVideos.length) {

                for (var i = 0; i < fetchedDataTopVideos.length; i++) {
                    let imgUrl = fetchedDataTopVideos[i].previewUrl;
                       // <img class="imageCard" alt=""  src="${imgUrl}">
                    let videoUrl = fetchedDataTopVideos[i].contentUrl;
                   // <video class="videoCard" alt=""  src="${videoUrl}" onmouseleave="pausePreviewVideo(this)" onmouseenter="previewVideo(this)"></video>
                    let title = fetchedDataTopVideos[i].title;
                    let source = fetchedDataTopVideos[i].source;
                    let topic = fetchedDataTopVideos[i].topic;
                    let length = fetchedDataTopVideos[i].length;
                    if (length.startsWith("00:")) {
                        length = length.substring(3);
                    }
                    let rating = fetchedDataTopVideos[i].rating;

                    document.querySelector("#topVideos .topContent").innerHTML += `<div class="card" onclick="showPopup(this)">
                    <div class="mediaContainer top" onmouseenter="fetchVideoPreview2(this)" onmouseleave="stopPreviewVideo2(this)">
                    <img class="videoCard" alt="" src="${imgUrl}">
                <video class="videoCard" alt="" src="" style="display:none"></video>
                </div>
                    <div class="title" >${title}</div>
                       <div class="source">${source}</div>
                       <div class="flexSpaceBetween">
                       <div class="topic">${topic}</div>
                       <div class="videoLength">${length}</div>
                       </div>
                      <div class="rating">Rating: ${rating.toFixed(2)}/10.00</div>
                  </div>`;
                }

                loadedTopVideos = fetchedDataTopVideos.length - 1;

            } else {
                document.querySelector("#topVideos .topContent").innerHTML = "There were no ratings given for any video. Be the first one to rate a video!";
            }


        } else if (json.success == false) {

        }


    } catch (error) {
        console.error('Error:', error);
        //window.alert("Problem with fetching mediaType.");
    }

}

async function getVideos() {

    const url = '/api/media/mediaType/video';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }


        });
        const json = await response.json();
        if (json.success == true) {

            console.log(json.data);
            let shuffledData;
            //Shuffle data so every page load shows another image order
            shuffledData = shuffleImages(json.data);
            fetchedData = shuffledData;

            for (var i = 0; i < 8; i++) {
                let imgUrl = fetchedData[i].previewUrl;
                   // <img class="imageCard" alt=""  src="${imgUrl}">
                let videoUrl = fetchedData[i].contentUrl;
                  // <video class="videoCard" alt=""  src="${videoUrl}" onmouseleave="pausePreviewVideo(this)" onmouseenter="previewVideo(this)"></video>
                let title = fetchedData[i].title;
                let source = fetchedData[i].source;
                let topic = fetchedData[i].topic;
                let length = fetchedData[i].length;
             
                if (length.startsWith("00:")) {
                    length = length.substring(3);
                }

                document.querySelector("#moreVideos .moreContent").innerHTML += `<div class="card" onclick="showPopup(this)">
              
                <div class="mediaContainer" onmouseenter="fetchVideoPreview2(this)" onmouseleave="stopPreviewVideo2(this)">
                <img class="videoCard" alt="" src="${imgUrl}">
            <video class="videoCard" alt="" src="" style="display:none"></video>
            </div>
                <div class="title" >${title}</div>
                   <div class="source">${source}</div>
                   <div class="flexSpaceBetween">
                   <div class="topic">${topic}</div>
                   <div class="videoLength">${length}</div>
                   </div>
              </div>`;
            }
            loaded = 8;
            document.querySelector("#moreVideos").innerHTML += '<div class="loadDiv">Load more</div>';
            document.querySelector(".loadDiv").addEventListener("click", loadMore);

            //hover over video
            // document.querySelectorAll(".videoCard").forEach(item => item.addEventListener("mouseenter", function (e) {
            //         console.log(e);
            //         this.currentTime = 40;
            //         this.muted = true
            //         this.play();
            //         console.log(this.currentTime);


            //     })

            // );

            // //hover out video
            // document.querySelectorAll(".videoCard").forEach(item => item.addEventListener("mouseleave", function (e) {
            //     console.log("pause video");
            //     console.log(e);
            //     this.pause();
            //     clearInterval(repeat);
            // }));




        } else if (json.success == false) {

        }


    } catch (error) {
        console.error('Error:', error);
        //window.alert("Problem with fetching mediaType.");
    }

}


function loadMore() {


    for (var i = loaded; i < loaded + 8; i++) {
        let imgUrl = fetchedData[i].previewUrl;
           // <img class="imageCard" alt=""  src="${imgUrl}">
        let videoUrl = fetchedData[i].contentUrl;
          // <video class="videoCard" alt=""  src="${videoUrl}" onmouseleave="pausePreviewVideo(this)" onmouseenter="previewVideo(this)"></video>
        let title = fetchedData[i].title;
        let source = fetchedData[i].source;
        let topic = fetchedData[i].topic;
        let length = fetchedData[i].length;
        if (length.startsWith("00:")) {
            length = length.substring(3);
        }

        document.querySelector("#moreVideos .moreContent").innerHTML += `<div class="card" onclick="showPopup(this)" >
        <div class="mediaContainer" onmouseenter="fetchVideoPreview2(this)" onmouseleave="stopPreviewVideo2(this)">
        <img class="videoCard" alt="" src="${imgUrl}">
    <video class="videoCard" alt="" src="" style="display:none"></video>
    </div>
        <div class="title" >${title}</div>
           <div class="source" >${source}</div>
           <div class="flexSpaceBetween">
           <div class="topic">${topic}</div>
           <div class="videoLength">${length}</div>
           </div>
      </div>`;
    }
    console.log(i);
    loaded = i;

}

function showPopup(e) {

    console.log(e);
    // get position of clicked video relative to its parent
    selectedVideo = Array.from(e.parentElement.children).indexOf(e);
    //check whether clicked element is in top Videos or more Videos
    let parent = e.parentElement.className;
    let data;
    let len;
    let navigation;
    if (parent == "topContent") {
        data = fetchedDataTopVideos[selectedVideo];
        navigation = "top";
        //check whether last element to hide arrow right
        len = fetchedDataTopVideos.length;
        //document.getElementById("submitRating").classList.add("top");
    } else if (parent == "moreContent") {
        data = fetchedData[selectedVideo];
        navigation = "more";
        len = fetchedData.length;
        //document.getElementById("submitRating").classList.remove("top");
    } else if (parent == "searchContent") {
        data = fetchedDataSearch[selectedVideo];
        navigation = "search";
        len = fetchedDataSearch.length;
        //document.getElementById("submitRating").classList.remove("top");
    }


    console.log(data);
    let contentTag;

    if (data.mediaType == "video") {
        contentTag = '<video class="popupImageCard" alt="" src="" controls>Your browser does not support the video tag. </video>';
    } else if (data.mediaType == "image") {
        contentTag = '<img class="popupImageCard" alt="" src="">';
    }

    document.getElementById("innerPopup").innerHTML = `<div class="flexSpaceBetween marginBottom">
    <img id="previous" src="./assets/left.svg" class="arrows ${navigation}" title="Previous" onclick="navigationPopup(this)">
    <div class="popupTitle"></div>
    <img id="next" src="./assets/right.svg" class="arrows ${navigation}" title="Next" onclick="navigationPopup(this)">
</div>
${contentTag}
<div class="flexRow">
    <div id="contentBox">
        <div class="popupSource"></div>
        <div class="popupTopic"></div>
        <div class="popupDescription"></div>
    </div>
    <div id="ratingBox">
        <div class="rating" title="Please rate this ${data.mediaType}">
            Rating
        </div>
        <input type="range" min="1" class="slider-pic" id="sliderRating" max="10" value="1">
        <div class="ratingAmount" title="Total ratings">
            No ratings yet. Be the first to make one!
        </div>
        <input type="button" value="Submit" id="submitRating" class="${navigation}">
    </div>

</div>`;

    document.querySelector(".popup").style.display = "flex";

    document.querySelector(".popupTitle").innerHTML = data.title;
    document.querySelector(".popupImageCard").src = data.contentUrl;
    document.querySelector(".popupSource").innerHTML = data.source;
    document.querySelector(".popupTopic").innerHTML = data.topic;

    if (data.ratingAmount) {
        document.getElementById("sliderRating").value = data.rating;
        let val = document.getElementById("sliderRating").value;
        document.getElementById("sliderRating").style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + val * 10 + '%, #d3d3d3 ' + val * 10 + '%, #d3d3d3 100%)';
        document.querySelector(".ratingAmount").innerHTML = `${data.ratingAmount} Ratings (Ø${data.rating.toFixed(2)})`;
    } else {
        document.getElementById("sliderRating").value = 1;
        document.getElementById("sliderRating").style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + 10 + '%, #d3d3d3 ' + 10 + '%, #d3d3d3 100%)';
        document.querySelector(".ratingAmount").innerHTML = 'No ratings yet. Be the first to make one!';

    }

    if (data.description) {
        document.querySelector(".popupDescription").innerHTML = data.description;
    }

        //check whether first or last element in navigation
        if (len == selectedVideo + 1) {
            document.getElementById("next").classList.add("notshow");
        }
        if (selectedVideo == 0) {
            document.getElementById("previous").classList.add("notshow");
        }
    
        //Add eventlisteners for slider
        document.getElementById("sliderRating").oninput = function () {
            var value = (this.value - this.min) / (this.max - this.min) * 100;
            this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + value + '%, #d3d3d3 ' + value + '%, #d3d3d3 100%)';
            document.getElementById("submitRating").style.display = "block";
            document.querySelector("#ratingBox .rating").innerHTML = `Rating: ${this.value}`;
        };
        document.getElementById("submitRating").addEventListener("click", submitRating);


}

function checkPopupClose(e) {

    console.log(e);
    // closes popup when clicked outside of it
    if (!e.target.closest("#innerPopup") && !e.target.closest(".card")) {
        document.querySelector(".popup").style.display = "none";

        //Stop video
        if(document.querySelector("video.popupImageCard")){
            document.querySelector("video.popupImageCard").pause();
        }
       
    }
}

async function submitRating(e) {
   // let checkTop = e.target.classList.contains("top");
   console.log(e); 
     //check whether rating comes from top, more or search popup
   let id;
    if (e.target.classList.contains("search")) {
        id = fetchedDataSearch[selectedVideo]._id;
    } else if (e.target.classList.contains("top")) {
        id = fetchedDataTopVideos[selectedVideo]._id;
    } else if (e.target.classList.contains("more")) {
        id = fetchedData[selectedVideo]._id;
    }
    // if(checkTop == true){
    //     id = fetchedDataTopImages[selectedImage]._id;
    // } else {
    //     id = fetchedData[selectedImage]._id;
    // }

    const url = '/api/media/rating';
    let rating = document.getElementById("sliderRating").value;

    console.log(rating);

    const data = {
        rating: rating,
        media_id: id
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)


        });
        const json = await response.json();
        if (json.success == true) {

            document.querySelector(".ratingAmount").innerHTML = "Thank you very much for your rating. It has been submitted succesfully.";
            document.getElementById("submitRating").style.display = "none";


        } else if (json.success == false) {

        }


    } catch (error) {
        console.error('Error:', error);
        //window.alert("Problem with sending rating.");
    }
}

function navigationPopup(e){

    console.log(e.id);
        //check whether in top, more or search 
    let navigation;
    if (e.className.includes("search")) {
        navigation = fetchedDataSearch;
    } else if (e.className.includes("top")) {
        navigation = fetchedDataTopVideos;
    } else if (e.className.includes("more")) {
        navigation = fetchedData;
    }
    let target = e.id;
    let el;
    let len = navigation.length;
    if (target == "previous") {
        el = navigation[selectedVideo - 1];
        selectedVideo--;
        //check whether upcoming image is first in array, then hide arrow left
        if (selectedVideo == 0) {
            document.getElementById("previous").classList.add("notshow");
        }


        document.getElementById("next").classList.remove("notshow");
    } else if (target == "next") {

        el = navigation[selectedVideo + 1];
        selectedVideo++;

        //check whether first or last element in navigation, or if only item 
        if (len == selectedVideo + 1 || len == 1) {
            document.getElementById("next").classList.add("notshow");
        }
        if (selectedVideo == 0) {
            document.getElementById("previous").classList.add("notshow");
        }
 
        document.getElementById("previous").classList.remove("notshow");
    }


    document.querySelector(".popupTitle").innerHTML = el.title;
    document.querySelector(".popupImageCard").src = el.contentUrl;
    document.querySelector(".popupSource").innerHTML = el.source;
    document.querySelector(".popupTopic").innerHTML = el.topic;

    if (el.ratingAmount) {
        document.getElementById("sliderRating").value = el.rating;
        let val = document.getElementById("sliderRating").value;
        document.getElementById("sliderRating").style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + val * 10 + '%, #d3d3d3 ' + val * 10 + '%, #d3d3d3 100%)';
        document.querySelector(".ratingAmount").innerHTML = `${el.ratingAmount} Ratings (Ø${el.rating.toFixed(2)})`;
    } else {
        document.getElementById("sliderRating").value = 1;
        document.getElementById("sliderRating").style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + 10 + '%, #d3d3d3 ' + 10 + '%, #d3d3d3 100%)';
        document.querySelector(".ratingAmount").innerHTML = 'No ratings yet. Be the first to make one!';
    }

    if (el.description) {
        document.querySelector(".popupDescription").innerHTML = el.description;
    }
   
}

function shuffleImages(e){
    for (let i = e.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [e[i], e[j]] = [e[j], e[i]];
    }
    return e;
}
function fetchVideoPreview2(e) {


    //get order of hovered video in array of search content
    hoveredVideo = Array.from(e.parentElement.parentElement.children).indexOf(e.parentElement);

    //check whether video is in top or more
    let vid = e.classList.contains("top");

    //select appropriate data array
    let mediaArray;
    if (vid == true) {
        mediaArray = fetchedDataTopVideos
    } else {
        mediaArray = fetchedData
    }

    e.children[1].src = mediaArray[hoveredVideo].contentUrl;
    e.children[1].style.display = "flex";
    e.children[0].style.display = "none";

    e.children[1].currentTime = 10;
    e.children[1].muted = true
    e.children[1].play();
}

function stopPreviewVideo2(e) {

    e.children[1].pause();
}
//TEST

function previewVideo(e){
    console.log(e);
    e.currentTime = 40;
    e.muted = true
    e.play();
    console.log(e.currentTime);

}

function pausePreviewVideo(e){
    console.log("pause video");
    console.log(e);
    e.pause();

}