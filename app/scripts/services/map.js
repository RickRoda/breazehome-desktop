'use strict';

    /**
    * @ngdoc service
    * @name breazehomeDesktop.Map
    * @description
    * # Map
    * Map service in the breazehomeDesktop.
    */
angular.module('breazehomeDesktop').factory('Map', function ( $rootScope) {

    var _propertyMarkerClusterGroup = null;

    var minMarkerSize = 28;
    var maxMarkerSize = 40;

    var map = null;
    var defaultLevel = 11;
    var currentLevel = defaultLevel;
    var properties = [];
    var propertyLayers = [];
    var clusterLayers = [];
    var clusterDistance = [ 6400, 3200, 1600, 800, 400,
    192, 96, 48, 24, 12,
    6, 3, 1.5, 0.75, 0.375,
    0.1875, 0.09375];

    var startEditBtn = null;
    var endEditBtn = null;
    var mapTopRightPoint;
    var mapBottomLeftPoint;
    var searchAsDrag = true;
    var startDraw = false;
    var isInEditMode = false;
    var editorLayer = null;
    var editorLayers = [];
    var editPointsList = [];
    var editPolygonList ={
        "type": "FeatureCollection",
        "features": []
    };
    var editPolygonString = "";

    //BEGIN PoLR (Juan) Map Layer Implementation
    var isochroneOriginMarker = null;
    var isochrone = null;
    //END PoLR (Juan) Map Layer Implementation

    var modifiedMarkers = [];
    var highlight = null;
    var propertyPoints = [];

    var detailMarker;


    var fiu = new L.LatLng(25.759249, -80.373662);
    var miami = new L.LatLng(25.727542, -80.238216);
    var userLocation = miami;

   // var setOpenMarker = false; //Ashif new variable


    //kilometers
    var _distance =function(lat1, lon1, lat2, lon2 ){

        var PI = 3.14159;
        var radlat1  = PI * lat1/180;
        var radlat2 = PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return dist;
    }


    //start geometry functions
    var _intersectPolygons = function(polygonList, boundary) {
        // console.log(polygonList, boundary)
        var intersections = [];
        for(var i = 0; i < polygonList.length; i++) {
            var intersect = turf.intersect(polygonList[i], boundary);
            if(intersect != undefined) {
                intersections.push(intersect);
            }
        }
        return intersections;
    }

    var _mergePolygon = function(polygonList) {
        var union = {};
        for(var i = 0; i < polygonList.length; i++) {
            if(i == 0) {
                union = polygonList[i];
            } else {
                union = turf.union(union, polygonList[i]);
            }
        }
        return union;
    }

    var _metersPerPixel = function(latitude, zoomLevel) {
        var earthCircumference = 40075017;
        var latitudeRadians = latitude * (Math.PI/180);
        return earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, zoomLevel + 8);
    };
    //end geometry functions


    //start edit mode
    var _drawEditPolygon = function(polygon) {

        var polygonLayer = L.geoJson(polygon, {
            pane: 'polygon',
            fillColor: "#798E98",
            color: "#00698F",
            weight: 3,
            opacity: 1,
            fillOpacity: 1
        }).addTo(map);
        var polygonLayer2 = L.geoJson(polygon, {
            "color": "#00698F",
            "weight": 3,
            "opacity": 0.65
        }).addTo(map);

        var deleteIcon = L.icon({
            iconUrl: '../images/map/delete_shape.png',
            iconSize: [18, 18],
            iconAnchor: [9, 9],
        });
        var deleteIconHover = L.icon({
            iconUrl: '../images/map/delete_shape_hover.png',
            iconSize: [18, 18],
            iconAnchor: [9, 9],
        });

        var markerPos = polygon.features[0].geometry.coordinates[0][0];

        var markerDelete = L.marker(L.latLng(markerPos[1],markerPos[0]), {
            // Set default icon
            icon: deleteIcon,
        }).addTo(map)
        markerDelete.polygon = {layer1:polygonLayer, layer2:polygonLayer2, points:polygon};
        markerDelete.on('click', _onDeletePolygon);
        markerDelete.on('mouseover', function(e){
            this.setIcon(deleteIconHover)
        });
        markerDelete.on('mouseout', function(e){
            this.setIcon(deleteIcon)
        });

        editorLayers.push(polygonLayer);
        editorLayers.push(polygonLayer2);
        editorLayers.push(markerDelete);
    }


    var _refreshEditPolygon = function() {

        for( var i = 0; i < editorLayers.length; i++) {
            map.removeLayer( editorLayers[i]);
        }
        editorLayers = [];

        if(editPolygonList.features.length == 0) {
            return;
        }

        editPolygonList.features = [_mergePolygon(editPolygonList.features)];

        for(var i = 0; i < editPolygonList.features.length; i++) {

            if(editPolygonList.features[i].geometry.type == "Polygon") {
                var collection = {
                    "type": "FeatureCollection",
                    "features": [editPolygonList.features[i]]
                };
                _drawEditPolygon(collection);
            } else if(editPolygonList.features[i].geometry.type == "MultiPolygon") {
                for(var j = 0; j < editPolygonList.features[i].geometry.coordinates.length; j++){
                    var feature = {
                        "geometry": {
                            "coordinates": editPolygonList.features[i].geometry.coordinates[j],
                            "type": "Polygon"
                        },
                        "properties": {},
                        "type": "Feature"
                    }
                    var collection = {
                        "type": "FeatureCollection",
                        "features": [feature]
                    };
                    _drawEditPolygon(collection);
                }
            }
        }
        _applyEditPolygon();
        editPointsList = [];
        editorLayer = null;
    }

    var _onDeletePolygon = function(e) {
        var polygonData = this.polygon.points;
        for(var i = 0; i < editPolygonList.features.length; i++) {

            if(editPolygonList.features[i].geometry.type == "Polygon") {
                if(editPolygonList.features[i].geometry == polygonData.features[0].geometry) {
                    // editPolygonList.features.splice(i, 1);
                    if(editPolygonList.features.length == 1) {
                        editPolygonList = {
                            "type": "FeatureCollection",
                            "features": []
                        }
                    }
                }
            } else if(editPolygonList.features[i].geometry.type == "MultiPolygon") {
                for(var j = 0; j < editPolygonList.features[i].geometry.coordinates.length; j++){
                    // console.log("current", editPolygonList.features[i].geometry.coordinates[j], polygonData.features[0].geometry.coordinates)
                    if(editPolygonList.features[i].geometry.coordinates[j] == polygonData.features[0].geometry.coordinates) {
                        editPolygonList.features[i].geometry.coordinates.splice(j, 1)
                    }
                }
                if(editPolygonList.features[i].geometry.coordinates.length == 0) {
                    editPolygonList.features.splice(i, 1)
                }
            } else {

            }
        }
        // var index = editPolygonList.features.indexOf(polygonData.features[])
        // editPolygonList.features.splice(index, 1)
        var result = turf.mask(editPolygonList, polygonData.features[0]);
        _refreshEditPolygon();
        _applyEditPolygon();
    }


    var _startEditInMap = function( ) {
        isInEditMode = true;
        map.dragging.disable();
    }

    var _endEditInMap = function( ) {
        isInEditMode = false;
        map.dragging.enable();
    }

    var _applyEditPolygon = function(multiPolygon) {
        if(editPolygonList.length == 0) {
            return;
        }
        if( editPolygonList.features == null || editPolygonList.features.length == 0) {
            var props = [];
            mapServiceApi.addPropertiesIntoClusters(props);
            return;
        }
        editPolygonString = JSON.stringify(editPolygonList.features[0].geometry)
        $rootScope.$broadcast('map.mapmove');

    }
    //end edit mode


    /**
    * Formats the cost of the property before displaying it on the map.
    */
    var _getFormattedPropertyCost = function(cost) {
        var output = "";
        var number = 0.0;

        if (cost > 1000000) {
            number = parseFloat((cost / 1000000.00).toFixed(2));
            output = number.toString() + "m";
        } else if (cost > 1000) {
            number = parseFloat((cost / 1000.00).toFixed(2));
            output = number.toString() + "k";
        } else {
            output = parseFloat(cost).toString();
        }
        return output;
    }


    //start map event
    var _onMapMouseMove = function(e) {
        if( !startDraw) {
            return;
        }
        if( editPointsList == undefined || editPointsList.length == 0 || _distance(e.latlng.lat, e.latlng.lng,  editPointsList[ editPointsList.length-1][0], editPointsList[ editPointsList.length-1][1]) > clusterDistance[currentLevel]/6 ){
            if(editorLayer != null) {
                map.removeLayer( editorLayer);
                editorLayers.pop();
            }
            editPointsList.push([e.latlng.lng, e.latlng.lat])
            var style = {
                "color": "#00698F",
                "weight": 3,
                "opacity": 0.65
            };
            var latlngs = [];
            for(var i = 0; i < editPointsList.length; i++) {
                latlngs.push(L.latLng(editPointsList[i][1], editPointsList[i][0]));
            }
            editorLayer = L.polyline(latlngs, style).addTo(map);
            editorLayers.push(editorLayer);
        }
    }

    var _onMapMouseDown = function(e) {
        // mapServiceApi.removeHighlight();
        if( !isInEditMode ) {
            return;
        }
        startDraw = true;
    }

    var _onMapMouseUp = function(e) {
        if( !isInEditMode ) {
            return;
        }
        startDraw = false;
        if(editPointsList.length <= 1){
            editPointsList = []
            editorLayer = null;
            return;
        }

        //add new edit polygon to list
        editPointsList.push(editPointsList[0])
        var editPoly = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [editPointsList]
            }
        };
        editPolygonList.features.push(turf.simplify(editPoly, 0.0001, false));
        _refreshEditPolygon();
    }

    var _onMapMoveEnd = function(e) {

        // _hideDetailPopup();
        // _hidePropertyPoints();
        // console.log("_onMapMoveEnd")

        if(!searchAsDrag) {
            return;
        }
        // mapServiceApi.clearAllPropertiesLayer();
        $rootScope.$broadcast('map.mapmove');
    }

    var _onMapClick = function(e) {
        _removeHighlight();
        _refreshAllModifiedMarkers();
        // _hideDetailPopup();
    }

    var _onZoomEnd = function(e){
        if(currentLevel != e["target"]["_zoom"]) {
            currentLevel = e["target"]["_zoom"];
            _refreshClusterIcons();
            // _hidePropertyPoints();
            // _hideDetailPopup();
        }
    }


    var _markerOutOfView = function(coord, size, offset, centerIconSize, defaultPos) {
        var location = map.latLngToContainerPoint(coord);
        location.x = location.x - offset[0]
        location.y = location.y
        var posMulti = defaultPos;
        // console.log("_markerOutOfView", location, size, offset, centerIconSize, defaultPos)
        posMulti = _checkMarkerXPos(location, size, centerIconSize, posMulti, true);
        posMulti = _checkMarkerYPos(location, size, centerIconSize, posMulti, true);
        // posMulti = defaultPos
        // console.log("~~~offsetx", location.x, left, right , posMulti[0],  mapTopRightPoint)
        // console.log("~~~offsety", location.y , top, bottom , posMulti[1],  mapBottomLeftPoint)
        return [ offset[0] + (centerIconSize[0]/2+ size[0]/2 ) * posMulti[0],  offset[1] + (centerIconSize[1]/2 + size[1]/2) * posMulti[1] ]
    }
    var _checkMarkerXPos = function(location, size, centerIconSize, posMulti, checkY) {
        var left = 0, right = 0;
        if(posMulti[0] == 0) {
            left = location.x;
            right = location.x + size[0];
        } else if(posMulti[0] == 1 || posMulti[0] == -1) {
            left = location.x - size[0];
            right = location.x + size[0] + centerIconSize[0]
        }
        var changed = false;
        if( right > mapTopRightPoint.x ) {
            posMulti[0] =  1;
            changed = true;
        } else if( left < 0 ) {
            posMulti[0] =  -1;
            changed = true;
        } else {

        }

        if(checkY == true && changed == true && posMulti[1] != 0) {
            var temp = posMulti[1];
            posMulti[1] = 0;
            posMulti = _checkMarkerYPos(location, size, centerIconSize, posMulti, false);
            if(posMulti[1] != 0) {
                posMulti[1] = temp;
            }
        }
        return posMulti;
    }
    var _checkMarkerYPos = function(location, size, centerIconSize, posMulti, checkX) {

        var top = 0, bottom;
        if(posMulti[1] == 0) {
            top = location.y - size[1]/2;
            bottom = location.y + size[1]/2;
        } else if(posMulti[1] == 1 || posMulti[1] == -1) {
            top = location.y - size[1] - centerIconSize[1]/2;
            bottom = location.y + size[1] + centerIconSize[1]/2;
        }
        var changed = false;
        if( bottom > mapBottomLeftPoint.y ) {
            posMulti[1] =  1;
            changed = true;
        } else if(top < 0 ) {
            posMulti[1] =  -1;
            changed = true;
        }
        if(checkX == true && changed == true && posMulti[0] != 0) {
            var temp = posMulti[0];
            posMulti[0] = 0;
            posMulti = _checkMarkerXPos(location, size, centerIconSize, posMulti, false);
            if(posMulti[0] != 0) {
                posMulti[0] = temp;
            }
        }
        return posMulti;
    }

    var _hidePropertyPoints = function() {
        // console.log("_hidePropertyPoints");
        if(propertyPoints == null) {
            return;
        }
        for(var i = 0; i < propertyPoints.length; i++) {
            map.removeLayer(propertyPoints[i]);
        }
        propertyPoints = [];
    }


    var _showPropertyPoints = function(cluster) {
        _hidePropertyPoints();
        var marksers = cluster.getAllChildMarkers();
        marksers.forEach(function(marker) {
        propertyPoints.push(
            L.circle( marker._latlng, 1,  {
                color: 'rgba(0,104,143,255)',
                fillColor: '#ff0000',
                fillOpacity: 0.5,
                weight: 2
            }
            ).addTo(map));
        });
    }

    // Function for getting new hover icon
    var _setAminationClusterIcon = function(cluster) {
        var label = "";//cluster.items.length;
        var divIcon =  L.divIcon({
            className:"map-mapiconhover",
            html:'<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);" > '+ label + '</div>',
            iconAnchor : [cluster.borderSize/2, cluster.borderSize/2],
            iconSize : [cluster.borderSize, cluster.borderSize],
            popupAnchor : [cluster.borderSize/2, cluster.borderSize/2],
        });
        cluster.setIcon(divIcon)
        cluster.setZIndexOffset(600);
    }


    var _hideDetailPopup = function() {
        // console.log("hideDetailPopup")
        if(detailMarker != null){
            map.removeLayer(detailMarker)
            detailMarker = null;
        }
    }

    var _highlightProperty = function(marker) {
        // console.log("highlight", marker)
        // Remove highlight
        _removeHighlight();
        // Set highlight icon
        if(marker.isCluster) {
            _setHighlightedClusterIcon(marker);
        } else {
            _setHighlightedPropertyIcon(marker);
        }
        // Assign highlight
        highlight = marker;
        for(var i = 0; i < propertyLayers.length; i++) {
            if(propertyLayers[i] != marker) {
                _setFadeinProperty(propertyLayers[i]);
            }
        }
        for(var i = 0; i < clusterLayers.length; i++) {
            if(clusterLayers[i] != marker) {
                _setFadeinCluster(clusterLayers[i]);
            }
        }
    }

    /**
    * Refreshes all the markers to the default icons.
    */
    var _refreshAllModifiedMarkers = function() {
        _refreshIconsByList(modifiedMarkers);
        modifiedMarkers = [];
        // console.log("clear modified")
        // this.refreshClusterIcons();
    }
    /**
    * Refreshes the property markers to the default icons.
    */
    var  _refreshIconsByList = function(list) {
        var priceLabelText;

        list.forEach((marker) => {
            if(marker.isCluster){
                if(highlight == marker) {
                    _setHighlightedClusterIcon(marker);
                } else {
                    _setClusterIcon(marker);
                }
            } else {
                if(highlight == marker) {
                    _setHighlightedPropertyIcon(marker);
                } else {
                    _setPropertyIcon(marker);
                }
            }
        });
    }

    var _refreshIcon = function(list) {
        var priceLabelText;

        list.forEach((marker) => {
            if(marker.isCluster){
                if(highlight == marker) {
                    _setHighlightedClusterIcon(marker);
                } else {
                    _setClusterIcon(marker);
                }
            } else {
             if(highlight == marker) {
                _setHighlightedPropertyIcon(marker);
            } else {
                _setPropertyIcon(marker);
            }
        }
    });
    }

    /**
    * Returns a Leaflet icon for the property to display in the map.
    *
    * @param {string} priceLabelText the text to display for the property.
    * @returns L.divIcon the icon for the property
    */
    var _setPropertyIcon = function(layer) {
        var priceLabelText = _getFormattedPropertyCost(layer.options.property.currentPrice);
        let label = "<font class='map-dollar'>&nbsp$</font> " + priceLabelText + "&nbsp";

        var divIcon = L.divIcon({
            className: 'map-markersingle',
            iconAnchor: [7, 30],
            iconSize: null,
            popupAnchor: [7, 30],
            zIndexOffset: 300,
            html: '<div>' + label +
            '<i class="fa fa-star" aria-hidden="true" style="color:yellow; "></i></div><div class="arrow" />'
        });
        layer.setIcon(divIcon);
    }
    /**
    * Returns the style of the cluster icon.
    *
    * @param {number} clusterChildCount the number of markers inside the cluster
    * @returns an L.DivIcon element with the style of the cluster
    */
    var _setClusterIcon = function(cluster) {
        // console.log("_setClusterIcon")
        var label = cluster.getChildCount();
        var divIcon =  L.divIcon({
            className:"map-mapicon",// map-selectedMarker",
            border: "2px solid #ff0000;",
            html:'<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); ;" > '+ label + '</div>',
            iconAnchor : [cluster.currentSize/2, cluster.currentSize/2],
            iconSize : [cluster.currentSize, cluster.currentSize],
            popupAnchor : [cluster.currentSize/2, cluster.currentSize/2],
        });

        cluster.setIcon(divIcon);
        cluster.setZIndexOffset(0);
        // Color values: #F2F2F2 for few propterties /  #00698F for many properties
        // marker.getElement().style.border =   ((cluster.borderWidth/2) + 1) + 'px solid rgba(0,' + 104 + ',' + 143 + ',' + (0.8*cluster.borderWidth/8 + 0.2) +')';
        if(cluster.getElement() != null){
            cluster.getElement().style.border = '2px solid rgba(0,' + 104 + ',' + 143 + ',' + '1)';
        }


        if(cluster.animatedSize != null && cluster.animatedSize == true)
        {
            cluster.timeout = setTimeout(function(){
                cluster.currentSize = cluster.currentSize + 10;
                if(cluster.currentSize < cluster.borderSize) {
                    _setClusterIcon(cluster);
                } else {
                    cluster.animatedSize = false;
                    clearTimeout(cluster.timeout);
                    if(cluster.timeout != null){
                        cluster.timeout = null;
                    }
                    _setAminationClusterIcon(cluster);
                    _showPropertyPoints(cluster)
                    cluster.currentSize = cluster.markerSize;
                }
            }, 10);
        }
    }


    // Function for removing highlight
    var _removeHighlight = function() {
        // Check for highlight
        if (highlight != null) {
        // console.trace("removeHighlight")
            // Set default icon
            // Unset highlight
            highlight = null;
            _refreshAllModifiedMarkers();
        }
    }

    var _setHighlightedPropertyIcon = function(layer) {
        var priceLabelText = _getFormattedPropertyCost(layer.options.property.currentPrice);
        var label = "<font class='map-dollar'>&nbsp$</font> " + priceLabelText + "&nbsp";

        var divIcon = L.divIcon({
            className: 'map-markersinglehighlight',
            iconAnchor: [7, 30],
            iconSize: null,
            popupAnchor: [7, 30],
            html:'<div>' + label + '</div><div class="arrow"/>'
        });
        layer.setIcon(divIcon);
    }

    var _setHighlightedClusterIcon = function(cluster) {
        var label = cluster.getChildCount();
        var width = cluster.markerSize + 14;
        var width2 = cluster.markerSize + 28;
        var topMargin = 0 - minMarkerSize - cluster.markerSize + 7;
        var divIcon =  L.divIcon({
            className:"map-mapiconhighlight",
            html:'<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);" > '+ label + '</div><div class="map-mapiconhighlight1" style="width:' + width +'px; height:' + width + 'px; margin-left: -9px; margin-top: -9px;"></div><div class="map-mapiconhighlight2" style="width:' + width2 +'px; height:' + width2 + 'px; margin-left: -16px; margin-top: ' + topMargin+ 'px;"></div>',
            iconAnchor : [cluster.markerSize/2, cluster.markerSize/2],
            iconSize : [cluster.markerSize, cluster.markerSize],
            popupAnchor : [cluster.markerSize/2, cluster.markerSize/2],
        });
        cluster.setIcon(divIcon);
    }

    var _setDetailPropertyIcon = function(marker) {
        // label = cluster.centerItem.currentPrice;
        var priceLabelText = _getFormattedPropertyCost(marker.property.currentPrice);
        var label = "<font class='map-dollar'>&nbsp$</font>&nbsp" + priceLabelText + "&nbsp"
        var size = [64, 80];
        var offset = [6, 40];
        var centerSize = [56, 14];
        var anchor = _markerOutOfView(marker.property.coords, size, offset,centerSize, [0, 1]);
        //Ashif new code for openhouse
        var openhouseInfo;
        var openhouseDate;
        var openhouseTime;
        var openUpcoming = marker.property.openHouseUpcoming;
        if (openUpcoming!=null&&openUpcoming.startsWith("Public")){  //Ashif , Openhouse , Display if openHouseUpcoming is not null && is public type

           openhouseInfo = openUpcoming.split(",");
           openhouseDate = openhouseInfo[0];
           openhouseTime = openhouseInfo[1];
           openhouseInfo = '<br>'+openhouseDate+'<br> Time: '+openhouseTime //+'<br><font color="black">'+marker.property.addressInternetDisplay+'</font>';


        }
        else{
           openhouseInfo =''
        }


        var  htmlContainer = ' <div class="words" ><b><span>&nbsp2 Bd, 1 Ba</span></b><br><span>&nbsp' +  marker.property.sqFtTotal + '&nbspsqrt</span><br><span>&nbspCondo</span><br><div><span>' + label+'</span>  <i class="fa fa-star" aria-hidden="true" style="color:yellow;"></i>'+openhouseInfo+'</div></div>'

// End of Ashif , Openhouse

        var divIcon = L.divIcon({
            className: 'map-markerdetail',
            iconAnchor : [anchor[0], anchor[1]],
            iconSize:null,
            html:htmlContainer}); //Ashif openhouse changes
        marker.setIcon(divIcon);
        marker.addTo(map);
    }


    var _onPropertyDetailOut = function() {
        detailMarker.on('mouseout', function(a) {
            // console.log("detail out")
            if(detailMarker != null) {
                _hideDetailPopup();
            }
        });
    }

    var _onPropertyDetailClick = function() {
        detailMarker.on('click', function(a) {
            // console.log("detail click")
	    var id = detailMarker.propertylayer.options.property.id;
        window.location.href = "/#/results/" + id
            _highlightProperty(detailMarker.propertylayer);
            modifiedMarkers.push(detailMarker.propertylayer);
        });
    }

    var _onPropertyDetailDBClick = function() {
        detailMarker.on('dblclick', function(a) {
            console.log("detail dblclick")
        });
    }

    var _setDetailClusterIcon = function(detail) {
        var minPrice = 99999999;
        var maxprice = 0;
        var sqFtTotalAll = 0;
        var sqFtCount = 0;

        var marksers = detail.cluster.getAllChildMarkers();
        marksers.forEach(function(marker) {

            var currentPrice = parseFloat(marker.options.property.currentPrice).toString();
            if(minPrice > currentPrice) {
                minPrice = currentPrice;
            }
            if(maxprice < currentPrice) {
                maxprice = currentPrice;
            }
            var sqFtTotal = parseInt(marker.options.property.sqFtTotal);
            if(sqFtTotal > 0) {
                sqFtTotalAll = sqFtTotalAll + sqFtTotal;
                sqFtCount = sqFtCount + 1;
            }
        })

        var size = [100, 80];
        var offset = [size[0]/2, size[1]/2];
        var centerSize = [detail.cluster.borderSize, detail.cluster.borderSize];
        var minPrice = _getFormattedPropertyCost(minPrice);
        var maxprice = _getFormattedPropertyCost(maxprice);

        var anchor = _markerOutOfView(detail.cluster.centerCoord, size, offset, centerSize, [1,0]);
        var divIcon = L.divIcon({
            className: 'map-markerdetail ',
            iconAnchor : [anchor[0] , anchor[1]],
            iconSize:null,
            html:' <div class="words" ><b><span>&nbsp2-5 Bd, 1-3 Ba</span></b><br><span>&nbspAvg. ' +  (sqFtTotalAll/sqFtCount).toFixed(0) + '&nbspsqrt</span><br><span>&nbspCondo</span><br><span><font class="map-dollar">&nbsp$</font>' + minPrice +'&nbsp-&nbsp<font class="map-dollar">$</font>' + maxprice + '</span></div>'});
        detail.setIcon(divIcon);
        detail.addTo(map);
    }

    var _setFadeinProperty = function(layer) {

        var priceLabelText = _getFormattedPropertyCost(layer.options.property.currentPrice);
        var label = "<font class='map-dollar'>&nbsp$</font>" + priceLabelText + "&nbsp"
        var divIcon =  L.divIcon({
            className: 'map-markersinglefade ',
            iconAnchor : [7, 30],
            iconSize:null,
            popupAnchor : [7, 30],
            html:'<div style="margin-top:-2px;">' +  label+'</div><div class="arrow" />'});
        layer.setIcon(divIcon);
        modifiedMarkers.push(layer);
    }

    var _setFadeinCluster = function(cluster) {
        var label = cluster.getChildCount();
        var divIcon =  L.divIcon({
            className:"map-mapiconfade",
            html:'<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);" > '+ label + '</div>',
            iconAnchor : [cluster.markerSize/2, cluster.markerSize/2],
            iconSize : [cluster.markerSize, cluster.markerSize],
            popupAnchor : [cluster.markerSize/2, cluster.markerSize/2],
        });
        cluster.setIcon(divIcon);
        modifiedMarkers.push(cluster);
    }

    var _onPropertyOver = function() {
        _propertyMarkerClusterGroup.on('mouseover', function(a) {
            if(detailMarker != null) {
                return;
            }

            detailMarker = L.marker(a.layer.options.property.coords, {
                // Set default icon
                pointerEvents: false,
                zIndexOffset: 200,
            })
            detailMarker.property = a.layer.options.property;
            detailMarker.propertylayer = a.layer;
            _setDetailPropertyIcon(detailMarker);
            _onPropertyDetailDBClick();
            _onPropertyDetailOut();
            _onPropertyDetailClick();
        });
    }

    var _onClusterOver = function() {
        _propertyMarkerClusterGroup.on('clustermouseover', function(a) {

            if(detailMarker != null) {
                return;
            }
            if(highlight != null) {
                return;
            }
            detailMarker = L.marker(new L.latLng(a.layer.centerCoord[0] , a.layer.centerCoord[1]), {
                // Set default icon
                pointerEvents: false,
                zIndexOffset: 800,
            })
            // console.log("start time out")
            if(a.layer.timeout != null){
                clearTimeout(a.layer.timeout);
                a.layer.timeout = null;
            }
            a.layer.animatedSize = true;
            a.layer.currentSize = a.layer.markerSize;
            detailMarker.cluster = a.layer;
            _setDetailClusterIcon(detailMarker);
            _setClusterIcon(a.layer);

        });
    }

    var _onClusterOut = function() {
        _propertyMarkerClusterGroup.on('clustermouseout', function(a) {
            a.layer.currentSize = a.layer.markerSize;
            if(a.layer.timeout != null){
                clearTimeout(a.layer.timeout);
                a.layer.timeout = null;
            }
            a.layer.animatedSize = false;
            a.layer.currentSize = a.layer.markerSize;


            if(highlight == a.layer) {
                _setHighlightedClusterIcon(a.layer);
            } else {
                _setClusterIcon(a.layer);
            }
            _hideDetailPopup();
            _hidePropertyPoints();
        });
    }

    var _onPropertyOut = function() {
        _propertyMarkerClusterGroup.on('mouseout', function(a) {
            // console.log("propertyOut")
            // _hideDetailPopup();
        });
    }

    var _onPropertyClick = function() {
        _propertyMarkerClusterGroup.on('click', function(a) {
            // console.log("property click")
            _highlightProperty(a.layer);
            modifiedMarkers.push(a.layer);
        });
    }

    var _onClusterClick = function() {
        _propertyMarkerClusterGroup.on('clusterclick', function(a) {
            // console.log("cluster click")
            if(a.layer.timeout != null){
                clearTimeout(a.layer.timeout);
                a.layer.timeout = null;
            }
            a.layer.animatedSize = false;
            a.layer.currentSize = a.layer.markerSize;
            _hidePropertyPoints();

            _highlightProperty(a.layer);

            modifiedMarkers.push(a.layer);
        });
    }

    var _onPropertyDbClick = function() {

        _propertyMarkerClusterGroup.on('dblclick', function(a) {
            console.log("property dblclick")
        });
        _propertyMarkerClusterGroup.on('dblclick', _onMarkerDbClick);
    }

    var _onClusterDbClick = function() {
        _propertyMarkerClusterGroup.on('clusterdblclick', _onMarkerDbClick);
    }

    var _onMarkerDbClick = function(e) {
        console.log("!!!!_onMarkerDbClick")
        // map.setView(new L.LatLng(this.cluster.centerCoord[0], this.cluster.centerCoord[1]), currentLevel+ 1);
    }

    /**
    * Refreshes the cluster markers to the default icons.
    */
   var _refreshClusterIcons = function() {
    // console.log("_refreshClusterIcons")
        map.eachLayer(function(layer) {

            if (layer.getChildCount) { // If it's a cluster
                _setClusterIcon(layer);
            }
        });
        mapServiceApi.initClustersData();
    }
    //end map event

    var  mapServiceApi = {

        initResultsMap : function(mapName, position) {
            map = mapServiceApi.loadMap(mapName);
            map.setView(position, defaultLevel );
            _propertyMarkerClusterGroup = L.markerClusterGroup({

                spiderfyOnMaxZoom: false,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: false,
            });
            var p = {currentPrice: 1000}
            // mapServiceApi.addPropertyToClusterGroup(new L.LatLng(25.727542, -80.238216), p)
            // mapServiceApi.addPropertyToClusterGroup(new L.LatLng(25.727542, -80.238216), p)
            // mapServiceApi.addPropertyToClusterGroup(new L.LatLng(25.727542, -80.238216), p)
            // mapServiceApi.addPropertyToClusterGroup(new L.LatLng(25.8, -80.238216), p)
            // _propertyMarkerClusterGroup.addLayer(L.marker(new L.LatLng(25.727542, -80.238216)));
            // _propertyMarkerClusterGroup.addLayer(L.marker(new L.LatLng(25.727542, -80.238216)));
            // _propertyMarkerClusterGroup.addLayer(L.marker(new L.LatLng(25.727542, -80.238216)));
            map.addLayer(_propertyMarkerClusterGroup);

            map.on({
                zoomend : _onZoomEnd,
                mousemove : _onMapMouseMove,
                mousedown : _onMapMouseDown,
                mouseup : _onMapMouseUp,
                click : _onMapClick,
                moveend : _onMapMoveEnd
            });

            this.addResultsToolBar();
        },

        /*
        setOpenHouseMarker: function(trueFalse){ //Ashif needed for Openhouse map logic
           setOpenMarker = trueFalse;
        },

        */


        initClustersData : function() {
            var maxclusterLength = 0;
            var minclusterLength = 999999;
            clusterLayers = [];
            propertyLayers = [];


            map.eachLayer(function(cluster) {
                if (cluster.getChildCount) { // If it's a cluster
                    cluster.maxCoord = [-1000.0, -1000.0];
                    cluster.minCoord = [1000.0, 1000.0];
                    var marksers = cluster.getAllChildMarkers();
                    marksers.forEach(function(marker) {
                        cluster.maxCoord[0] = Math.max(cluster.maxCoord[0], marker.options.property.coords.lat);
                        cluster.minCoord[0] = Math.min(cluster.minCoord[0], marker.options.property.coords.lat);
                        cluster.maxCoord[1] = Math.max(cluster.maxCoord[1], marker.options.property.coords.lng);
                        cluster.minCoord[1] = Math.min(cluster.minCoord[1], marker.options.property.coords.lng);
                    });

                    cluster.centerCoord = [ (parseFloat(cluster.maxCoord[0])+parseFloat(cluster.minCoord[0]))/2, (parseFloat(cluster.maxCoord[1])+parseFloat(cluster.minCoord[1]))/2];
                    minclusterLength = Math.min(minclusterLength, cluster.getChildCount());
                    maxclusterLength = Math.max(maxclusterLength, cluster.getChildCount());
                    // console.log("~~~ maxCluster:", maxclusterLength, ".  minCluster: ", minclusterLength);
                    cluster.setLatLng(cluster.centerCoord);
                    cluster.isCluster = true;
                    clusterLayers.push(cluster);
                }
            });

            _propertyMarkerClusterGroup.eachLayer((layer) => {
                if(layer._map != null) {
                    layer.isCluster = false;
                    propertyLayers.push(layer);
                }
            });

            map.eachLayer(function(cluster) {
                if (cluster.getChildCount) { // If it's a cluster
                    if(maxclusterLength - minclusterLength == 0) {
                        cluster.markerSize = maxMarkerSize;
                    } else {
                        cluster.markerSize = maxMarkerSize - (maxMarkerSize - minMarkerSize) * (maxclusterLength - cluster.getChildCount()) / (maxclusterLength - minclusterLength);
                    }
                    if(maxclusterLength - minclusterLength == 0) {
                        cluster.borderWidth = 8;
                    } else {
                        cluster.borderWidth = 8 - 8 * (maxclusterLength - cluster.getChildCount()) / (maxclusterLength - minclusterLength);
                    }

                    cluster.centerCoord = [ (parseFloat(cluster.maxCoord[0])+parseFloat(cluster.minCoord[0]))/2, (parseFloat(cluster.maxCoord[1])+parseFloat(cluster.minCoord[1]))/2];

                    var distance = L.latLng(cluster.centerCoord[0], cluster.centerCoord[1]).distanceTo(L.latLng(cluster.maxCoord[0], cluster.maxCoord[1]));
                    // cluster.markerSize = 2 * distance / _metersPerPixel(cluster.centerCoord[0], map.getZoom()) + 4;
                    var meter = _metersPerPixel(cluster.centerCoord[0], map.getZoom());
                    cluster.borderSize = 2 * distance / _metersPerPixel(cluster.centerCoord[0], map.getZoom()) + 4;
                    cluster.currentSize = cluster.markerSize;
                }
            });
        },

        // Init Map after loaded the webpage.
        // Parameters:
        // mapname is the id of the div in html. Map will be shown in this div.
        // zoom button is boolean. If zoomButton is false, all zoom function will be disable.
        loadMap: function(mapName, zoombutton) {

            var currentmap = new L.map(mapName, {
                zoomControl: zoombutton == true,
                attributionControl: false
                //... other options
            });

            if(zoombutton == false) {
                currentmap.scrollWheelZoom.disable();
                currentmap.touchZoom.disable();
                currentmap.doubleClickZoom.disable();
                currentmap.scrollWheelZoom.disable();
                currentmap.boxZoom.disable();
                currentmap.keyboard.disable();
            }

            //add a tile layer to add to our map, in this case it's the 'standard' OpenStreetMap.org tile server
            //L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            L.tileLayer('http://131.94.133.184/TileService/vector.aspx?projection=bing&styleset=map&x={x}&y={y}&z={z}&layers=osm_land,osm_landuse,osm_water,osm_buildings,osm_roads,osm_road_names,osm_place_names', {
                // L.tileLayer('http://supt04.cis.fiu.edu/osm_tiles2/{z}/{x}/{y}.png', {
                //  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                maxZoom: 16
            }).addTo(currentmap);


            return currentmap;
        },

        addResultsToolBar : function() {

            L.Control.Command = L.Control.extend({
                options: {
                    position: 'topright',
                },
                onAdd: function (map) {
                    var div = L.DomUtil.create('div', 'command');

                    div.innerHTML = '<div style="background-color:white" ><form><input id="command" type="checkbox" outline: 1px solid red;  checked/>&nbspupdate while I move map</form><div>';
                    div.onclick = function(){
                        var checked = document.getElementById ("command").checked;
                        searchAsDrag = checked;
                    }
                    return div;
                }
            });

            var checkbox = new L.Control.Command();
            map.addControl(checkbox);

            L.Control.EditBtn = L.Control.extend(
            {
                options:
                {
                    position: 'bottomleft',
                },
                onAdd: function (map) {
                    //eaflet-control
                    var container = L.DomUtil.create('div', 'leaflet-bar lleaflet-control-custom leaflet-draw-edit-remove');

                    container.style.backgroundColor = 'rgba(0,0,0,0)';
                    container.style.backgroundImage = "url(../images/map/draw.png)";
                    container.style.backgroundSize = "40px 40px";
                    container.style.width = '40px';
                    container.style.height = '40px';
                    container.style.border = '0px';
                    container.style.shadowUrl= '../images/map/draw_cancel.png';
                    container.style.shadowSize= [68, 95];
                    container.style.shadowAnchor= [22, 94];

                    container.onclick = function(){
                        _startEditInMap();
                        map.removeControl(startEditBtn);
                        map.addControl(endEditBtn);
                    }
                    container.onmouseover = function(){
                        container.style.backgroundImage = "url(../images/map/draw.png)";
                    }
                    container.onmouseout = function(){
                        container.style.backgroundImage = "url(../images/map/draw.png)";
                    }
                    return container;
                }
            });
            startEditBtn = new L.Control.EditBtn();
            map.addControl(startEditBtn);

            L.Control.EndEditBtn = L.Control.extend(
            {
                options:
                {
                    position: 'bottomleft',
                },
                onAdd: function (map) {
                    //eaflet-control
                    var container = L.DomUtil.create('div', 'leaflet-bar lleaflet-control-custom leaflet-draw-edit-remove');

                    container.style.backgroundColor = 'rgba(0,0,0,0)';
                    container.style.backgroundImage = "url(../images/map/draw_cancel.png)";
                    container.style.backgroundSize = "40px 40px";
                    container.style.width = '40px';
                    container.style.height = '40px';
                    container.style.border = '0px'

                    container.onclick = function(){
                        _endEditInMap();
                        map.removeControl(endEditBtn);
                        map.addControl(startEditBtn)
                    }
                    return container;
                }
            });
            endEditBtn = new L.Control.EndEditBtn();


            L.control.zoom({
                position:'topright',
            }).addTo(map);

            var mapBound = map.getBounds();
            mapTopRightPoint = map.latLngToContainerPoint(mapBound._northEast);
            mapBottomLeftPoint = map.latLngToContainerPoint(mapBound._southWest);
            map.createPane('polygon');
            map.getPane('polygon').style.zIndex = 290;
            map.getPane('polygon').className = "map-polygonblend leaflet-pane leaflet-polygon-pane ";

        },


        addPropertiesIntoClusters : function(_properties) {
            properties = _properties.slice(0);
            properties.forEach(function(property) {
                // if (property.locationPoint !== null) {
                    // property.coords = new L.LatLng(property.locationPoint.latitude, property.locationPoint.longitude);


                // var lat = (Math.random() * (25.59 - 25.89) + 25.89).toFixed(4);
                // var lon = (Math.random() * (-80.47 + 80.12) -80.12).toFixed(4);
                // console.log(lat, lon)
                property.coords = new L.LatLng(property.locationPoint.latitude, property.locationPoint.longitude);
                // console.log(property.locationPoint)
                mapServiceApi.addPropertyToClusterGroup(property.coords, property);
                // }
            })
            this.initClustersData();
            _onPropertyDbClick();
            _onPropertyClick();
            _onClusterDbClick();
            _onClusterClick();
            _onPropertyOver();
            _onClusterOver();
            _onPropertyOut();
            _onClusterOut();
            _refreshClusterIcons();
        },


        // START Add Schools to Details Page Map:amoha083@fiu.edu
        addSchools : function([lat,lon], school, map) {
            
            var myIcon = L.icon({
                iconUrl: "../images/detail/school_icon.png",
                iconSize: [18, 20],
                });
                
            var schoolmarker = L.marker([lat,lon]).addTo(map);
            schoolmarker.setIcon(myIcon);
            schoolmarker.on('mouseover', function(e) {
                var popup = L.popup()
                    .setLatLng([lat,lon])
                    .setContent("<b>"+school.institutionName+"</b>("+school.type+")<br>"
                                +"Rating:&nbsp;"+school.rank+"<br>"
                                +"GradeLevels:&nbsp;"+school.gradeLevels+"<br>"
                                +"Address:&nbsp;"+school.streetAddress)
                    .openOn(map);
            });
            return schoolmarker;
        },
        // END Add Schools to Details Page Map:amoha083@fiu.edu


        /**
        * Add a property to the cluster group.
        *
        * @param {L.LatLng} latLng point of the property
        * @param {*} property the property to add to the map
        */
        addPropertyToClusterGroup : function(latLng, property) {
            // console.log("!!",property)
            var priceLabelText = _getFormattedPropertyCost(property.currentPrice);


            var CustomMarker = L.Marker.extend({
                options: {
                    property: property
                }
            });

            var propertyMarker = new CustomMarker(latLng);
            _setPropertyIcon(propertyMarker);
            propertyMarker.options.property = property;
            _propertyMarkerClusterGroup.addLayer(propertyMarker);
            if(!map.hasLayer(_propertyMarkerClusterGroup)){
                console.log("call")
                map.addLayer(_propertyMarkerClusterGroup);
            }
        },

        clearAllPropertiesLayer : function() {
            _propertyMarkerClusterGroup.eachLayer((layer) => {
                    _propertyMarkerClusterGroup.removeLayer(layer);
            });

        },

        // START proximity search:acris005@fiu.edu

        // name: getPosition
        // goal: convert property PointField to (Latitude, Longitude)
        // help: PointFields are (Longitude, Latitude) and this is not standard
        getPosition: function(locationPoint) {
            var lat = locationPoint.latitude;
            var lng = locationPoint.longitude;
            var position = new L.LatLng(lat, lng);

            return position
        },

        // END proximity search

        getUserGeolocation: function() {
            if(navigator.geolocation) {
                var options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                };
                // console.log("geolocation", navigator.geolocation)
                navigator.geolocation.getCurrentPosition( function(position) {
                    // Get the coordinates of the current possition
                    // Map.userLocation = position;
                    return userLocation;
                    // map.setView(new L.LatLng(coords[0], coords[1])
                }, function(err) {
                    return userLocation;
                }, options);

            }
            return userLocation;
        },

        // START proximity search:acris005@fiu.edu

        // name: moveCurrentMapTo
        // goal: moves current map, in this case the results map, to new origin
        moveCurrentMapTo: function(position) {
          if (!map) {
            return;
          }
          map.panTo(position);
        },

        // END proximity search

        MoveMapTo: function(currentMap, position) {
            if(!currentMap) {
                return;
            }
            currentMap.panTo(position );
        },

        zoomMap: function(currentMap, zoom) {
            currentMap.setZoom(zoom)
        },

