/**
 *  判断经纬度是否超出中国境内
 */
export const isLocationOutOfChina = (latitude: number, longitude: number) => {
  if (longitude < 72.004 || longitude > 137.8347 || latitude < 0.8293 || latitude > 55.8271) {
    return true
  }
  return false
}

export const isContains = (point: any, p1: any, p2: any) => {
  return (
    point.latitude >= Math.min(p1.latitude, p2.latitude) &&
    point.latitude <= Math.max(p1.latitude, p2.latitude) &&
    point.longitude >= Math.min(p1.longitude, p2.longitude) &&
    point.longitude <= Math.max(p1.longitude, p2.longitude)
  )
}

export const transformLatWithXY = (x: number, y: number) => {
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  const pi = 3.14159265358979324
  let lat = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  lat += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0
  lat += ((20.0 * Math.sin(y * pi) + 40.0 * Math.sin((y / 3.0) * pi)) * 2.0) / 3.0
  lat += ((160.0 * Math.sin((y / 12.0) * pi) + 320 * Math.sin((y * pi) / 30.0)) * 2.0) / 3.0
  return lat
}

export const transformLonWithXY = (x: number, y: number) => {
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  const pi = 3.14159265358979324
  let lon = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  lon += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0
  lon += ((20.0 * Math.sin(x * pi) + 40.0 * Math.sin((x / 3.0) * pi)) * 2.0) / 3.0
  lon += ((150.0 * Math.sin((x / 12.0) * pi) + 300.0 * Math.sin((x / 30.0) * pi)) * 2.0) / 3.0
  return lon
}

/**
 *  将WGS-84(国际标准)转为GCJ-02(火星坐标)
 */
export const transformFromWGSToGCJ = (longitude: number, latitude: number) => {
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  const ee = 0.00669342162296594323
  const a = 6378245.0
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  const pi = 3.14159265358979324

  if (!isLocationOutOfChina(longitude, latitude)) {
    let adjustLat = transformLatWithXY(longitude - 105.0, latitude - 35.0)
    let adjustLon = transformLonWithXY(longitude - 105.0, latitude - 35.0)
    const radLat = (latitude / 180.0) * pi
    let magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    const sqrtMagic = Math.sqrt(magic)
    adjustLat = (adjustLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * pi)
    adjustLon = (adjustLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi)
    latitude = latitude + adjustLat
    longitude = longitude + adjustLon
  }
  return { longitude: longitude, latitude: latitude }
}

/**
 *  将GCJ-02(火星坐标)转为WGS-84
 */
export const transformFromGCJToWGS = (longitude: number, latitude: number) => {
  const threshold = 0.00001

  // The boundary
  let minLng = longitude - 0.5
  let maxLng = longitude + 0.5
  let minLat = latitude - 0.5
  let maxLat = latitude + 0.5

  let delta = 1
  let maxIteration = 30

  while (true) {
    const leftBottom = transformFromWGSToGCJ(minLat, minLng)
    const rightBottom = transformFromWGSToGCJ(minLat, maxLng)
    const leftUp = transformFromWGSToGCJ(maxLat, minLng)
    const midPoint = transformFromWGSToGCJ((minLat + maxLat) / 2, (minLng + maxLng) / 2)
    delta = Math.abs(midPoint.latitude - latitude) + Math.abs(midPoint.longitude - longitude)

    if (maxIteration-- <= 0 || delta <= threshold) {
      return { longitude: (minLng + maxLng) / 2, latitude: (minLat + maxLat) / 2 }
    }

    if (isContains({ latitude: latitude, longitude: longitude }, leftBottom, midPoint)) {
      maxLat = (minLat + maxLat) / 2
      maxLng = (minLng + maxLng) / 2
    } else if (isContains({ latitude: latitude, longitude: longitude }, rightBottom, midPoint)) {
      maxLat = (minLat + maxLat) / 2
      minLng = (minLng + maxLng) / 2
    } else if (isContains({ latitude: latitude, longitude: longitude }, leftUp, midPoint)) {
      minLat = (minLat + maxLat) / 2
      maxLng = (minLng + maxLng) / 2
    } else {
      minLat = (minLat + maxLat) / 2
      minLng = (minLng + maxLng) / 2
    }
  }
}
