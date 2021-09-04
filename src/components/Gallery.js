import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-transitions.css';

// import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import Title from './SectionTitle';
const Loading = styled.div`
  font-size:.24rem;
  padding:.4rem .2rem;
  text-align: center;
`;
const StyledWrapper = styled.section`
  min-height: 50vh;
  width:100%;
  background-color: #fff;
  padding:.3rem 0;
  .wrapper{
      width:100%;
      padding:0;
      max-height: 80vh;
      overflow: scroll;
      .lg-react-element{
          column-count: 4;
          @media screen and (max-width: 768px) {
            column-count: 3;
            }
          column-gap: .14rem;
          .picture{
            cursor: pointer;
            max-width: 300px;
            margin: 0 auto 5px auto;
            img{
                border:2px solid #ccc;
                width:100%;
                border:5px;
            }
          }
      }
      @media screen and (max-width: 360px) {
            padding:0 .02rem;
            .lg-react-element{
                column-count: 3;
                .picture img{
                    border:none;
                }
            }
        }
    }
    .btns{
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: .1rem;
        .group{
            display: flex;
            .btn{
                border:none;
                font-size: .3rem;
                padding:.08rem .12rem;
                &:first-child{
                    border-top-left-radius: 10px;
                    border-bottom-left-radius: 10px;
                }
                &:last-child{
                    border-top-right-radius: 10px;
                    border-bottom-right-radius: 10px;
                }
                &.curr{
                    color:#fff;
                    background-color: green;
                }
            }
        }
    }
`;

const weddings = Array.from(Array(29).keys()).map((v, idx) => (`w${idx + 1}`));
const dailys = Array.from(Array(40).keys()).map((v, idx) => (`d${idx + 1}`));
const GalleryInstance = ({ popupDan, cate = "wedding", photos = [] }) => {
    const viewCount = useRef(0)
    const title = {
        wedding: '羊二与聪聪的婚纱照',
        dailys: '羊二与聪聪的日常'
    }
    const [reiniting, setReiniting] = useState(false)
    console.log({ photos });
    const onInit = (detail) => {
        console.log('lightGallery has been initialized', detail);
    };
    const handleSlideAfter = () => {
        viewCount.current = viewCount.current + 1;
        console.log(viewCount.current);
    };
    const handleLgClose = () => {
        console.log('lg close');
        if (viewCount.current >= 20) {
            popupDan("超长回忆蛋")
        }
    };
    const handleLgOpen = () => {
        viewCount.current = 0;
    };
    useEffect(() => {
        setReiniting(true)
        const inter = setTimeout(() => {
            setReiniting(false)
        }, 1000);
        return () => {
            clearTimeout(inter)
        }
    }, [photos])
    return reiniting ? <Loading>初始化...</Loading> : <LightGallery onAfterClose={handleLgClose} onAfterOpen={handleLgOpen} onAfterSlide={handleSlideAfter} mode={cate == 'wedding' ? "lg-zoom-in-big" : "lg-slide-vertical-growth"} onInit={onInit} speed={500} plugins={[lgThumbnail, lgZoom]}>
        {photos.map(photo => {
            return <div key={photo} className="picture" data-sub-html={`<h4>${title[cate]}</h4>`} data-src={`https://g-store.oss-cn-beijing.aliyuncs.com/works/wedding/${photo}.png?x-oss-process=image/resize,w_1200`}>
                <img src={`https://g-store.oss-cn-beijing.aliyuncs.com/works/wedding/${photo}.png?x-oss-process=image/resize,w_300`} />
            </div>
        })}
    </LightGallery >;
}
export default function Gallery({ popupDan }) {
    const [cate, setCate] = useState('wedding');
    const [photos, setPhotos] = useState(weddings);

    const handleCateClick = (evt) => {
        const { cate } = evt.target.dataset;
        setCate(cate);
        setPhotos(cate == 'wedding' ? weddings : dailys);
    }
    return (
        <StyledWrapper>
            <Title title="回忆·图库" />
            <div className="btns">
                <div className="group">
                    <button className={`btn ${cate == 'wedding' ? 'curr' : ""}`} data-cate='wedding' onClick={handleCateClick}>婚纱</button>
                    <button className={`btn ${cate == 'dailys' ? 'curr' : ""}`} data-cate='dailys' onClick={handleCateClick}>日常</button>
                </div>
            </div>
            <div className="wrapper">
                <GalleryInstance cate={cate} photos={photos} popupDan={popupDan} />
            </div>
        </StyledWrapper>
    )
}