/*START Neighborhood Amenities : adubu002@fiu.edu*/
        encompassPoints: function(currentMap, coords){
            var bounds = new L.LatLngBounds(coords);
            currentMap.fitBounds(bounds);
        },
/*END Neighborhood Amenities */

        getMapBounds: function() {
            var bounds = map.getBounds();
            var topRight = bounds._northEast;
            var bottomLeft = bounds._southWest;

            var boundsArray = [[topRight.lng, topRight.lat],
            [topRight.lng, bottomLeft.lat],
            [bottomLeft.lng, bottomLeft.lat],
            [bottomLeft.lng, topRight.lat],
            [topRight.lng, topRight.lat]];

            var boundsPolygon = {
                "type": "Polygon",
                "coordinates": [boundsArray]
            };
            if(editPolygonString != null && editPolygonString.length > 2) {

                var intersections = _intersectPolygons(editPolygonList.features, boundsPolygon);
                return JSON.stringify(intersections[0].geometry);
            }
            else {
                return JSON.stringify(boundsPolygon);
            }
        },

        showMarkersWithImage: function(currentmap, coords, imageUrl) {
            // console.log("!!!", currentmap, coords[0][1], coords[0][0])
            if(currentmap == null || coords == null || coords.length <= 0 || coords[0] == undefined || coords[0].length != 2) {
                return;
            }
            var markers = [];
            currentmap.setView(new L.LatLng(coords[0][0], coords[0][1]), defaultLevel );
            var icon = L.icon({
                iconUrl: imageUrl,
                iconSize: [18, 18],
                iconAnchor: [9, 9],
            });
            for(var i = 0; i < coords.length; i++) {
                var marker = L.marker(new L.LatLng(coords[i][0], coords[i][1])).addTo(currentmap);
                if(imageUrl != undefined && imageUrl != null && imageUrl != "") {
                    marker.setIcon(icon);
                }
                markers.push(marker);
            }
            return markers;
        },

        showMarkersWithNumber: function(currentmap, coords, popups) {
            // console.log("!!!", currentmap, coords[0][1], coords[0][0])
            if(currentmap == null || coords == null || coords.length <= 0 || coords[0] == undefined || coords[0].length != 2) {
                return;
            }
            var markers = [];
            // currentmap.setView(new L.LatLng(coords[0][0], coords[0][1]), defaultLevel );
            for(var i = 0; i < coords.length; i++) {
                var marker = L.marker(new L.LatLng(coords[i][0], coords[i][1])).addTo(currentmap);

                var divIcon = L.divIcon({
                className: 'map-markernumber ',
                iconAnchor : [8, 8],
                iconSize:[16, 16],
                popupAnchor : [8, 8],
                html: (i+1).toString() });
                if(popups[i]){
                    var customOptions =
                    {
                    'maxWidth': '400',
                    'width': '200',
                    'className' : 'map-custompopup'
                    }
                    marker.bindPopup(popups[i], customOptions);
                    marker.on('mouseover', function (e) {
                        this.openPopup();
                    });
                }
                marker.setIcon(divIcon);
                markers.push(marker);
            }
            console.log('select');
            return markers;
        },

