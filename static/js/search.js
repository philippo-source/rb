let loadedSearch = 0;
let fetchedDataSearch;

let fetchedDataSearchImage = [];
let fetchedDataSearchVideo = [];
// let selectedImage;

async function searchKeyword(e) {

    e.preventDefault();

    const url = '/api/media/keywords';
    let keyword = document.getElementById("keyword").value;

    if (keyword == "") {
        return
    }

    const data = {
        keyword: keyword
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

            fetchedDataSearch = json.data;

            //empty filter images and videos array to avoid duplicate content
            fetchedDataSearchImage = [];
            fetchedDataSearchVideo = [];

            document.querySelector(".mediacontent").innerHTML = `<section id="searchResults" class="imagesSection">
            <div class="header">
            <div id="backMain" class="filterDiv" onclick="location.reload();"><div class="arrowBack"></div><div style="align-self: center;">Back</div> </div>
            <div class="filterContainer"><div class="filterMargin filter">Filter:</div><div class="filterDiv filterMargin" onclick="showOnlyImages(this)" id="filterImg">Images</div><div class="filterDiv filterMargin" onclick="showOnlyVideos(this)" id="filterVid">Videos</div>
            </div>
            </div>
            <h2>Search results for ${keyword}</h2>
            <div class="searchContent"></section>`;

            if (fetchedDataSearch.length) {


                //load max 8 files in body for performance reasons, rest can be loaded with load more

                let len;
                let loadMore;
                if (fetchedDataSearch.length < 8) {
                    len = fetchedDataSearch.length;
                } else {
                    len = 8;
                    loadMore = true;
                }

                for (var i = 0; i < len; i++) {

                    //check whether has rating
                    let rating;
                    if (fetchedDataSearch[i].rating) {
                        rating = `Rating: ${fetchedDataSearch[i].rating.toFixed(2)}/10.00`;
                    } else {
                        rating = "not rated yet"
                    }


                    if (fetchedDataSearch[i].mediaType == "video") {
                        document.querySelector(".searchContent").innerHTML += `<div class="card" onclick="showPopup(this)" >
                   <div class="mediaContainer" onmouseenter="fetchVideoPreview(this)" onmouseleave="stopPreviewVideo(this)">
                        <img class="videoCard" alt="" src="${fetchedDataSearch[i].previewUrl}">
                    <video class="videoCard" alt="" src="" style="display:none"></video>
                    </div>
                    <div class="title">${fetchedDataSearch[i].title}</div>
                       <div class="source">${fetchedDataSearch[i].source}</div>
                       <div class="topic">${fetchedDataSearch[i].topic}</div>
                       <div class="flexSpaceBetween">
                       <div class="mediaType" >${fetchedDataSearch[i].mediaType}</div>
                       <div class="length">${fetchedDataSearch[i].length}</div>
                       </div>
                       
                      <div class="rating">${rating}</div>
                  </div>`;
                    } else if (fetchedDataSearch[i].mediaType == "image") {
                        document.querySelector(".searchContent").innerHTML += `<div class="card" onclick="showPopup(this)">
                        <div class="imageContainer">
                    <img class="imageCard" alt="" src="${fetchedDataSearch[i].contentUrl}">
                    </div>
                    <div class="title">${fetchedDataSearch[i].title}</div>
                       <div class="source">${fetchedDataSearch[i].source}</div>
                       <div class="flexSpaceBetween">
                       <div class="topic">${fetchedDataSearch[i].topic}</div>
                       </div>
                       <div class="mediaType" >${fetchedDataSearch[i].mediaType}</div>
                      <div class="rating">${rating}</div>
                  </div>`;
                    }


                }
                loadedSearch = len;
                if (loadMore == true) {
                    document.querySelector("#searchResults").innerHTML += '<div class="loadDivSearch">Load more</div>';
                    document.querySelector(".loadDivSearch").addEventListener("click", loadMoreSearch);
                }

                //Filter results for videos and images
                filterSearchForVideos();
                filterSearchForImages();

            } else {
                document.querySelector(".mediacontent").innerHTML += "There are no results for your search. Please try another one."
            }






            //     document.getElementsByTagName("main")[0].innerHTML = ""
            //     document.getElementsByTagName("main")[0].innerHTML = `<section id="searchResults" class="imagesSection">
            //     <h2>Search results for ${keyword}</h2>
            //     <div class="topContent">

            //     <div class="card" onclick="showPopup(this)">
            //             <img class="imageCard" alt="" src="https://img.liiift.io/v1/RBCP/FO-1YP4YPWAS5N11.jpg/a:h/im/reference_keyframe.jpg?ht=exp=1644451200+hmac=b73aaf68988ca20dabd8f89be4d4782a">
            //             <div class="title">Selects - Baptiste Vignes (FRA)</div>
            //                <div class="source">Red Bull Air Race World Championship 2018 Stop 2 - Cannes, France</div>
            //                <div class="flexSpaceBetween">
            //                <div class="topic">Air Racing</div>
            //                <div>02:32</div>
            //                </div>
            //               <div class="rating">Rating: 10/10</div>
            //           </div>


            // </section>`



        } else if (json.success == false) {

        }


    } catch (error) {
        console.error('Error:', error);
        //window.alert("Problem with fetching mediaType.");
    }

}

