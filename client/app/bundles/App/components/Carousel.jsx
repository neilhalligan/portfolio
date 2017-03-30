import React from 'react';
import Hammer from 'hammerjs';
import ItemShowcaseMore from './ItemShowcaseMore';

export default class Carousel extends React.Component {
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      currentItem: 3,
      offsetDeg: 0
    };
    this.isDragging = false;
  }

  componentDidMount() {
    this.captureMouseWobble();
    this.captureKeys();
    this.captureDrag();
  }

  captureMouseWobble() {
    document.addEventListener('mousemove', (e) => {
      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;

      const mousePosX = e.clientX - halfWidth;
      const mousePosY = e.clientY - halfHeight;

      this.carousel.style.transform = `rotateY(${mousePosX * 0.01}deg) rotateX(${mousePosY * 0.02}deg)`;

    });
  }

  captureKeys() {
    document.addEventListener('keydown', (e) => {
      if (this.isDragging) {
        return;
      }

      if (e.key === 'ArrowLeft' && this.state.currentItem > 1) {
        this.setState({currentItem: this.state.currentItem - 1});
      } else if (e.key === 'ArrowRight' && this.state.currentItem < 5) {
        this.setState({currentItem: this.state.currentItem + 1});
      }
    });
  }

  captureDrag() {
    const hammerTime = new Hammer(this.carousel, {direction: Hammer.DIRECTION_HORIZONTAL});
    hammerTime.on('pan', (e) => {
      const dragDeg = e.deltaX * -0.05;

      if (e.isFinal) {
        setTimeout(() => {
          let newItem = this.state.currentItem;
          if (dragDeg > 5 && this.state.currentItem < 5) {
            newItem++;
          } else if (dragDeg < 5 && this.state.currentItem > 1) {
            newItem--;
          }
          this.isDragging = false;
          this.setState({
            offsetDeg: 0,
            currentItem: newItem
          });
        }, 200);
      } else {
        this.isDragging = true;
        this.setState({
          offsetDeg: dragDeg
        });
      }
    });
  }

  transitionTo(item) {
    if (this.isDragging) {
      return;
    }
    this.setState({
      currentItem: item
    });
  }

  calcTransform(item) {
    const diff = this.state.currentItem - item;
    const deg = (diff * 45) - 315 + this.state.offsetDeg;
    return {
      transform: `translateZ(840px) rotateY(315deg) rotateY(${deg}deg) translateZ(-840px)`
    };
  }

  render() {
    return(
      <div>

        <div className="mobile-display">
          <ItemShowcaseMore case_studies={this.props.case_studies} />
        </div>

        <div className="carousel-container">
          <div className="carousel" ref={(div) => this.carousel = div}>
            {
              this.props.case_studies.map((case_study, index) => {
                return (
                  <figure className="itemShowcase" key={case_study.id} style={this.calcTransform(index + 1)} onClick={(e) => this.transitionTo(index + 1)}>

                    <div className="background" style={{backgroundImage: `url('${case_study.image_url}')`}}>
                      <div className="bigLetters">
                        <h3>{case_study.title}</h3>
                        <hr/>
                        <p className="tools">
                          {case_study.technologies.split(",").slice(0,3).map(item => item.trim()).join(" · ")}
                        </p>
                      </div>
                    </div>

                  </figure>
                )
              })
            }
          </div>
        </div>

        <div className="itemOptions">
          <div className="linkButton">
            <a href={`/work/${this.props.case_studies[this.state.currentItem - 1].slug}`} className="button" target="_blank">CASE STUDY</a>
          </div>
          <div className="linkButton">
            <a href={this.props.case_studies[this.state.currentItem - 1].github_url} className="button" target="_blank">GITHUB</a>
          </div>
          <div className="linkButton">
            <a href={this.props.case_studies[this.state.currentItem - 1].site_url} className="button" target="_blank">SITE</a>
          </div>
        </div>

        <div className="instructions-container">
          <p className="instructions grey"><i>Navigate with directional arrows or by dragging projects</i></p>
        </div>

      </div>
    );
  }
}