/*START Neighborhood Amenities : adubu002@fiu.edu*/
        selectMarkerWithNumber: function(currentmap, coords, popups, amenities) {
            // console.log("!!!", currentmap, coords[0][1], coords[0][0])
            if(currentmap == null || coords == null || coords.length <= 0 || coords[0] == undefined || coords[0].length != 2) {
                return;
            }
            var markers = [];
            // currentmap.setView(new L.LatLng(coords[0][0], coords[0][1]), defaultLevel );
            for(var i = 0; i < coords.length; i++) {
                if(!amenities[i].check){
                  var marker = L.marker(new L.LatLng(coords[i][0], coords[i][1])).addTo(currentmap);
                  var divIcon = L.divIcon({
                  className: 'map-markernumber ',
                  iconAnchor : [8, 8],
                  iconSize:[16, 16],
                  popupAnchor : [8, 8],
                  html: (i+1).toString() });
                }
                else{
                  var marker = L.marker(new L.LatLng(coords[i][0], coords[i][1]), { zIndexOffset : 1000 }).addTo(currentmap);
                  var divIcon = L.divIcon({
                  className: 'map-selectmarkernumber ',
                  iconAnchor : [8, 8],
                  iconSize:[16, 16],
                  popupAnchor : [8, 8],
                  html: (i+1).toString() });
                }
                if(popups[i]){
                    var customOptions =
                    {
                    'maxWidth': '400',
                    'width': '200',
                    'className' : 'map-custompopup'
                    }
                    marker.bindPopup(popups[i], customOptions);
                    marker.on('mouseover', function (e) {
                        this.openPopup();
                    });
                }
                marker.setIcon(divIcon);
                markers.push(marker);
            }
            return markers;
        },
