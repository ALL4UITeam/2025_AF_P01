export default {
  /**
   * 공통 맵 서버 URL
   */
  MAP_SERVER_APIKEY : '3B63BE88F1A06653075E0C88883B157E',
  MAP_SERVER_URL : '/api/proxy/juso',
  MAP_SERVER_URL2 : '/api/proxy/kais',
  MAP_SERVER_SCHEMA : import.meta.env.VITE_MAP_PRIME_SERVER_LAYER_SCHEMA,
  /**
   * 복호화
   * @param x
   */
  decrypt : (x: any) => {
    return x / 0.3 - 333333;
  },
  /**
   * 암호화
   * @param x
   */
  encrypt : (x: any) => {
    return (x + 333333) * 0.3;
  },
}

