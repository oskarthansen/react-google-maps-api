import * as React from "react"

import {
  unregisterEvents,
  applyUpdatersToPropsAndRegisterEvents
} from "../../utils/helper"

import MapContext from "../../map-context"

const eventMap = {
  onCloseClick: "closeclick",
  onPanoChanged: "pano_changed",
  onPositionChanged: "position_changed",
  onPovChanged: "pov_changed",
  onResize: "resize",
  onStatusChanged: "status_changed",
  onVisibleChanged: "visible_changed",
  onZoomChanged: "zoom_changed"
}

const updaterMap = {
  register(
    instance: google.maps.StreetViewPanorama,
    provider: (input: string) => google.maps.StreetViewPanoramaData,
    options: any
  ) {
    instance.registerPanoProvider(provider, options)
  },
  links(
    instance: google.maps.StreetViewPanorama,
    links: google.maps.StreetViewLink[]
  ) {
    instance.setLinks(links)
  },
  motionTracking(
    instance: google.maps.StreetViewPanorama,
    motionTracking: boolean
  ) {
    instance.setMotionTracking(motionTracking)
  },
  options(
    instance: google.maps.StreetViewPanorama,
    options: google.maps.StreetViewPanoramaOptions
  ) {
    instance.setOptions(options)
  },
  pano(instance: google.maps.StreetViewPanorama, pano: string) {
    instance.setPano(pano)
  },
  position(
    instance: google.maps.StreetViewPanorama,
    position: google.maps.LatLng | google.maps.LatLngLiteral
  ) {
    instance.setPosition(position)
  },
  pov(
    instance: google.maps.StreetViewPanorama,
    pov: google.maps.StreetViewPov
  ) {
    instance.setPov(pov)
  },
  visible(instance: google.maps.StreetViewPanorama, visible: boolean) {
    instance.setVisible(visible)
  },
  zoom(instance: google.maps.StreetViewPanorama, zoom: number) {
    instance.setZoom(zoom)
  }
}

interface StreetViewPanoramaState {
  streetViewPanorama: google.maps.StreetViewPanorama | null;
}

export interface StreetViewPanoramaProps {
  options?: google.maps.StreetViewPanoramaOptions;
  /** This event is fired when the close button is clicked. */
  onCloseclick?: (event: google.maps.MouseEvent) => void;
  /** This event is fired when the panorama's pano id changes. The pano may change as the user navigates through the panorama or the position is manually set. Note that not all position changes trigger a pano_changed. */
  onPanoChanged?: () => void;
  /** This event is fired when the panorama's position changes. The position changes as the user navigates through the panorama or the position is set manually. */
  onPositionChanged?: () => void;
  /** This event is fired when the panorama's point-of-view changes. The point of view changes as the pitch, zoom, or heading changes. */
  onPovChanged?: () => void;
  /** Developers should trigger this event on the panorama when its div changes size: google.maps.event.trigger(panorama, 'resize'). */
  onResize?: () => void;
  /** This event is fired after every panorama lookup by id or location, via setPosition() or setPano(). */
  onStatusChanged?: () => void;
  /** This event is fired when the panorama's visibility changes. The visibility is changed when the Pegman is dragged onto the map, the close button is clicked, or setVisible() is called. */
  onVisibleChanged?: () => void;
  /** This event is fired when the panorama's zoom level changes. */
  onZoomChange?: () => void;
  /** This callback is called when the component unmounts. It is called with the streetViewPanorama instance. */
  onLoad?: (streetViewPanorama: google.maps.StreetViewPanorama) => void;
  /** This callback is called when the streetViewPanorama instance has loaded. It is called with the streetViewPanorama instance. */
  onUnmount?: (streetViewPanorama: google.maps.StreetViewPanorama) => void;
}

export class StreetViewPanorama extends React.PureComponent<
  StreetViewPanoramaProps,
  StreetViewPanoramaState
> {
  static contextType = MapContext

  registeredEvents: google.maps.MapsEventListener[] = []

  state: StreetViewPanoramaState = {
    streetViewPanorama: null
  }

  // eslint-disable-next-line @getify/proper-arrows/this, @getify/proper-arrows/name
  setStreetViewPanoramaCallback = () => {
    if (this.state.streetViewPanorama !== null && this.props.onLoad) {
      this.props.onLoad(this.state.streetViewPanorama)
    }
  }

  componentDidMount() {
    const streetViewPanorama = this.context.getStreetView()

    this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
      updaterMap,
      eventMap,
      prevProps: {},
      nextProps: this.props,
      instance: streetViewPanorama
    })

    function setStreetViewPanorama() {
      return {
        streetViewPanorama
      }
    }

    this.setState(
      setStreetViewPanorama,
      this.setStreetViewPanoramaCallback
    )
  }

  componentDidUpdate(prevProps: StreetViewPanoramaProps) {
    if (this.state.streetViewPanorama !== null) {
      unregisterEvents(this.registeredEvents)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps,
        nextProps: this.props,
        instance: this.state.streetViewPanorama
      })
    }
  }

  componentWillUnmount() {
    if (this.state.streetViewPanorama !== null) {
      if (this.props.onUnmount) {
        this.props.onUnmount(this.state.streetViewPanorama)
      }

      unregisterEvents(this.registeredEvents)

      this.state.streetViewPanorama.setVisible(false)
    }
  }

  render() {
    return null
  }
}

export default StreetViewPanorama
