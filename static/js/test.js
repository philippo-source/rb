var video= document.getElementById("myVideo");
var repeat;
//eventlister 1
video.addEventListener("mouseenter", function( event ) {
      video.currentTime=40;
video.muted = true
      video.play();
      console.log(video.currentTime);

 repeat = setInterval(function(){ console.log("repeat video");video.currentTime=40;video.play()}, 5000);
}, false);

//hover out
video.addEventListener("mouseleave", function(e){
console.log("pause video");
console.log(e);
video.pause();
clearInterval(repeat);
});

//hover over video
document.querySelectorAll(".videoCard").forEach(item => item.addEventListener("mouseenter", function(e) {
    console.log(e);
      this.currentTime=40;
      this.muted = true
      this.play();
      console.log(this.currentTime);


})

);

//hover out video
document.querySelectorAll(".videoCard").forEach(item => item.addEventListener("mouseleave", function(e) {
    console.log("pause video");
    console.log(e);
    this.pause();
    clearInterval(repeat);
    }));