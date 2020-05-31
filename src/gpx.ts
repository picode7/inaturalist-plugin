// https://www.topografix.com/gpx/1/1/gpx.xsd
/**
 * returns a sequence of points with gps-coordinates and mandatory time, ignoring pauses
 * @param gpxString
 */
function readGPX(gpxString: string) {
  // Parse XML String
  const domParser = new DOMParser()
  const dom = domParser.parseFromString(gpxString, 'text/xml')
  if (dom.documentElement.nodeName === 'parsererror') {
    return []
  }

  // Parse Data
  const elTrack = dom.documentElement.getElementsByTagName('trk').item(0)
  if (elTrack === null) return []

  const elTrackSegments = elTrack.getElementsByTagName('trkseg')
  const track: Array<{ latitude: string; longitude: string; time: Date }> = []
  for (const elTrackSegment of elTrackSegments) {
    const elTrackPoints = elTrackSegment.getElementsByTagName('trkpt')

    for (const elTrackPoint of elTrackPoints) {
      const latitude = elTrackPoint.getAttribute('lat')
      const longitude = elTrackPoint.getAttribute('lon')
      if (latitude === null || longitude === null) continue

      const elTime = elTrackPoint.getElementsByTagName('time').item(0)
      if (elTime === null || elTime.textContent === null) continue

      const time = new Date(elTime.textContent)
      if (isNaN(time.getTime())) continue

      track.push({ latitude, longitude, time })
    }
  }

  return track
}

/** returns null if time is out of bounds */
function getTrackPointClosetToTime(time: Date, track: ReturnType<typeof readGPX>) {
  let pointBefore: typeof track[0] | null = null
  let pointAfter: typeof track[0] | null = null

  for (const point of track) {
    if (time >= point.time) pointBefore = point
    if (time <= point.time) {
      pointAfter = point
      break
    }
  }

  if (pointBefore === null || pointAfter === null) return null

  const deltaBefore = time.getTime() - pointBefore.time.getTime()
  const deltaAfter = pointAfter.time.getTime() - time.getTime()

  if (deltaBefore < deltaAfter) return pointBefore
  else return pointAfter
}
