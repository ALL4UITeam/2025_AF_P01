<template>
  <!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>안내도 출력</title>
    <link rel="stylesheet" href="../../src/assets/scss/all.scss">
  </head>
  <body style="background:#fff;">
  <div class="integratedMap__windowPopupHeader">
    <p class="integratedMap__windowPopupTitle">지도화면 저장</p>
  </div>
  <div class="integratedMap__windowPopupMap" style="position:relative;">
    <MapEditor ref="popupMapEditor" :zoom-slider="true" @mapLoaded="fnMapLoaded" lang="ko" apikey="3B63BE88F1A06653075E0C88883B157E"/>
  </div>
  <div class="integratedMap__windowPopupContent">
    <p class="integratedMap__windowPopupSaveMapText"><span class="commonBullet">※</span> 이미지 저장 시 다소 시간이 소요될 수 있습니다.</p>
    <Textarea class="integratedMap__windowPopupTextarea" ref="descText"></Textarea>
    <div class="integratedMap__windowPopupTextareaText"><span class="commonColor01">0</span>/300</div>
    <div class="integratedMap__windowPopupSaveMapButton">
      <Button class="commonLayerPopup__button" title="출력" @click="fnPrint">출력</Button>
      <Button class="commonLayerPopup__button" title="취소" @click="fnClosePop">취소</Button>
    </div>
  </div>
  </body>
  </html>
</template>

<script setup>
import {ref} from "vue";
import html2canvas from "html2canvas";
import MapEditor from "daip-map-component";

const popupMapEditor = ref(null);
const descText = ref(null);



/**
 *  Map 정보 호출 후 실행
 */
const fnMapLoaded = () => {


}


/**
 * 출력
 */
const fnPrint = () => {

  // 인쇄
  popupMapEditor.value.getMap().once('rendercomplete', async () => {

    const mapCanvas = document.createElement('canvas');
    const size = popupMapEditor.value.getMap().getSize();
    if (size) {
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
    }
    const mapContext = mapCanvas.getContext('2d');

    // 지도 레이어의 캔버스를 순회하며 내보내기 캔버스에 그립니다.
    Array.prototype.forEach.call(
      popupMapEditor.value.getMap().getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
      function (canvas) {
        if (canvas.width > 0) {
          const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

          // 배경색이 있는 경우, 배경색을 적용합니다.
          const backgroundColor = canvas.parentNode.style.backgroundColor;
          if (backgroundColor) {
            mapContext.fillStyle = backgroundColor;
            mapContext.fillRect(0, 0, canvas.width, canvas.height);
          }

          let matrix;
          const transform = canvas.style.transform;
          if (transform) {
            // 스타일의 변환 행렬에서 변환 매개 변수를 가져옵니다.
            matrix = transform
              // eslint-disable-next-line no-useless-escape
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number);
          } else {
            matrix = [parseFloat(canvas.style.width) / canvas.width, 0, 0, parseFloat(canvas.style.height) / canvas.height, 0, 0];
          }

          // 내보내기 지도 컨텍스트에 변환을 적용합니다.
          CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
          mapContext.drawImage(canvas, 0, 0);
        }
      },
    );
    mapContext.globalAlpha = 1;




















    // const mapContext = mapCanvas.getContext('2d');

    const copyMapId = popupMapEditor.value.fnGetMapId();

    // 오버레이 추가
    document.querySelectorAll('#' + copyMapId + ' .ol-overlay-container').forEach(async (elmt) => {
      if (elmt.querySelector('.ol-tooltip.ol-tooltip-static')) {
        await html2canvas(elmt.querySelector('.ol-tooltip.ol-tooltip-static'), {
          allowTaint:true,
          // foreignObjectRendering: true,
        }).then(scaleImg => {
          const matrix = new WebKitCSSMatrix(window.getComputedStyle(elmt).transform);
          mapContext.drawImage(scaleImg, matrix.e, matrix.f);
        });
      }
    });

    // 스케일 추가 유무
    if (document.querySelector('#' + copyMapId + ' .ol-scale-line .ol-scale-line-inner')) {
      await html2canvas(document.querySelector('#' + copyMapId + ' .ol-scale-line .ol-scale-line-inner'), {
        allowTaint:true,
        // foreignObjectRendering: true,
      }).then(scaleImg => {
        mapContext.drawImage(scaleImg, 20, mapCanvas.height - 30);
      });
    }

    if (navigator.msSaveBlob) {
      // link download attribute does not work on MS browsers
      navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');
    } else {
      let dataUrl = mapCanvas.toDataURL();

      const iframe = document.createElement('iframe');

      // Make it hidden
      iframe.style.height = 0;
      iframe.style.visibility = 'hidden';
      iframe.style.width = 0;
      iframe.style.position = 'fixed';

      iframe.setAttribute('srcdoc',`
        <!DOCTYPE html>
        <html lang="ko">
          <body>
            <div style="width: 100vw;height: 99vh;text-align: center; vertical-align: middle;display:'inline-block';border:white solid 1px;">
              <div style="display:'inline-block';border:black solid 0px; ">
                <h3>안내도 출력</h3>
                <img src="${dataUrl}">
                <textarea style="width:90%;" rows="3" > ${descText.value} </textarea>
              </div>
            </div>
          </body>
        </html>
      `);

      document.body.appendChild(iframe);

      iframe.addEventListener('load', function () {
        const body = iframe.contentDocument.body;
        body.style.textAlign = 'center';
        body.style.padding = 0;
        body.style.margin = 0;

        const image = iframe.contentDocument.getElementsByTagName('img')[0];
        image.style.maxWidth = '98%'; // 100%일 경우 2장에 인쇄됨
        //image.style.maxHeight = '50%';    // 적용안됨

        iframe.contentWindow.print();
      });

      iframe.contentWindow.addEventListener('afterprint', function () {
        iframe.parentNode.removeChild(iframe);
        fnClosePop();
      });
    }
  });
  popupMapEditor.value.getMap().renderSync();
}

/**
 * 팝업 닫기
 */
const fnClosePop = () => {
  window.close();
}



</script>

<style lang="scss" src="@/assets/scss/all.scss" scoped></style>