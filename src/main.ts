function init() {
  const elContainer = document.createElement('div')
  document.getElementById('wrapper')?.insertBefore(elContainer, document.getElementById('batchformcol'))

  const elButton = document.createElement('input')
  elButton.type = 'button'
  elButton.value = 'Apply GPX file'
  elButton.classList.add('default', 'button')
  elContainer.appendChild(elButton)

  const elInfo = document.createElement('span')
  elContainer.appendChild(elInfo)

  elButton.onclick = () => {
    elInfo.textContent = ''

    openTextFiles({ accept: '.gpx' }).then((results) => {
      for (const result of results) {
        if (typeof result.content !== 'string') continue
        const track = readGPX(result.content)

        // get all observations
        const observations = document.querySelectorAll('#batchcol .observationform .column.span-24.observation')

        let count = 0
        for (const elObservation of observations) {
          const observation = readObservation(elObservation as HTMLElement)
          const updated = observationSetPositionFromTrack(observation, track)

          if (updated) count++
        }

        elInfo.textContent = `Updated ${count} observation${count === 1 ? '' : 's'}`
      }
    })
  }
}

function readObservation(observation: HTMLElement) {
  const id = observation.id.split('-')[1]

  return {
    observedOnString: observation.querySelector(`#observations_${id}_observed_on_string`) as HTMLInputElement,
    timeZone: observation.querySelector(`#observations_${id}_time_zone`) as HTMLSelectElement,
    placeGuess: observation.querySelector(`#observations_${id}_place_guess`) as HTMLInputElement,
    latitude: observation.querySelector(`#observations_${id}_latitude`) as HTMLInputElement,
    longitude: observation.querySelector(`#observations_${id}_longitude`) as HTMLInputElement,
    positionalAccuracy: observation.querySelector(`#observations_${id}_positional_accuracy`) as HTMLInputElement,
    positioningMethod: observation.querySelector(`#observations_${id}_positioning_method`) as HTMLInputElement,
  }
}

function observationSetPositionFromTrack(
  observation: ReturnType<typeof readObservation>,
  track: ReturnType<typeof readGPX>
) {
  // Firefox does not parse '2020-05-30 7:01:02 PM GMT+02:00' because of am/pm, but supports it with '/' instead of '-' in the date string
  const dateTimeString = observation.observedOnString.value.replace(/-/g, '/')
  const date = new Date(dateTimeString)

  const trackPoint = getTrackPointClosetToTime(date, track)
  if (trackPoint === null) return false

  observation.latitude.value = `${trackPoint.latitude}`
  observation.longitude.value = `${trackPoint.longitude}`
  observation.positionalAccuracy.value = ''
  observation.positioningMethod.value = 'gps'

  observation.latitude.style.color = '#f16f3a'
  observation.longitude.style.color = '#f16f3a'
  observation.positioningMethod.style.color = '#f16f3a'

  return true
}

init()
