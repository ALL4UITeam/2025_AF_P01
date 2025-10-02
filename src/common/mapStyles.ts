import {MultiLineString, LineString, MultiPoint, Point, MultiPolygon, Polygon, Geometry} from 'ol/geom';
import { Style, Fill, Stroke, Icon, Text, Circle as CircleStyle } from 'ol/style';
import {polygon} from "@turf/turf";

export default {

  /**
   * 다바이스 위치 추적 스타일
   * @param ft
   * @param options
   */
  fnGetMyPositionStyle : (ft:any, options = {}) => {
    return [
      new Style({
        image : new CircleStyle({
          radius : 6,
          fill: new Fill({
            color: '#3399cc'
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2,
          }),
        })
      })
    ];
  },

  /**
   * 도로 구간의 스타일
   * @param ft
   * @param options
   */
  fnGetBasicStyle : (ft:any, options = {}) => {
    const styles = [
      new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.4)', //0.2)',
        }),
        stroke: new Stroke({
          color: '#F85151', //'#ffcc33',
          width: 3, //2,
        }),
        image: new Icon({
          src: (options as any).icon ?? '/src/assets/images/mapEditor/icon/ico-blue-pin.svg',
          anchor: (options as any).anchor ?? [0.5, 1],
          scale: (options as any).scale ?? 1,
        }),
      })
    ];
    return styles;
  },

  /**
   * 사물주소 스타일
   * @param ft
   * @param options
   */
  fnGetAotStyle : (ft:any, options = {}) => {
    const styles = [
      new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.4)', //0.2)',
        }),
        stroke: new Stroke({
          color: '#F85151', //'#ffcc33',
          width: 3, //2,
        }),
        image : new CircleStyle({
          radius : 5,
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.4)'
          }),
          stroke: new Stroke({
            color: '#F85151', //'#ffcc33',
            width: 3, //2,
          }),
        })
      })
    ];

    styles.push(
      new Style({
        image: new Icon({
          src: (options as any).icon ?? '/src/assets/images/mapEditor/icon/ico-blue-pin.svg',
          anchor: (options as any).anchor ?? [0.5, 1],
          scale: (options as any).scale ?? 1,
        }),
      })
    );

    return styles;
  },
  
  /**
   * 우편번호 스타일
   * @param ft
   * @param options
   */
  fnGetPostStyle : (ft:any, options = {}) => {
    const styles = [
      new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.4)', //0.2)',
        }),
        stroke: new Stroke({
          color: '#F85151', //'#ffcc33',
          width: 3, //2,
        }),
        image : new CircleStyle({
          radius : 5,
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.4)'
          }),
          stroke: new Stroke({
            color: '#F85151', //'#ffcc33',
            width: 3, //2,
          }),
        })
      })
    ];

    if(ft.getGeometry() instanceof MultiPolygon) {
      ft.getGeometry().getPolygons().forEach((polygon:any) => {
        styles.push(
            new Style({
              geometry: polygon.getInteriorPoint(),
              text: new Text({
                text: ft.get('SBDNO'),
                fill: new Fill({
                  color: '#F85151',
                }),
                font:'15px Arial, sans-serif',
              }),
            })
        );
      });
    } else {
      styles.push(
        new Style({
          geometry: ft.getGeometry().getInteriorPoint(),
          text: new Text({
            text: ft.get('SBDNO'),
            fill: new Fill({
              color: '#F85151',
            }),
            font:'15px Arial, sans-serif',
          }),
        })
      );
    }
    return styles;
  },

  /**
   * 도로 구간의 스타일
   * @param ft
   * @param options
   */
  fnGetSprdManageStyle : (ft:any, options = {}) => {
    const styles = [
      // linestring
      new Style({
        stroke: new Stroke({
          color: (options as any).strokeColor ? (options as any).strokeColor : 'rgba(0,0,0,0.2)',
          width: (options as any).strokeWidth ? (options as any).strokeWidth : 2,
        }),
      }),
    ];

    return styles;
  },

  /**
   * 도로 구간의 스타일
   * @param ft
   * @param options
   */
  fnGetSprdManageFlagStyle : (ft:any, options = {}) => {
    const styles = [
      // linestring
      new Style({
        stroke: new Stroke({
          color: (options as any).strokeColor ? (options as any).strokeColor : 'rgba(0,0,0,0.2)',
          width: (options as any).strokeWidth ? (options as any).strokeWidth : 2,
        }),
      }),
    ];

    const start = ft.getGeometry().getFirstCoordinate();
    const end = ft.getGeometry().getLastCoordinate();

    // 시작점
    styles.push(
      new Style({
        geometry: new Point(start),
        image: new Icon({
          src: '/src/assets/images/mapEditor/icon/ico-start-flag.png',
          anchor: [0, 1],
          scale: 1,
        }),
      })
    );

    // 끝점
    styles.push(
      new Style({
        geometry: new Point(end),
        image: new Icon({
          src: '/src/assets/images/mapEditor/icon/ico-end-flag.png',
          anchor: [0, 1],
          scale: 1,
        }),
      })
    );

    return styles;
  },

  /**
   * 도로 기초구간의 스타일
   * @param ft
   * @param options
   * @param resolution
   */
  fnGetSprdIntrvlStyle : (ft:any, options = {}, resolution?:any) => {
    let geometry = ft.getGeometry();

    // 멀티라인스트링인 경우
    if(geometry instanceof MultiLineString){
      ft.getGeometry().getLineStrings().forEach(geom => {
        geometry = geom;
      });
    }

    const styles = [
      // linestring
      new Style({
        stroke: new Stroke({
          color: (options as any).strokeColor ? (options as any).strokeColor : 'rgba(0,0,0,0.2)',
          width: (options as any).strokeWidth ? (options as any).strokeWidth : 2,
        }),
        fill: new Fill({
          color: (options as any).fillColor ? (options as any).fillColor : 'rgba(100,100,100,0.05)',
        }),
      }),
    ];

    const coordinates = geometry.getCoordinates();
    const start = geometry.getFirstCoordinate();
    const end = geometry.getLastCoordinate();
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const startRotation = Math.atan2((coordinates[1][1] - start[1]), (coordinates[1][0] - start[0]));
    const endRotation = Math.atan2((end[1] - coordinates[coordinates.length - 2][1]), (end[0] - coordinates[coordinates.length - 2][0]));
    const textRotation1 = Math.atan2((geometry.getCoordinateAt(0.51)[1] - geometry.getCoordinateAt(0.49)[1]), (geometry.getCoordinateAt(0.51)[0] - geometry.getCoordinateAt(0.49)[0]));
    const textRotation2 = Math.atan2((geometry.getCoordinateAt(0.49)[1] - geometry.getCoordinateAt(0.51)[1]), (geometry.getCoordinateAt(0.49)[0] - geometry.getCoordinateAt(0.51)[0]));
    const evenText = ft.get('eve_bsi_sl') !== 0 ? ft.get('eve_bsi_mn') + '-' + ft.get('eve_bsi_sl') : ft.get('eve_bsi_mn').toString();
    const oddText = ft.get('odd_bsi_sl') !== 0 ? ft.get('odd_bsi_mn') + '-' + ft.get('odd_bsi_sl') : ft.get('odd_bsi_mn').toString();

    // 간격이미지 표시
    styles.push(
        new Style({
          geometry: new Point(start),
          image: new Icon({
            src: '/src/assets/images/mapEditor/vertical-line.png',
            anchor: [0.5, 0.5],
            scale: 0.1,
            rotateWithView: true,
            rotation: -startRotation,
          }),
        })
    );

    // 짝수 세팅
    styles.push(
        new Style({
          geometry: new Point(geometry.getCoordinateAt(0.5)),
          text: new Text({
            text: resolution ? (resolution < 0.3 ? evenText : '') : evenText,
            font: 'bold 10px sans-serif',
            textAlign: 'center',
            textBaseline: Math.sign(dx) > 0 ? 'top' : 'bottom',
            fill: new Fill({
              color: 'black',
            }),
            stroke: new Stroke({
              color: 'white',
              width: 1,
            }),
            rotateWithView: true,
            rotation: Math.sign(dx) > 0 ? -textRotation1 : -textRotation2,
            offsetY : Math.sign(dx) > 0 ? 2 : -2,
          }),
        })
    );

    // 홀수 세팅
    styles.push(
        new Style({
          geometry: new Point(geometry.getCoordinateAt(0.5)),
          text: new Text({
            text: resolution ? (resolution < 0.3  ? oddText : '') : oddText,
            font: 'bold 10px sans-serif',
            textAlign: 'center',
            textBaseline: Math.sign(dx) > 0 ? 'bottom' : 'top',
            fill: new Fill({
              color: 'black',
            }),
            stroke: new Stroke({
              color: 'white',
              width: 1,
            }),
            rotateWithView: true,
            rotation: Math.sign(dx) > 0 ? -textRotation1 : -textRotation2 ,
            offsetY : Math.sign(dx) > 0 ? -2 : 2,
          }),
        })
    );
    // 멀티폴리곤인 경우
    if(ft.getGeometry() instanceof MultiPolygon || ft.getGeometry() instanceof Polygon
        || ft.getGeometry() instanceof MultiLineString || ft.getGeometry() instanceof LineString){
      styles.push(
          new Style({
            geometry: ft => {

              let geometry = ft.getGeometry();

              // 멀티라인스트링인 경우
              if(geometry instanceof MultiLineString){
                ft.getGeometry().getLineStrings().forEach(geom => {
                  geometry = geom;
                });
              }
              // 멀티포인트인 경우
              if(geometry instanceof MultiPoint){
                ft.getGeometry().getPoints().forEach(geom => {
                  geometry = geom;
                });
              }
              // 멀티폴리곤인 경우
              if(geometry instanceof MultiPolygon){
                ft.getGeometry().getPolygons().forEach(geom => {
                  geometry = geom;
                });
              }

              const coordinates = geometry.getCoordinates()[0];

              return new MultiPoint(coordinates);
            },
            image : new CircleStyle({
              radius : 2,
              fill: new Fill({
                // color: '#FF6347'
                color: 'rgba(70, 130, 180, 0.5)'
              })
            })
          }),
      );
    }
    return styles;
  },

  /**
   * 국가지점번호판 스타일
   * @param ft
   */
  fnGetNatPoiNumStyle : (ft:any) => {
    const size = ft.get('features').length;
    const styles = [];

    if (size === 1) {
      styles.push(
        new Style({
          image: new Icon({
            src: '/src/assets/images/mapEditor/icon/ico-yellow-pin.png',
            anchor: [0.5, 1],
            scale: 1,
          }),
        })
      );
    } else {
      styles.push(
        new Style({
          image: new CircleStyle({
            radius: 15,
            stroke: new Stroke({
              color: 'rgba(255, 255, 255, 0.5)',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgb(251,219,7)',
            }),
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: '#000',
            }),
            font:'15px Arial, sans-serif',
          }),
        })
      );
    }

    return styles;
  },
  
  /**
   * 국가지점번호판검색 스타일
   * @param ft
   */
  fnGetNationalPointNumStyle : (ft:any) => {
    const styles = [];

    styles.push(
      new Style({
        image: new Icon({
          src: '/src/assets/images/mapEditor/icon/ico-yellow-pin.png',
          anchor: [0.5, 1],
          scale: 1,
        }),
      })
    );

    return styles;
  },

  /**
   * 관심주소번호 스타일
   * @param ft
   */
  fnGetAddrIntrStyle : (ft:any) => {
    const styles = [];

    styles.push(
      new Style({
        image: new Icon({
          src: '/src/assets/images/mapEditor/icon/ico-sky-pin.png',
          anchor: [0.5, 1],
          scale: 1,
        }),
        text: new Text({
          text: ft.get('addrIntrNo'),
          offsetX: -1,
          offsetY: -27,
          fill: new Fill({
            color: '#ffffff',
          }),
          font:'15px Arial, sans-serif',
        }),
      })
    );

    return styles;
  },

}

