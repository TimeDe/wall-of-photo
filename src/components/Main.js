require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片的相关数据
let imgDatas = require('../data/imageDatas.json');

//获取区间内的一个随机数
let getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

//获取0-30°之间的一个任意正负值
let get30DegRandom = () => {
  let deg = '';
  deg = Math.random() > 0.5 ? '+' : '-';
  return deg + Math.ceil(Math.random() * 30);
};

//利用自执行函数,将图片名信息转换为图片真实路径URL信息
//ES6语法
imgDatas = imgDatas.map(x=> {
  x.imgUrl = require('../images/' + x.fileName);
  return x;
});
/*imgDatas = (function getImgUrl(imgDatasArr) {
 for(let i=0;i<imgDatasArr.length;i++){
 let singleImgData = imgDatasArr[i];

 singleImgData.imgUrl = require('../images/' + singleImgData.fileName);

 imgDatasArr[i] = singleImgData;
 }
 return imgDatasArr;
 })(imgDatas);*/

//老版本的React.createClass写法
/*let ImgFigure = React.createClass({
 render: function () {
 return(
 <figure>
 <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
 <figcaption>
 <h2>{this.props.data.title}</h2>
 </figcaption>
 </figure>
 )
 }
 });*/

//推荐使用ES6语法的class写法
/*
 *  图片管理ImgFigure组件
 */
class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  };

  /*
   * imgFigure的点击处理函数
   */
  handleClick(e) {
    //翻转和居中图片
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    var styleObj = {};

    //如果props属性中指定了这张图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //如果图片的旋转角度有值且不为0,添加旋转角度
    if (this.props.arrange.rotate) {
      (['Moz', 'ms', 'Webkit', '']).forEach((value) => {
        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      })
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

/*
 *  图片控制ControllerUnit组件
 */
class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  /*
   * imgFigure的点击处理函数
   */
  handleClick(e) {
    //翻转和居中图片
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let controllerUnitClassName = 'controller-unit';

    //如果是居中的图片,显示控制组件的居中状态
    if(this.props.arrange.isCenter){
      controllerUnitClassName += ' is-center';

      //如果还是对应的翻转状态的图片,则显示控制组件的翻转状态
      if(this.props.arrange.isInverse){
        controllerUnitClassName += ' is-inverse';
      }
    }

    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
}

class AppComponent extends React.Component {
  //设置Constant初始值,自定义常量
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      }
    };
    this.state = {
      imgsArrangeArr: [
        /* imgsArrangeArr的数据结构
         {
         pos: {
         left: '0',
         top: '0'
         },
         rotate: 0,   //旋转角度
         isInverse: false,   //图片正反面,默认正面
         isCenter: false     //图片是否居中,默认不居中
         }
         */
      ]
    };
  }

  //组件加载后,为每张图片计算其位置的范围
  componentDidMount() {

    //首先拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    /*
     *拿到一个imgFigure的大小
     * 获取到真实的DOM节点
     */
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //左右区域的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //上方区域的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    let num = Math.floor(Math.random() * 10);
    this.rearrange(num);
  }

  //反转图片的函数,采用闭包
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }
  }

  //利用rearrange函数,居中对应的图片
  center(index) {
    return () => {
      this.rearrange(index);
    }
  }

  //重新布局所有图片,指定居中排布哪个图片
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),//取一个或者不取
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);//中心图片的状态信息

    //首先居中centerIndex的图片,居中图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    //取出要布局在上方的图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上方的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    });

    //布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局在左边,后半部分在右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;//布局在左边
      } else {
        hPosRangeLORX = hPosRangeRightSecX;//布局在右边
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    }

    //将放在上方的图片状态信息重新写进数组
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }


    //将放在中间位置的图片状态信息重新写进数组
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  render() {
    let controlerUnits = [];
    let imgFigures = [];

    imgDatas.forEach((item, index) => {

      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(<ImgFigure data={item} key={index} ref={'imgFigure' + index}
                                 arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                 center={this.center(index)}/>);

      controlerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                          center={this.center(index)}/>)
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controlerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
