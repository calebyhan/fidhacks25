import React from 'react'
import "./Resources.css"
import Card from "./Card"


import harvard from "./assets/harvard.png"
import overcome from "./assets/new.png"
import smart from "./assets/women.png"
import npr from "./assets/npr.png"
import berrett from "./assets/berrett.png"
import indeed from "./assets/indeed.png"

function Resources() {
  return (
    <div className="res-container">
      <div className='hi'>
          <h2 className='main'>Resources</h2>
          <div className="underline"></div>
          

          <div className="res">
              <Card name="Breaking Through the Self-Doubt" desc= "Harvard Business Review" image_url={harvard} link_to_page="https://www.library.hbs.edu/working-knowledge/breaking-through-the-self-doubt-that-keeps-talented-women-from-leading"/>
              <Card name="Top 10 Ways to Overcome Application Hesitation" desc= "American Academy of Neurology" image_url={overcome} link_to_page="https://careers.aan.com/article/https-bit-ly-3y8k9qj-"/>
              <Card name="Top Resources for Women in the Workplace" desc= "SmartBug Media" image_url={smart} link_to_page="https://www.smartbugmedia.com/blog/women-in-the-workplace"/>
              <Card name="Ask For A Raise? Most Women Hesitate" desc= "NPR" image_url={npr} link_to_page="https://www.npr.org/2011/02/14/133599768/ask-for-a-raise-most-women-hesitate"/>
              <Card name="6 Books to Empower Women in the Workplace" desc= "Berrett-Koehler Publishers" image_url={berrett} link_to_page="https://ideas.bkconnection.com/6-books-to-empower-women-in-the-workplace-and-beyond"/>
              <Card name="18 Tips for Reducing Job Searching Anxiety" desc= "Indeed" image_url={indeed} link_to_page="https://www.indeed.com/career-advice/finding-a-job/job-searching-anxiety"/>

          </div>
      </div>
    </div>
  )
}

export default Resources