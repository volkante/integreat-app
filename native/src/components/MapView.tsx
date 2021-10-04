import MapboxGL, { CameraSettings, MapboxGLEvent, SymbolLayerProps } from '@react-native-mapbox-gl/maps'
import { useHeaderHeight } from '@react-navigation/stack'
import type { BBox, Feature, FeatureCollection, Point } from 'geojson'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { FAB } from 'react-native-elements'
import { PermissionStatus, RESULTS } from 'react-native-permissions'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { defaultViewportConfig, detailZoom, mapConfig, RouteInformationType } from 'api-client'

import dimensions from '../constants/dimensions'
import { checkLocationPermission, requestLocationPermission } from '../utils/LocationPermissionManager'
import MapPopup from './MapPopup'

const MapContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`
const StyledMap = styled(MapboxGL.MapView)<{ calcHeight: number }>`
  width: 100%;
  height: ${props => props.calcHeight}px;
`

type MapViewPropsType = {
  boundingBox: BBox
  featureCollection: FeatureCollection
  selectedFeature: Feature<Point> | null
  setSelectedFeature: (feature: Feature<Point> | null) => void
  navigateTo: (routeInformation: RouteInformationType) => void
  language: string
  cityCode: string
  setUserLocation: (coordinates: number[]) => void
  userLocation: number[] | null
}

const textOffsetY = 1.25
const featureLayerId = 'point'
const layerProps: SymbolLayerProps = {
  id: featureLayerId,
  style: {
    symbolPlacement: 'point',
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
    iconImage: ['get', 'symbol'],
    textField: ['get', 'title'],
    textFont: ['Roboto Regular'],
    textOffset: [0, textOffsetY],
    textAnchor: 'top',
    textSize: 12
  }
}

// Has to be set even if we use map libre
MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView = ({
  boundingBox,
  featureCollection,
  selectedFeature,
  setSelectedFeature,
  navigateTo,
  language,
  cityCode,
  setUserLocation,
  userLocation
}: MapViewPropsType): ReactElement => {
  const [followUserLocation, setFollowUserLocation] = useState<boolean>(false)
  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean>(false)

  const mapRef = React.useRef<MapboxGL.MapView | null>(null)
  const cameraRef = React.useRef<MapboxGL.Camera | null>(null)
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const headerHeight = useHeaderHeight()

  const bounds = {
    ne: [boundingBox[2], boundingBox[3]],
    sw: [boundingBox[0], boundingBox[1]]
  }

  // if there is a current feature use the coordinates if not use bounding box
  const coordinates = selectedFeature?.geometry?.coordinates
  const defaultSettings: CameraSettings = {
    zoomLevel: coordinates ? detailZoom : defaultViewportConfig.zoom,
    centerCoordinate: coordinates,
    bounds: coordinates ? undefined : bounds
  }

  const onLocationPermissionRequest = useCallback((locationPermission: PermissionStatus | undefined) => {
    const permissionGranted = locationPermission === RESULTS.GRANTED
    setLocationPermissionGranted(permissionGranted)
  }, [])

  useEffect(() => {
    checkLocationPermission().then(onLocationPermissionRequest)
  }, [onLocationPermissionRequest])

  // By clicking fab button the location permission gets requested, if it's granted the followUserLocation gets changed to opposite
  const requestPermission = useCallback(() => {
    requestLocationPermission().then(onLocationPermissionRequest)
    locationPermissionGranted && setFollowUserLocation(!followUserLocation)
  }, [followUserLocation, locationPermissionGranted, onLocationPermissionRequest])
  const onUserTrackingModeChange = (
    event: MapboxGLEvent<'usertrackingmodechange', { followUserLocation: boolean }>
  ) => {
    setFollowUserLocation(event.nativeEvent.payload.followUserLocation)
  }

  const locationPermissionIcon =
    locationPermissionGranted && followUserLocation
      ? 'my-location'
      : locationPermissionGranted
      ? 'location-searching'
      : 'location-disabled'

  // set the user location coordinate once to calculate distance for all pois
  const onLocationUpdate = (location: MapboxGL.Location): void => {
    !userLocation && setUserLocation([location.coords.longitude, location.coords.latitude])
  }

  const onPress = useCallback(
    async (pressedLocation: Feature) => {
      if (!mapRef?.current || !cameraRef?.current || !pressedLocation.properties) {
        return
      }
      const featureCollection = await mapRef.current.queryRenderedFeaturesAtPoint(
        [pressedLocation.properties.screenPointX, pressedLocation.properties.screenPointY],
        undefined,
        [featureLayerId]
      )
      const feature = featureCollection?.features?.find((it): it is Feature<Point> => it.geometry.type === 'Point')
      if (feature) {
        const {
          geometry: { coordinates }
        } = feature
        setSelectedFeature(feature)

        cameraRef.current.flyTo(coordinates)
      } else {
        setSelectedFeature(null)
      }
    },
    [setSelectedFeature]
  )

  const mapHeight = selectedFeature
    ? height - headerHeight
    : height - headerHeight - dimensions.bottomSheetHandler.height

  return (
    <MapContainer>
      <StyledMap
        styleJSON={mapConfig.styleJSON}
        zoomEnabled
        onPress={onPress}
        ref={mapRef}
        attributionEnabled={false}
        logoEnabled={false}
        calcHeight={mapHeight}>
        <MapboxGL.UserLocation visible={locationPermissionGranted} onUpdate={onLocationUpdate} />
        <MapboxGL.ShapeSource id='location-pois' shape={featureCollection}>
          <MapboxGL.SymbolLayer {...layerProps} />
        </MapboxGL.ShapeSource>
        <MapboxGL.Camera
          defaultSettings={defaultSettings}
          followUserMode='normal'
          followUserLocation={followUserLocation}
          onUserTrackingModeChange={onUserTrackingModeChange}
          ref={cameraRef}
        />
      </StyledMap>
      {selectedFeature && (
        <MapPopup feature={selectedFeature} navigateTo={navigateTo} language={language} cityCode={cityCode} />
      )}
      <FAB
        placement='right'
        onPress={requestPermission}
        icon={{ name: locationPermissionIcon }}
        color={theme.colors.themeColor}
        style={{ alignItems: 'flex-start', top: 0 }}
      />
    </MapContainer>
  )
}

export default MapView
