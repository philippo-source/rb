# Case Study: Content Browser plus Rating
We ask you to develop a small web application which allows a user to browse content and allows the user to provide a rating for a given piece of content (either image or video).

## Goal
Our goal is to verify your technical skills but also engage you into a discussion about the overall solution design and solution approach.

## User Stories
* As a user I want to browse the available media content.
* As a user I want to playback videos within the web-browser.
* As a user I want to rate available media content.
* As a user I want to see the top-10 rated videos and images.
* As a user I want to use the web application on any web capable device, e.g. desktop, mobile, tablet.

## Non Functional Requirements
* Make the application public available

## Hints
* Think MVP! Make sure to have a working solution to demonstrate.
* Avoid over engineering. We are fans of simple solutions which are easy to maintain.
* You may use [cloudinary](https://cloudinary.com/documentation/image_transformations) image transformations on the images if you consider this useful, they need to be placed after /im for example *../im:i:w_100/..* scales an image to 100px width
* We are available to help you if you're stuck. Asking is not a sign of weakness!
* Red Bull gives wings to people and ideas - be creative and try to surprise us!

## Input Data
The provided `content.json` file provides you with a catalog of videos and images available for you to use
The JSON structure is as follows:

```json
{
  "id": "AP-1WNURWKG91W11",
  "mediaType": "image",
  "source": "sneak_All HAnds_sample SI_5.jpg",
  "title": "sneak_All HAnds_sample SI_5.jpg",
  "contentUrl": "https://img.liiift.io/v1/RBCP/FO-1WNURY9EW5N11.jpg/a:h/im/image_proxy_large.jpg?ht=exp=1644451200+hmac=7774afaff37de6ad9c90d542360e1ed7",
  "previewUrl": "https://img.liiift.io/v1/RBCP/FO-1WNURY8X95N11.jpg/a:h/im/image_proxy_thumb.jpg?ht=exp=1644451200+hmac=dd1cac58c66590824088efcf81a05412"
},
{
  "id": "1329469994648-1100505131",
  "mediaType": "video",
  "source": "Red Bull Flugtag 2011 Moscow, Russia",
  "title": "News Cut",
  "description": "More than 100 000 people gathered on the bank of Mosva-river on August 7th to watch 39 extravagant teams, performing on 6 meter ramp before the flight on their self-made flying machines. It is one of the biggest events ever happened in Moscow. The longest flight was 19 meters from the team \u2018Illusion of the Flight\u2019. The most spectacular flight was from Rostov Rak Team, they won the 1st place.<br />",
  "length": "00:08:54",
  "aspectRatio": "16:9",
  "topic": "Flugtag",
  "contentUrl": "https://cs.liiift.io/v1/RBCP/pd/1/E7/63/TZ/EW/25/11/FO-1E763TZEW2511.mp4/a:h/proxy_hd_720.mp4?ht=exp=1644451200+hmac=72b06326206b07a854164ed9f1bb016e",
  "previewUrl": "https://img.liiift.io/v1/RBCP/FO-1YQG7HD3S5N11.jpg/a:h/im/reference_keyframe.jpg?ht=exp=1644451200+hmac=6538555f8575c6d328fcd71e8067421f"
}
```

The following fields are provided:
* `id`: unique identifier
* `mediaType`: whether the piece of content is of type image or video
* `title`: descriptive title of the piece of contentUrl (if properly managed)
* `description`: some content description (might include some HTML tags!)
* `source`: descriptive information about the event or athlete (if properly managed)
* `contentUrl`: resource location to the actual content piece
* `previewUrl`: thumbnail or reference keyframe depending on `mediaType`
