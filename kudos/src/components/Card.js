import React from "react"
import "./Card.css"


export default function Card(props) {
  return (
    <div className="Card">
        <img src={props.image_url} className="card-image"></img>

        <div className="card-content">
            <h1 className="card-name">{props.name}</h1>
            <h2 className="card-desc">{props.desc}</h2>
            <a href={props.link_to_page}>
                <button className="card-button">Learn More</button>
            </a>
        </div>
    </div>

  )
}