/* END Neighborhood Amenities */

        removeMarkers(currentMap, markers) {
            for(var i = 0; i < markers.length; i++ ) {
                currentMap.removeLayer(markers[i]);
            }
        },

        //Neighborhood Indexes: Draw Crimes Circle on map
        drawCircleOnMap(currentMap, lat, lon, rad, rating) {
          var groupCircle = L.featureGroup();
          var lineColor = '';
          var fillerColor = '';

          if (rating == 'Unavailable') {
            lineColor = '#103f52';
            fillerColor = '#175e7a';
          } else if (rating == 'Low') {
            lineColor = '#449a3c';
            fillerColor = '#72fb66';
          } else if (rating == 'Medium') {
            lineColor = '#b18e23';
            fillerColor = '#faca39';
          } else if (rating == 'High') {
            lineColor = '#a73d3d';
            fillerColor = '#ff5d5d';
          }

          var circle = L.circle([lat, lon], {
            color: lineColor,
            fillColor: fillerColor,
            fillOpacity: 0.5,
            radius: rad * 1609.34,
          }).addTo(groupCircle);
          currentMap.addLayer(groupCircle);
          return groupCircle;
        },

        //Neighborhood Indexes: Remove Crimes Circle on map
        removeCircle(currentMap, layer) {
          if (layer != undefined) {
            currentMap.removeLayer(layer);
          }
        },

        removeMarkers(currentMap, markers) {
          for (var i = 0; i < markers.length; i++) {
            currentMap.removeLayer(markers[i]);
          }
        },

        //Neighborhood Indexes: Add Crimes legend on map
        addLegendOnMap(title, symbology) {
          var legend = L.control({
            position: 'bottomright'
          });

          legend.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += "<strong>" + title + "</strong><br><br>"
            for (var i = 0; i < symbology.length; i++) {
              div.innerHTML += "<div>" +
                "<img src='" + symbology[i].icon + "' height='30' width='30'>" +
                "&emsp;" + symbology[i].name + "</div>";
            }
            return div;
          };

          return legend;
        },

        //Neighborhood Indexes: Draw Hazard Zone on Map
        drawCountyOnMap(currentMap, county, countyPolygons, rating) {
          var groupPolygon = L.featureGroup();
          var lineColor = '';
          var fillerColor = '';

          if (rating == 'Unavailable') {
            lineColor = '#103f52';
            fillerColor = '#175e7a';
          } else if (rating == 'Low') {
            lineColor = '#449a3c';
            fillerColor = '#72fb66';
          } else if (rating == 'Medium') {
            lineColor = '#b18e23';
            fillerColor = '#faca39';
          } else if (rating == 'High') {
            lineColor = '#a73d3d';
            fillerColor = '#ff5d5d';
          }

          var countyPolygon = L.geoJson(countyPolygons, {
            style: {
              color: lineColor,
              fillColor: fillerColor,
              fillOpacity: 0.5,
            }
          }).addTo(groupPolygon);
          currentMap.addLayer(groupPolygon);
          return groupPolygon;
        },

        //Neighborhood Indexes: Remove Hazard County from Map
        removeCounty(currentMap, layer) {
          if (layer != undefined) {
            currentMap.removeLayer(layer);
          }
        },

        distance(item1, item2) {
            return _distance(item1.lat, item1.lng, item2.lat, item2.lng)/1.609344;
        },
        //BEGIN PoLR (Juan) Map Layer Implementation
        geoAddress: function () {

            if ($rootScope.PoLR != null) {
                isochrone != null ? map.removeLayer(isochrone) : null;
                isochroneOriginMarker != null ? map.removeLayer(isochroneOriginMarker) : null;

                map.setView(new L.LatLng($rootScope.PoLR.originGeocode[0],$rootScope.PoLR.originGeocode[1]), 12);

                isochroneOriginMarker = L.marker($rootScope.PoLR.originGeocode).addTo(map);
                isochrone = L.polygon([$rootScope.PoLR.isochrone]).addTo(map);
            }
            else {
                isochrone != null ? map.removeLayer(isochrone) : null;
                isochroneOriginMarker != null ? map.removeLayer(isochroneOriginMarker) : null;
            }
        }
        //END PoLR (Juan) Map Layer Implementation
    };
    return mapServiceApi;
});
