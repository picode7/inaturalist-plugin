// https://www.topografix.com/gpx/1/1/gpx.xsd

function readGPX(gpxString: string) {
  // Parse Data
  const domParser = new DOMParser()
  const dom = domParser.parseFromString(gpxString, 'text/xml')
  if (dom.documentElement.nodeName === 'parsererror') {
    return []
  }

  // Use Data
  const track: Array<{ latitude: string; longitude: string; time: Date }> = []
  const elTrack = dom.documentElement.getElementsByTagName('trk')[0]
  const elTrackSegments = elTrack.getElementsByTagName('trkseg')

  for (const elTrackSegment of elTrackSegments) {
    const elTrackPoints = elTrackSegment.getElementsByTagName('trkpt')

    for (const elTrackPoint of elTrackPoints) {
      const latitude = elTrackPoint.getAttribute('lat') as string
      const longitude = elTrackPoint.getAttribute('lon') as string
      const time = new Date(elTrackPoint.getElementsByTagName('time')[0].textContent as string)

      track.push({ latitude, longitude, time })
    }
  }

  return track
}

/** returns null if time is out of bounds */
function getTrackPointClosetToTime(time: Date, track: ReturnType<typeof readGPX>) {
  let pointMin: typeof track[0] | null = null
  let pointMax: typeof track[0] | null = null

  for (const point of track) {
    if (time >= point.time) pointMin = point
    if (time <= point.time) {
      pointMax = point
      break
    }
  }

  if (pointMin === null || pointMax === null) return null

  const deltaMin = time.getTime() - pointMin.time.getTime()
  const deltaMax = pointMax.time.getTime() - time.getTime()

  if (deltaMin < deltaMax) return pointMin
  else return pointMax
}
