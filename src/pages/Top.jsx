import React from "react"

export default function Top (){
  const embedUrl = "https://www.youtube.com/embed/0Jg8AeuPFSc"
  return (
    <div>
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  )
}