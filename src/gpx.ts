type Track = Array<{
  latitude: string
  longitude: string
  time: Date
}>

interface GPXError {
  message: string
  type: 'warning' | 'error'
  count: number
}

// https://www.topografix.com/gpx/1/1/gpx.xsd
/**
 * returns a sequence of points with gps-coordinates and mandatory time, ignoring pauses
 * @param gpxString
 */
function readGPX(gpxString: string): {
  track: Track
  errors: GPXError[]
} {
  // Parse XML String
  const domParser = new DOMParser()
  const dom = domParser.parseFromString(gpxString, 'text/xml')
  if (dom.documentElement.nodeName === 'parsererror') {
    return { track: [], errors: [{ message: 'Invalid XML', type: 'error', count: 1 }] }
  }

  // Parse Data
  const elTrack = dom.documentElement.getElementsByTagName('trk').item(0)
  if (elTrack === null) return { track: [], errors: [{ message: 'No track found', type: 'error', count: 1 }] }

  const errors: GPXError[] = []
  const elTrackSegments = elTrack.getElementsByTagName('trkseg')
  const track: Array<{ latitude: string; longitude: string; time: Date }> = []
  for (const elTrackSegment of elTrackSegments) {
    const elTrackPoints = elTrackSegment.getElementsByTagName('trkpt')

    for (const elTrackPoint of elTrackPoints) {
      const latitude = elTrackPoint.getAttribute('lat')
      const longitude = elTrackPoint.getAttribute('lon')
      if (latitude === null || longitude === null) {
        addError(errors, { message: 'Track point without latitude or longitude found', type: 'warning' })
        continue
      }

      const elTime = elTrackPoint.getElementsByTagName('time').item(0)
      if (elTime === null || elTime.textContent === null) {
        addError(errors, { message: 'Track point without time found', type: 'warning' })
        continue
      }

      const time = new Date(elTime.textContent)
      if (isNaN(time.getTime())) {
        addError(errors, { message: 'Invalid time found', type: 'warning' })
        continue
      }

      track.push({ latitude, longitude, time })
    }
  }

  return { track, errors }
}

/** returns null if time is out of bounds */
function getTrackPointClosetToTime(time: Date, track: Track) {
  let pointBefore: (typeof track)[0] | null = null
  let pointAfter: (typeof track)[0] | null = null

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

// Counts the number of times the same error occurs
function addError(errors: GPXError[], error: Omit<GPXError, 'count'>) {
  const existingError = errors.find((e) => e.message === error.message)
  if (existingError) existingError.count = (existingError.count || 1) + 1
  else errors.push({ ...error, count: 1 })
}
