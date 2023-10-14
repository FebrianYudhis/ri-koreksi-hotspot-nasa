function isPointInPolygon(point, polygon) {
    var x = point[0];
    var y = point[1];
    var inside = false;
    var j = polygon.length - 1;

    for (var i = 0; i < polygon.length; i++) {
        var xi = polygon[i][0];
        var yi = polygon[i][1];
        var xj = polygon[j][0];
        var yj = polygon[j][1];

        var intersect = (yi > y) != (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

        if (intersect) {
            inside = !inside;
        }

        j = i;
    }

    return inside;
}

fetch("DesaKelurahan.json").then(res => res.json()).then(dataDesaKelurahan => {
    fetch("Hotspot.json").then(res => res.json()).then(dataHotspot => {
        let dataHasil = [];
        dataHasil = dataHotspot.map(hotspot => {
            const point = [hotspot.bujur, hotspot.lintang];
            const matchingFeature = dataDesaKelurahan.features.find((feature) => {
                if (feature.geometry.type == "MultiPolygon") {
                    for (const polygon of feature.geometry.coordinates) {
                        if (isPointInPolygon(point, polygon[0])) {
                            return true;
                        }
                    }
                } else if (feature.geometry.type == "Polygon") {
                    return isPointInPolygon(point, feature.geometry.coordinates[0]);
                }
            });
            if (matchingFeature) {
                matchingFeature.properties['provinsi'] = "Kalimantan Tengah";
                return {
                    'Asli': hotspot,
                    'Lokasi': matchingFeature.properties
                };
            }

            return null;
        }).filter(result => result !== null);

        fetch("hotspot.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataHasil)
        }).then(res => res.text()).then(result => {
            window.location.href = "data.html";
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}).catch(err => console.log(err));