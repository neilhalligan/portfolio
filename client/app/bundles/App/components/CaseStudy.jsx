import React from 'react';
import {Fullpage, Slide, HorizontalSlider, changeFullpageSlide, changeHorizontalSlide} from 'fullpage-react';
import {TweenMax} from 'gsap';
import ItemShowcaseMore from './ItemShowcaseMore';

export default class CaseStudy extends React.Component {
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      activeSlide: 0,
      activeHorizontalSlide: 0
    };

    this.fullPageOptions = {
      onSlideChangeStart: (slider, info) => {
        if (slider === 'Fullpage') {
          this.sliderLeaving(info);
        }
      },
      onSlideChangeEnd: (slider, info) => {
        if (slider === 'Fullpage') {
          this.sliderAppearing(info);
        } else if (slider === 'code-highlights') {
          this.horizontalChange(info);
        }
      },
      hideScrollBars: true
    };
  }

  componentDidMount() {
    this.captureKeys();
    this.props.code_highlights.forEach((highlight) => {
      const image = new Image();
      image.src = highlight.image_url;
    });
  }

  sliderLeaving = (info) => {
    if (info.activeSlide === 1 || info.activeSlide === 3) {
      TweenMax.fromTo(`.slide${info.activeSlide} .overlay`, 0.25,
        {backgroundColor: 'rgba(0, 0, 0, 0.6)'},
        {backgroundColor: 'rgba(0, 0, 0, 0.0)', delay: 0.2});

      TweenMax.fromTo(`.slide${info.activeSlide} .info`, 0.25,
        {x: 0, color: '#FFFFFF', opacity: 1, delay: 0.2},
        {x: '100vw', color: '#E91E63', opacity: 0});
    }
  }

  sliderAppearing = (info) => {
    this.setState({
      activeSlide: info.activeSlide
    });

    if (info.activeSlide === 1 || info.activeSlide === 3) {
      const afterOverlay = () => {
        // document.querySelector('.slide1 .border').classList.add('active');
        TweenMax.fromTo(`.slide${info.activeSlide} .info`, 0.5,
          {x: '100vw', color: '#E91E63', opacity: 0},
          {x: 0, color: '#FFFFFF', opacity: 1, delay: 0.2});
      };

      TweenMax.fromTo(`.slide${info.activeSlide} .overlay`, 0.5,
        {backgroundColor: 'rgba(0, 0, 0, 0.0)'},
        {backgroundColor: 'rgba(0, 0, 0, 0.6)', delay: 0.2, onComplete: afterOverlay});
    }
  }

  horizontalChange = (info) => {
    this.setState({
      activeHorizontalSlide: info.activeSlide
    });
  }

  captureKeys() {
    document.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowLeft') {
        if (this.state.activeHorizontalSlide > 0) {
          changeHorizontalSlide('code-highlights', 'PREV');
        }
      } else if (e.key === 'ArrowRight') {
        if (this.state.activeHorizontalSlide < this.props.code_highlights.length - 1) {
          changeHorizontalSlide('code-highlights', 'NEXT');
        }
      } else if (e.key === 'ArrowUp') {
        changeFullpageSlide('PREV');
      } else if (e.key === 'ArrowDown') {
        changeFullpageSlide('NEXT');
      }
    });
  }

  renderNav() {
    return (
      <div className="fullpage-nav">
        {
          [0, 1, 2, 3, 4].map((page) => {
            return (
              <div
                key={page}
                className={this.state.activeSlide === page ? 'nav-droplet active' : 'nav-droplet'} onClick={(e) => changeFullpageSlide(page)} ></div>
            )
          })
        }
      </div>
    )
  }

  renderNextCode() {
    if (this.state.activeHorizontalSlide < this.props.code_highlights.length - 1) {
      return (
        <span className="arrow" alt="next arrow" onClick={() => changeHorizontalSlide('code-highlights', 'NEXT')}>NEXT</span>
      )
    }
  }

  renderCodeHighlights() {
    return this.props.code_highlights.map((code_highlight) => {
      return (
        <Slide key={code_highlight.id}>
          <div
            className="img-background"
            style={{backgroundImage:`url('${code_highlight.image_url}')`}}>
            <div className="info code-highlight">
              <p className="highlight-content">{code_highlight.caption}</p>
            </div>
          </div>
        </Slide>
      )
    });
  }

  render() {
    const {case_study, more_case_studies} = this.props;

    return (
      <div className="case-study">
        <Fullpage {...this.fullPageOptions}>

          {this.renderNav()}
          {this.state.activeSlide === 2 ? this.renderNextCode() : null}

          <Slide className='slide0'>
            <div className="fullscreen-video">
              <video src={case_study.video_url} autoPlay loop muted></video>
            </div>

            <div className="img-background">
              <span className="case-study-name">
                <h1 className="case-study-heading">{case_study.title}</h1>
                <div className="technologies">
                  {
                    case_study.technologies.split(',').map((tech) => tech.trim()).join(' · ')
                  }
                </div>
                <div className="itemOptions case-study-button">
                  <div className="linkButton caseStudy">
                    <a href={case_study.site_url} className="button" target="_blank">SITE</a>
                  </div>
                </div>
              </span>

              <div className="scroll-down">
                <div className="mouse">
                  <div className="scroller"></div>
                </div>
                <p className="scroll-text">Scroll</p>
              </div>
            </div>

          </Slide>

          <Slide className='slide1'>
            <div
              className="img-background"
              style={{backgroundImage:`url('${case_study.description_image_url}')`}}
            >
              <div className="overlay"></div>
              <div className="info">
                <p className="module-content">{case_study.description}</p>
              </div>
            </div>
          </Slide>

          <HorizontalSlider className='slide2' name="code-highlights" infinite={false}>
            {
              this.renderCodeHighlights()
            }
          </HorizontalSlider>

          <Slide className='slide3'>
            <div
              className="img-background"
              style={{backgroundImage:`url('${case_study.challenges_image_url}')`}}>
              <div className="overlay"></div>
              <div className="info">
                <p className="module-content">{case_study.challenges}</p>
              </div>
            </div>
          </Slide>

          <Slide className='slide4'>
            <ItemShowcaseMore case_studies={this.props.more_case_studies} />
          </Slide>
        </Fullpage>
      </div>
    )
  }
}
