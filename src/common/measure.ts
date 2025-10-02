import Draw from 'ol/interaction/Draw';
import Overlay from 'ol/Overlay';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { LineString, Polygon, Circle } from 'ol/geom';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { getArea, getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import { default as DragPan } from 'ol/interaction/DragPan.js';
import type {Feature} from "ol";

export default class {

  #mSource = null;
  #mVector = null;
  #mMap = null;
  #mDraw = null; // global so we can remove it later
  #mMeasureCnt = 0;

  /**
   * Currently drawn feature.
   * @type {import("../src/ol/Feature.js").default}
   */
  #mSketch = null;

  /**
   * The help tooltip element.
   * @type {HTMLElement}
   */
  #mHelpTooltipElement = null;

  /**
   * Overlay to show the help messages.
   * @type {Overlay}
   */
  #mHelpTooltip = null;
  // helpTooltipArray = [];

  /**
   * The measure tooltip element.
   * @type {HTMLElement}
   */
  #mMeasureTooltipElement = null;

  /**
   * Overlay to show the measurement.
   * @type {Overlay}
   */
  #mMeasureTooltip = null;

  #mMeasureTooltipArray = [];

  /**
   * Message to show when the user is drawing a polygon.
   * @type {string}
   */
  #mContinuePolygonMsg = '마우스를 더블클릭하여 종료합니다.'; // 'Click to continue drawing the polygon';

  /**
   * Message to show when the user is drawing a line.
   * @type {string}
   */
  #mContinueLineMsg = '마우스를 더블클릭하여 종료합니다.'; // 'Click to continue drawing the line';

  /**
   * Message to show when the user is drawing a line.
   * @type {string}
   */
  #mContinueRadiusMsg = '마우스를 클릭하여 종료합니다.';

  #mMapMouseOutEventKey = null;

  #keydownHandler = (evt:any) => {
    if (evt.code == 'Escape') {
      this.removeInteraction();
    }
  };

  /**
   *
   * @param {CMap} pMap
   */
  init = (pMap) => {
    this.reset(pMap);

    this.#mMap = pMap.getMap();
    this.#mSource = new VectorSource();
    this.#mVector = new VectorLayer({
      source: this.#mSource,
      layerName: 'measureLayer',
      zIndex: 10002,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.4)', //0.2)',
        }),
        stroke: new Stroke({
          color: '#F85151', //'#ffcc33',
          width: 3, //2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#F85151', //'#ffcc33',
          }),
        }),
      }),
    });

    this.#mMap.addLayer(this.#mVector);

    //pMap.removeMapEvent($MapEvent.POINTERMOVE, this, this.#pointerMoveHandler);
    pMap.addMapEvent('pointermove', this, this.#pointerMoveHandler);

    this.#mMapMouseOutEventKey = this.#mMap
    .getViewport()
    .addEventListener('mouseout', function () {
      // console.log('mouseout-2');
      if (this.helpTooltipElement != undefined) {
        this.helpTooltipElement.classList.add('hidden');
      }
    });

    window.addEventListener('keydown', this.#keydownHandler);
  };

  /**
   *
   * @param {CMap} pMap
   */
  reset = (pMap:any) => {
    window.removeEventListener('keydown', this.#keydownHandler);

    if (pMap != undefined) {
      // pMap의 이벤트는 외부(pMap)에서 reset될 수 있다.
      pMap.removeMapEvent('pointermove', this, this.#pointerMoveHandler);
    }

    unByKey(this.#mMapMouseOutEventKey);

    this.#mSource = null;
    this.#mVector = null;
    this.#mMap = null;
    this.#mDraw = null;
    this.#mSketch = null;
    this.#mHelpTooltipElement = null;
    this.#mHelpTooltip = null;
    this.#mMeasureTooltipElement = null;
    this.#mMeasureTooltip = null;
    this.#mMeasureTooltipArray = [];
    this.#mContinuePolygonMsg = '마우스를 더블클릭하여 종료합니다.';
    this.#mContinueLineMsg = '마우스를 더블클릭하여 종료합니다.';
    this.#mContinueRadiusMsg = '마우스를 클릭하여 종료합니다.';
    this.#mMapMouseOutEventKey = null;
  };


  start = (pType:String) => {
    this.addInteraction(pType);
    this.deactiveDragPanInteraction();
  };
  stop = (pDrawEnd:Draw) => {
    this.removeInteraction(pDrawEnd);
    this.activeDragPanInteraction();
  };
  clear = () => {
    this.destroyHelpTooltip();
    this.destroyMeasureTooltip(true);

    if (this.#mSource != undefined) {
      this.#mSource.clear();
    }
  };

  /**
   * Format length output.
   * @param {LineString} line The line.
   * @return {string} The formatted length.
   */
  formatLength = (line:LineString) => {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' km';
    } else {
      output = Math.round(length * 100) / 100 + ' m';
    }
    return output;
  };

  formatRadius = (circle:Circle) => {
    const length = circle.getRadius();
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' km';
    } else {
      output = Math.round(length * 100) / 100 + ' m';
    }
    return output;
  };

  /**
   * Format area output.
   * @param {Polygon} polygon The polygon.
   * @return {string} Formatted area.
   */
  formatArea = (polygon:Polygon) => {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
      output =
          Math.round((area / 1000000) * 100) / 100 + ' km<sup>2</sup>';
    } else {
      output = Math.round(area * 100) / 100 + ' m<sup>2</sup>';
    }
    return output;
  };

  addInteraction = (pType:String) => {
    let type = 'LineString';
    switch (pType) {
      case 'Polygon':
        type = 'Polygon';
        break;
      case 'LineString':
        type = 'LineString';
        break;
      case 'Circle':
        type = 'Circle';
        break;
    }

    if (this.#mDraw != undefined) {
      if (this.#mDraw.type_ != type) {
        this.#mMap.removeInteraction(this.#mDraw);
      } else {
        return;
      }
    }

    this.#mDraw = new Draw({
      type: type,
      source: this.#mSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2,
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
        }),
      }),
    });
    this.#mMap.addInteraction(this.#mDraw);

    this.createMeasureTooltip(type);
    this.createHelpTooltip();

    const me = this;
    let listener;
    this.#mDraw.on('drawstart', function (evt) {
      // set sketch
      me.#mSketch = evt.feature;

      let tooltipCoord = evt.coordinate;

      listener = me.#mSketch.getGeometry().on('change', function (evt) {
        const geom = evt.target;
        let output;
        if (geom instanceof Polygon) {
          output = me.formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof Circle) {
          output = me.formatRadius(geom);
          tooltipCoord = geom.getFirstCoordinate();
        } else if (geom instanceof LineString) {
          output = me.formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        me.#mMeasureTooltipElement.innerHTML = output;
        me.#mMeasureTooltip.setPosition(tooltipCoord);
      });
    });

    this.#mDraw.on('drawend', function () {
      me.#mMeasureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
      me.#mMeasureTooltip.setOffset([0, type === 'LineString' ? -10 : 12]);

      const img = document.createElement('img');
      img.src = '/src/assets/images/common/x-circle-fill.svg';
      img.style.cssText = 'padding-left:5px;padding-top:2px;cursor:pointer;';
      const deleteId = me.#mMeasureTooltip.getId();
      img.addEventListener('click', ()=> {
        me.deleteMeasureTooltip(deleteId);
      });
      me.#mMeasureTooltipElement.append(img);
      me.#mSketch.setId(me.#mMeasureTooltip.getId());

      // unset sketch
      me.#mSketch = null;
      // unset tooltip so that a new one can be created
      me.#mMeasureTooltipElement = null;
      // me.createMeasureTooltip();
      unByKey(listener);

      me.stop(true);
    });
  };
  // pDrawEnd: 그리기가 종료됐는지 여부
  removeInteraction = (pDrawEnd:Draw) => {
    this.destroyHelpTooltip();
    if (pDrawEnd == undefined && !pDrawEnd) {
      this.destroyMeasureTooltip();
    }

    this.#mMap.removeInteraction(this.#mDraw);
    this.#mDraw = null;
  };

  /**
   * Creates a new help tooltip
   */
  createHelpTooltip = () => {
    if (this.#mHelpTooltipElement) {
      this.#mHelpTooltipElement.parentNode.removeChild(
          this.#mHelpTooltipElement,
      );
    }
    this.#mHelpTooltipElement = document.createElement('div');
    this.#mHelpTooltipElement.className = 'ol-tooltip hidden';
    this.#mHelpTooltip = new Overlay({
      element: this.#mHelpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left',
    });
    this.#mMap.addOverlay(this.#mHelpTooltip);
    // this.helpTooltipArray.push(this.helpTooltip);
  };
  destroyHelpTooltip = () => {
    // for (var i = 0; i < this.helpTooltipArray.length; i++) {
    //   this.map.removeOverlay(this.helpTooltipArray[i]);
    // }
    // this.helpTooltipArray = [];
    this.#mMap.removeOverlay(this.#mHelpTooltip);

    this.#mHelpTooltip = null;
    this.#mHelpTooltipElement = null;
  };

  /**
   * Creates a new measure tooltip
   */
  createMeasureTooltip = (type:String) => {
    if (this.#mMeasureTooltipElement) {
      this.#mMeasureTooltipElement.parentNode.removeChild(
          this.#mMeasureTooltipElement,
      );
    }
    this.#mMeasureTooltipElement = document.createElement('div');
    this.#mMeasureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    this.#mMeasureTooltip = new Overlay({
      element: this.#mMeasureTooltipElement,
      offset: [0, type === 'LineString' ? -10 : 12],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false,
      zIndex: 10002,
      id: 'measureFeatureAndOverlay_' + this.#mMeasureCnt++
    });
    this.#mMap.addOverlay(this.#mMeasureTooltip);
    this.#mMeasureTooltipArray.push(this.#mMeasureTooltip);
  };

  // 단건 삭제
  deleteMeasureTooltip = (id:String) => {
    if (id) {
      this.#mMeasureTooltipArray.some((ovly:Overlay) => {
        if (ovly.getId() === id) {
          this.#mMap.removeOverlay(ovly);
          return true;
        }
      });
      this.#mSource.getFeatures().some((ft:Feature) => {
        if (ft.getId() === id) {
          this.#mSource.removeFeature(ft);
          return true;
        }
      });
    }
  };

  // 전체 삭제
  destroyMeasureTooltip = (pAll:boolean) => {
    if (pAll != undefined && pAll) {
      for (let i = 0; i < this.#mMeasureTooltipArray.length; i++) {
        this.#mMap.removeOverlay(this.#mMeasureTooltipArray[i]);
      }
      this.#mMeasureTooltipArray = [];
    }

    if (this.#mMeasureTooltip != undefined) {
      this.#mMap.removeOverlay(this.#mMeasureTooltip);
    }
    this.#mMeasureTooltip = null;
    this.#mMeasureTooltipElement = null;
  };

  // 마우스로 지도 이동 활성화
  activeDragPanInteraction = () => {
    // find DragPan interaction
    this.#mMap.getInteractions().getArray().forEach((interaction) => {
      if (interaction instanceof DragPan) {
        interaction.setActive(true);
      }
    });

  };

  // 마우스로 지도 이동 비활성화
  deactiveDragPanInteraction = () => {
    // find DragPan interaction
    this.#mMap.getInteractions().getArray().forEach((interaction) => {
      if (interaction instanceof DragPan) {
        interaction.setActive(false);
      }
    });
  };

  /**
   * Handle pointer move.
   * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
   */
  #pointerMoveHandler = (evt:any) => {
    //console.log('pointerMoveHandler');

    if (evt.dragging) {
      return;
    }
    /** @type {string} */
    let helpMsg = '마우스를 클릭하여 시작합니다.'; //'Click to start drawing';

    if (this.#mSketch) {
      const geom = this.#mSketch.getGeometry();
      if (geom instanceof Polygon) {
        helpMsg = this.#mContinuePolygonMsg;
      } else if (geom instanceof Circle) {
        helpMsg = this.#mContinueRadiusMsg;
      } else if (geom instanceof LineString) {
        helpMsg = this.#mContinueLineMsg;
      }
    }

    if (this.#mHelpTooltipElement != undefined) {
      this.#mHelpTooltipElement.innerHTML = helpMsg;
    }
    if (this.#mHelpTooltip != undefined) {
      this.#mHelpTooltip.setPosition(evt.coordinate);
    }

    if (this.#mHelpTooltipElement != undefined) {
      this.#mHelpTooltipElement.classList.remove('hidden');
    }
  };
}