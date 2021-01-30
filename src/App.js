import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Group, Image } from 'react-konva';
import useImage from "use-image"
import styled from "styled-components"

import TransformersWrap from "./components/TransformerWrap"

const Wrap = styled.div`
  width: 98vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #efefef;
`

const Div = styled.div`
  width: 900px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Main = styled.main`
  height: 600px;
  width: 600px;
  background: #ffffff;
  box-shadow: inset 2px 2px 2px rgba(255, 255, 255, .075),
              inset 2px 2px 4px rgba(0, 0, 0, .15),
              inset 2px 2px 2px rgba(255, 255, 255, .075),
              inset 2px 2px 4px rgba(0, 0, 0, .15);
`

const Button = styled.button`
  padding: 1.5em 5em;
  margin-top: 20px;
  margin-bottom: 20px;
  background: #fefefe;
  border: none;
  border-radius: .5rem;
  color: #444;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: .2rem;
  text-align: center;
  outline: none;
  cursor: pointer;
  transition: .2s ease-in-out;
  box-shadow: -6px -6px 14px rgba(255, 255, 255, .7),
              -6px -6px 10px rgba(255, 255, 255, .5),
              6px 6px 8px rgba(255, 255, 255, .075),
              6px 6px 10px rgba(0, 0, 0, .15);

  &:hover {
    box-shadow: -2px -2px 6px rgba(255, 255, 255, .6),
              -2px -2px 4px rgba(255, 255, 255, .4),
              2px 2px 2px rgba(255, 255, 255, .05),
              2px 2px 4px rgba(0, 0, 0, .1);
  }

  &:active {
    box-shadow: inset -2px -2px 6px rgba(255, 255, 255, .7),
                inset -2px -2px 4px rgba(255, 255, 255, .5),
                inset 2px 2px 2px rgba(255, 255, 255, .075),
                inset 2px 2px 4px rgba(0, 0, 0, .15);
  }
`

const H1 = styled.h1`
  padding: 0.5em;
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: .2rem;
  text-align: center;
  text-shadow:0 1px 0 #888, 0 2px 0 #888, 0 2px 3px #333;
`

const Article = styled.article`
  width: 600px;
  display: flex;
  justify-content: space-between;
`

const App = () => {
  const [bgImage, setBgImage] = useState('')
  const [onImage, setOnImage] = useState('')
  const [bgClick, changeBgClick] = useState(false)
  const [onClick, changeOnClick] = useState(false)
  const bgImageRef = useRef(null)
  const onImageRef = useRef(null)
  const [image] = useImage(onImage)
  const [dragImage] = useImage(bgImage)
  const [selectedShapeName, setSelectedShapeName] = useState("")
  const stageRef = useRef()

  useEffect(() => {
    if (bgImageRef.current) {
      bgImageRef.current.click()
    }
  }, [bgClick])

  useEffect(() => {
    if (onImageRef.current) {
      onImageRef.current.click()
    }
  }, [onClick])

  const handleBgClick = () => {
    bgClick ? changeBgClick(false) : changeBgClick(true)
  }

  const handleOnClick = () => {
    onClick ? changeOnClick(false) : changeOnClick(true)
  }

  const handleSetBgImage = (event) => {
    const file = event.target?.files?.item(0)
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (reader.result) {
          setBgImage(reader.result)
        }
        return 0
      }
    }
    return 0
  }

  const handleSetOnImage = (event) => {
    const file = event.target?.files?.item(0)
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (reader.result) {
          setOnImage(reader.result)
        }
        return
      }
    }
    return
  }

  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedShapeName("")
      return;
    }

    const clickedOnTransformer = e.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      return;
    }

    const name = e.target.name();
    if (name) {
      setSelectedShapeName(name)
    } else {
      setSelectedShapeName("")
    }
  };

  return (
    <Wrap>
      <Div>
        <header><H1>Code for Graduate chord003</H1></header>
        <Article>
          <div>
            <input
              onChange={handleSetBgImage}
              ref={bgImageRef}
              style={{ display: 'none' }}
              type={'file'}
            />
            <Button onClick={handleBgClick}>かぶせる画像</Button>
          </div>

          <div>
            <input
              onChange={handleSetOnImage}
              ref={onImageRef}
              style={{ display: 'none' }}
              type={'file'}
            />
            <Button onClick={handleOnClick}>元となる画像</Button>
          </div>
        </Article>
        <Main>
          <Stage
            width={600}
            height={600}
            onMouseDown={handleStageMouseDown}
            ref={stageRef}
          >
            <Layer>
              <Image image={image} draggable />
              <Group
                name="group"
                x={225}
                y={295}
                width={200}
                height={200}
                fill="red"
                draggable
              >
                <Image
                  name="image"
                  image={dragImage}
                  padding={15}
                  align="center"
                />
              </Group>
              <TransformersWrap
                selectedShapeName={selectedShapeName}
              />
            </Layer>
          </Stage>
        </Main>
        <Button
          id="save"
          onClick={() => {
            downloadURI(
              stageRef.current
                .getStage()
                .toDataURL({ mimeType: "image/png", quality: 1.0 }),
              "export_" + formatDate(new Date(), "yyyyMMddHHmmssSSS") + ".png"
            );
          }}
        >
          保存
        </Button>
      </Div>
    </Wrap>
  );
};

export default App

function downloadURI(uri, imageName) {
  const link = document.createElement("a");
  link.download = imageName;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function formatDate(date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ("0" + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ("0" + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ("0" + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ("0" + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ("00" + date.getMilliseconds()).slice(-3));
  return format;
}