function loadMoreSearch() {
    for (var i = loadedSearch; i < loadedSearch + 8; i++) {
        if (i < fetchedDataSearch.length) {


            let imgUrl = fetchedDataSearch[i].contentUrl;
            let previewUrl = fetchedDataSearch[i].previewUrl;
            let title = fetchedDataSearch[i].title;
            let source = fetchedDataSearch[i].source;
            let topic = fetchedDataSearch[i].topic;
            let mediaType = fetchedDataSearch[i].mediaType;

            let contentTag;
            let mediaTag;

            //check whether content is img or video, previewUrl da bild und nicht video geladen werden soll wg. performance
            //unterscheidung in video oder image tag raus, da performance schlecht, videos in imgs, erst bei popup zum Anzeigen unterscheidung in video oder img
            if (fetchedDataSearch[i].mediaType == "video") {
                contentTag = `<div class="mediaContainer" onmouseenter="fetchVideoPreview(this)" onmouseleave="stopPreviewVideo(this)">
                <img class="videoCard" alt="" src="${fetchedDataSearch[i].previewUrl}">
            <video class="videoCard" alt="" src="" style="display:none"></video>
            </div>`;
                mediaTag = `<div class="flexSpaceBetween">
            <div class="mediaType" >${mediaType}</div>
            <div class="length">${fetchedDataSearch[i].length}</div>
            </div>`;

            } else if (fetchedDataSearch[i].mediaType == "image") {
                contentTag = `<div class="imageContainer"><img class="imageCard" alt="" src="${imgUrl}"></div>`;
                mediaTag = `<div class="mediaType" >${mediaType}</div>`;
            }

            //check whether has rating
            let rating;
            if (fetchedDataSearch[i].rating) {
                rating = `Rating: ${fetchedDataSearch[i].rating.toFixed(2)}/10.00`;
            } else {
                rating = "not rated yet"
            }

            document.querySelector(".searchContent").innerHTML += `<div class="card" onclick="showPopup(this)" >
       ${contentTag}
        <div class="title" >${title}</div>
           <div class="source" >${source}</div>
          <div class="topic" >${topic}</div>
          ${mediaTag}
          <div class="rating" >${rating}</div>
      </div>`;
        } else {
            document.querySelector(".loadDivSearch").style.display = "none";
        }
    }
    loadedSearch = i;
}

function fetchVideoPreview(e) {


    //get order of hovered video in array of search content
    hoveredVideo = Array.from(e.parentElement.parentElement.children).indexOf(e.parentElement);

    //check whether video filter is selected or not
    let vid = document.getElementById("filterVid").classList.contains("selected");

    //select appropriate data array
    let mediaArray;
    if (vid == true) {
        mediaArray = fetchedDataSearchVideo
    } else {
        mediaArray = fetchedDataSearch
    }

    e.children[1].src = mediaArray[hoveredVideo].contentUrl;
    e.children[1].style.display = "flex";
    e.children[0].style.display = "none";

    e.children[1].currentTime = 10;
    e.children[1].muted = true
    e.children[1].play();
}

function stopPreviewVideo(e) {

    e.children[1].pause();
}

function filterSearchForVideos() {

    fetchedDataSearch.some(e => {
        if (e.mediaType == "video") {
            fetchedDataSearchVideo.push(e)
        }
    })

}

function filterSearchForImages() {

    fetchedDataSearch.some(e => {
        if (e.mediaType == "image") {
            fetchedDataSearchImage.push(e)
        }
    });
}

function showOnlyImages(e) {
  
    document.querySelector(".searchContent").innerHTML = "";
    if (document.querySelector(".loadDivSearch")) {
        document.querySelector(".loadDivSearch").style.display = "none";
    }
    if (fetchedDataSearchImage.length) {
        fetchedDataSearchImage.forEach(i => {

            let rating;
            if (i.rating) {
                rating = `Rating: ${i.rating.toFixed(2)}/10.00`;
            } else {
                rating = "not rated yet"
            }

            document.querySelector(".searchContent").innerHTML += `<div class="card" onclick="showPopup(this)">
            <div class="imageContainer">
            <img class="imageCard" alt="" src="${i.contentUrl}">
            </div>
            <div class="title">${i.title}</div>
            <div class="source">${i.source}</div>
            <div class="flexSpaceBetween">
            <div class="topic">${i.topic}</div>
            </div>
            <div class="mediaType" >${i.mediaType}</div>
            <div class="rating">${rating}</div>
            </div>`;

        });
    } else {
        document.querySelector(".searchContent").innerHTML = "There are no images for your search";
    }
    e.classList.add("selected");
    document.querySelector("#filterVid").classList.remove("selected");
}

function showOnlyVideos(e) {
    
    document.querySelector(".searchContent").innerHTML = "";

    if (document.querySelector(".loadDivSearch")) {
        document.querySelector(".loadDivSearch").style.display = "none";
    }

    if (fetchedDataSearchVideo.length) {


        fetchedDataSearchVideo.forEach(i => {

            let rating;
            if (i.rating) {
                rating = `Rating: ${i.rating.toFixed(2)}/10.00`;
            } else {
                rating = "not rated yet"
            }


            document.querySelector(".searchContent").innerHTML += `<div class="card" onclick="showPopup(this)" >
            <div class="mediaContainer" onmouseenter="fetchVideoPreview(this)" onmouseleave="stopPreviewVideo(this)">
                <img class="videoCard" alt="" src="${i.previewUrl}">
            <video class="videoCard" alt="" src="" style="display:none"></video>
            </div>
            <div class="title">${i.title}</div>
                <div class="source">${i.source}</div>
                <div class="topic">${i.topic}</div>
                <div class="flexSpaceBetween">
                <div class="mediaType" >${i.mediaType}</div>
                <div class="length">${i.length}</div>
                </div>
                
            <div class="rating">${rating}</div>
        </div>`;
        });

    } else {
        document.querySelector(".searchContent").innerHTML = "There are no videos for your search";
    }

    e.classList.add("selected");
    document.querySelector("#filterImg").classList.remove("selected");

}

//for PWA
if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('/sw.js', { scope: '/' });
}