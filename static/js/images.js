let loadedTopImages = 0;
let fetchedDataTopImages;
let loaded = 0;
let fetchedData;
let selectedImage;

let topimagesId = [];
document.addEventListener("DOMContentLoaded", init);


function init() {
    getTopImages();
    getImages();
    document.querySelector("#search").addEventListener("submit", searchKeyword);
    document.addEventListener("click", checkPopupClose);
 

}


async function getTopImages() {

    const url = '/api/media/topImages';

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

            fetchedDataTopImages = json.data;

            if (fetchedDataTopImages.length) {

                for (var i = 0; i < fetchedDataTopImages.length; i++) {
                    let imgUrl = fetchedDataTopImages[i].contentUrl;
                    let title = fetchedDataTopImages[i].title;
                    let source = fetchedDataTopImages[i].source;
                    let topic = fetchedDataTopImages[i].topic;
                    let rating = fetchedDataTopImages[i].rating.toFixed(2);


                    document.querySelector("#topImages .topContent").innerHTML += `<div class="card" onclick="showPopup(this)">
                    <div class="imageContainer">
                    <img class="imageCard" alt=""  src="${imgUrl}">
                    </div>
                    <div class="title" >${title}</div>
                       <div class="source">${source}</div>
                      <div class="topic">${topic}</div>
                      <div class="rating">Rating: ${rating}/10.00</div>
                  </div>`;
                }

                loadedTopImages = fetchedDataTopImages.length - 1;
            } else {
                document.querySelector("#topImages .topContent").innerHTML = "There were no ratings given for any image. Be the first one to rate an image!";
            }


        } else if (json.success == false) {

        }


    } catch (error) {
        console.error('Error:', error);
     
    }

}

async function getImages() {

    const url = '/api/media/mediaType/image';

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
            //1. exclude "top images" beeing shown in "more images"

            await fetchedDataTopImages.forEach(e => topimagesId.push(e._id));

            fetchedData = json.data.filter(checkId);

            //2. show images of "more images" in random order
            let shuffledData;
            shuffledData = shuffleImages(fetchedData);
            fetchedData = shuffledData;

            //3. write first 8 images in "more images"

            for (var i = 0; i < 8; i++) {
                let imgUrl = fetchedData[i].contentUrl;
                let title = fetchedData[i].title;
                let source = fetchedData[i].source;
                let topic = fetchedData[i].topic;

                document.querySelector("#moreImages .moreContent").innerHTML += `<div class="card" onclick="showPopup(this)">
                <div class="imageContainer">
                <img class="imageCard" alt="" src="${imgUrl}">
                </div>
                <div class="title" >${title}</div>
                   <div class="source">${source}</div>
                  <div class="topic">${topic}</div>
              </div>`;
            }
            loaded = 8;
            document.querySelector("#moreImages").innerHTML += '<div class="loadDiv">Load more</div>';
            document.querySelector(".loadDiv").addEventListener("click", loadMore);




        } else if (json.success == false) {
            console.log("DB error");
        }


    } catch (error) {
        console.error('Error:', error);
     
    }

}


function loadMore() {


    for (var i = loaded; i < loaded + 8; i++) {
        let imgUrl = fetchedData[i].contentUrl;
        let title = fetchedData[i].title;
        let source = fetchedData[i].source;
        let topic = fetchedData[i].topic;

        document.querySelector("#moreImages .moreContent").innerHTML += `<div class="card" onclick="showPopup(this)" >
        <div class="imageContainer">
        <img class="imageCard" alt="" src="${imgUrl}">
        </div>
        <div class="title" >${title}</div>
           <div class="source" >${source}</div>
          <div class="topic" >${topic}</div>
      </div>`;
    }
    console.log(i);
    loaded = i;

}



function showPopup(e) {

    //check whether img or video then render to specific format


    console.log(e);
    // get position of clicked image relative to its parent
    selectedImage = Array.from(e.parentElement.children).indexOf(e);
    //check whether clicked element is in top images or more images, or from search results
    let parent = e.parentElement.className;
    let data;
    let len;
    //for later navigation track whether selected file is in top content, more content or search results
    let navigation;
    if (parent == "topContent") {
        data = fetchedDataTopImages[selectedImage];
        navigation = "top";
        //check whether last element to hide arrow right
        len = fetchedDataTopImages.length;


    } else if (parent == "moreContent") {
        data = fetchedData[selectedImage];
        navigation = "more";
        len = fetchedData.length;

    } else if (parent == "searchContent") {

        //check if filter is selected
        let vid = document.getElementById("filterVid").classList.contains("selected");
        let img = document.getElementById("filterImg").classList.contains("selected");
        let mediaArray;
        if (vid == true) {
            mediaArray = fetchedDataSearchVideo;
            //navigation will be used when popup opened and browsed left or right
            navigation = "searchVid";
        } else if (img == true) {
            mediaArray = fetchedDataSearchImage;
            navigation = "searchImg";
        } else {
            mediaArray = fetchedDataSearch;
            navigation = "search";
        }
        data = mediaArray[selectedImage];
        len = mediaArray.length;

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
    if (len == selectedImage + 1) {
        document.getElementById("next").classList.add("notshow");
    }
    if (selectedImage == 0) {
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
        if (document.querySelector("video.popupImageCard")) {
            document.querySelector("video.popupImageCard").pause();
        }

    }
}

async function submitRating(e) {

    console.log(e);
    //check whether rating comes from top, more or search popup
    let id;
    if (e.target.classList.contains("search")) {
        id = fetchedDataSearch[selectedImage]._id;
    } else if (e.target.classList.contains("searchVid")) {
        id = fetchedDataSearchVideo[selectedImage]._id;
    } else if (e.target.classList.contains("searchImg")) {
        id = fetchedDataSearchImage[selectedImage]._id;
    } else if (e.target.classList.contains("top")) {
        id = fetchedDataTopImages[selectedImage]._id;
    } else if (e.target.classList.contains("more")) {
        id = fetchedData[selectedImage]._id;
    }

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

    }
}

function navigationPopup(e) {

    console.log(e.id);
    //check whether in top, more or search 
    let navigation;
    if (e.classList.contains("search")) {
        navigation = fetchedDataSearch;
    } else if (e.classList.contains("searchVid")) {
        navigation = fetchedDataSearchVideo;
    } else if (e.classList.contains("searchImg")) {
        navigation = fetchedDataSearchImage;
    } else if (e.classList.contains("top")) {
        navigation = fetchedDataTopImages;
    } else if (e.classList.contains("more")) {
        navigation = fetchedData;
    }
    let target = e.id;
    let el;
    let len = navigation.length;
    if (target == "previous") {
        el = navigation[selectedImage - 1];
        selectedImage--;
        //check whether upcoming image is first in array, then hide arrow left
        if (selectedImage == 0) {
            document.getElementById("previous").classList.add("notshow");
        }


        document.getElementById("next").classList.remove("notshow");
    } else if (target == "next") {

        el = navigation[selectedImage + 1];
        selectedImage++;

        //check whether first or last element in navigation, or if only item 
        if (len == selectedImage + 1 || len == 1) {
            document.getElementById("next").classList.add("notshow");
        }
        if (selectedImage == 0) {
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


function shuffleImages(e) {
    for (let i = e.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [e[i], e[j]] = [e[j], e[i]];
    }
    return e;
}


function checkId(id) {

    return topimagesId.includes(id._id) == false;
}