import {geoArea} from 'd3';

/**
 * Display adapter for regional WGSRPD polygons, each smaller than a hemisphere.
 * Some tiny source components have planar winding that D3 interprets as the
 * spherical complement. Normalize each Polygon independently, including all
 * of its holes, while preserving the source snapshot and every coordinate.
 * This is a winding correction, not an inferred or expanded plant range.
 */
function normalizePolygon(coordinates){
  if(geoArea({type:'Polygon',coordinates})<=2*Math.PI)return coordinates;
  return coordinates.map(ring=>ring.slice().reverse().map(point=>point.slice()));
}

function normalizeGeometry(geometry){
  if(!geometry)return geometry;
  if(geometry.type==='Polygon'){
    const coordinates=normalizePolygon(geometry.coordinates);
    return coordinates===geometry.coordinates?geometry:{...geometry,coordinates};
  }
  if(geometry.type==='MultiPolygon'){
    const coordinates=geometry.coordinates.map(normalizePolygon);
    return coordinates.every((p,i)=>p===geometry.coordinates[i])?geometry:{...geometry,coordinates};
  }
  if(geometry.type==='GeometryCollection'){
    const geometries=geometry.geometries.map(normalizeGeometry);
    return geometries.every((g,i)=>g===geometry.geometries[i])?geometry:{...geometry,geometries};
  }
  return geometry;
}

export function normalizeSphericalFeature(feature){
  if(!feature)return feature;
  const geometry=normalizeGeometry(feature.geometry);
  return geometry===feature.geometry?feature:{...feature,geometry};
}

export function normalizedFeatureCollection(collection){
  if(!collection)return collection;
  return {...collection,features:collection.features.map(normalizeSphericalFeature)};
}
