import React, { Component } from 'react'
import './ArticleExcellentThirty.scss'
export default class ArticleExcellentThirty extends Component {
  render() {
    return (
      <div className='article-excellent-thirty-container'>
				<div className='headImg'>30日精选文章</div>
				<div className='article-wrapper'>
					{/* <OpinionMainCenterList
						key={v.createAt}
						title={v.title}
						category={ArticleCategory[v.category]}
						see={v.viewnum}
						author={v.authorUsername}
						time={v.createAt}
						tag={type}
						coverImg={`/cover-img/${v.coverImg}`}
						articleId={v.id}
					/> */}
				</div>
			</div>
    )
  }
}
