var map = L.map('map').setView([-2.501559, 112.975486], 13);
const urlParams = new URLSearchParams(window.location.search);

var menu = L.control({ position: "topright" });
menu.onAdd = function (map) {
    var div = L.DomUtil.create("div");
    div.innerHTML =
        '<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#opsi"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg> Opsi</button>';
    return div;
};
menu.addTo(map);

var defaultLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }
).addTo(map);

var terrainLayer = L.tileLayer(
    "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
);

var satelliteLayer = L.tileLayer(
    "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
);

var baseMaps = {
    Default: defaultLayer,
    Blank: L.tileLayer(""),
    Terrain: terrainLayer,
    Satelit: satelliteLayer,
};

L.control.groupedLayers(baseMaps).addTo(map);

function hotspotClicked(
    bujur,
    lintang,
    kepercayaan,
    tanggal,
    waktu,
    kabupaten,
    kecamatan,
    kelurahan,
    satelit,
    kejadianApi
) {
    return function () {
        if (kepercayaan == 7) {
            kepercayaan = "Rendah (7)";
        } else if (kepercayaan == 8) {
            kepercayaan = "Menengah (8)";
        } else if (kepercayaan == 9) {
            kepercayaan = "Tinggi (9)";
        }

        L.popup()
            .setLatLng([lintang, bujur])
            .setContent(
                `<b>Kepercayaan: </b>${kepercayaan}<br>
                            <b>Tanggal: </b>${tanggal}<br>
                            <b>Waktu: </b>${waktu}<br>
                            <b>Kabupaten: </b>${kabupaten}<br>
                            <b>Kecamatan: </b>${kecamatan}<br>
                            <b>Kecamatan: </b>${kelurahan}<br>
                            <b>Satelit: </b>${satelit}<br>
                            <b>Kejadian Api: </b>${kejadianApi}<br>
                            <a href="https://www.google.com/maps/search/?api=1&query=${lintang},${bujur}" target="_blank">Lihat di Google Maps</a>`
            )
            .openOn(map);
    };
}

const geoJSONLayerGroup = L.layerGroup();
fetch("Kabupaten.json")
    .then(response => response.json())
    .then((data) => {

        var garisKabupaten = localStorage.getItem('garisKabupaten') == null ? 0.2 : localStorage.getItem('garisKabupaten');
        document.getElementById('garisKabupaten').value = garisKabupaten;

        var geoJSONDataKabupaten = L.geoJSON(data, {
            style: {
                fillColor: "#000",
                fillOpacity: 0,
                weight: garisKabupaten,
                opacity: 1,
                color: "#964b00",
            },
        });
        geoJSONLayerGroup.addLayer(geoJSONDataKabupaten);

        document.getElementById('garisKabupaten').addEventListener('change', function () {
            var garisKabupaten = this.value;
            localStorage.setItem('garisKabupaten', garisKabupaten);
            geoJSONDataKabupaten.setStyle({ weight: garisKabupaten });
        });

        fetch("DesaKelurahan.json")
            .then(response => response.json())
            .then((data) => {

                var garisDesaKelurahan = localStorage.getItem('garisDesaKelurahan') == null ? 0.1 : localStorage.getItem('garisDesaKelurahan');
                document.getElementById('garisDesaKelurahan').value = garisDesaKelurahan;

                var geoJSONDataDesaKelurahan = L.geoJSON(data, {
                    style: {
                        fillColor: "#000",
                        fillOpacity: 0,
                        weight: garisDesaKelurahan,
                        opacity: 1,
                        color: "#000",
                    },
                    onEachFeature: function (feature, layer) {
                        var propertiesTable = '<table>';
                        propertiesTable += '<tr><th>Nama Kabupaten</th><td>:</td><td>' + feature.properties.namaKabupaten + '</td></tr>';
                        propertiesTable += '<tr><th>Nama Kecamatan</th><td>:</td><td>' + feature.properties.namaKecamatan + '</td></tr>';
                        propertiesTable += '<tr><th>Nama Kelurahan</th><td>:</td><td>' + feature.properties.namaKelurahan + '</td></tr>';
                        propertiesTable += '</table>';
                        layer.bindPopup(propertiesTable);
                    }
                });

                geoJSONLayerGroup.addLayer(geoJSONDataDesaKelurahan);
                map.addLayer(geoJSONLayerGroup);

                document.getElementById('garisDesaKelurahan').addEventListener('change', function () {
                    var garisDesaKelurahan = this.value;
                    localStorage.setItem('garisDesaKelurahan', garisDesaKelurahan);
                    geoJSONDataDesaKelurahan.setStyle({ weight: garisDesaKelurahan });
                });

                fetch('HotspotKoreksi.json')
                    .then(response => response.json())
                    .then((data) => {
                        if ((urlParams.has('lat') && urlParams.has('long')) && !urlParams.has('all')) {
                            const lat = parseFloat(urlParams.get('lat'));
                            const long = parseFloat(urlParams.get('long'));
                            var dataSatuanHotspot = data.filter(item => item.Asli.lintang == lat && item.Asli.bujur == long);
                            try {
                                map.setView([dataSatuanHotspot[0].Asli.lintang, dataSatuanHotspot[0].Asli.bujur], 13);
                                const marker = L.marker([dataSatuanHotspot[0].Asli.lintang, dataSatuanHotspot[0].Asli.bujur]).addTo(map);
                                var dataPropertiHotspot = '<table>';
                                dataPropertiHotspot += '<tr><th>Tanggal</th><td>:</td><td>' + dataSatuanHotspot[0].Asli.tanggal + '</td></tr>';
                                dataPropertiHotspot += '<tr><th>Waktu</th><td>:</td><td>' + dataSatuanHotspot[0].Asli.waktu + '</td></tr>';
                                dataPropertiHotspot += '<tr><th>Nama Kabupaten</th><td>:</td><td>' + dataSatuanHotspot[0].Lokasi.namaKabupaten + '</td></tr>';
                                dataPropertiHotspot += '<tr><th>Nama Kecamatan</th><td>:</td><td>' + dataSatuanHotspot[0].Lokasi.namaKecamatan + '</td></tr>';
                                dataPropertiHotspot += '<tr><th>Nama Kelurahan</th><td>:</td><td>' + dataSatuanHotspot[0].Lokasi.namaKelurahan + '</td></tr>';
                                dataPropertiHotspot += '<tr><th>Tingkat Kepercayaan</th><td>:</td><td>' + dataSatuanHotspot[0].Asli.kepercayaan + '</td></tr>';
                                dataPropertiHotspot += '<tr><th>Satelit</th><td>:</td><td>' + dataSatuanHotspot[0].Asli.satelit + '</td></tr>';
                                dataPropertiHotspot += '</table>'
                                marker.bindPopup(dataPropertiHotspot).openPopup();
                            } catch (e) {
                                Swal.fire(
                                    'Error !',
                                    'Data Tidak Ditemukan',
                                    'warning'
                                )
                            }

                            document.getElementById('inputRadiusHotspot').remove();
                            document.getElementById('inputPilihanDaerah').remove();
                        }


                        if (urlParams.has('all') && urlParams.get('all') == "true") {
                            var radiusHotspot = localStorage.getItem('radiusHotspot') == null ? 4 : localStorage.getItem('radiusHotspot');
                            document.getElementById('radiusHotspot').value = radiusHotspot;

                            var dataJumlahHotspot = { rendah: 0, menengah: 0, tinggi: 0, total: 0 };
                            var kabupatenList = new Set();
                            data.forEach(item => {
                                kabupatenList.add(item.Lokasi.namaKabupaten);
                            });

                            var optionElement = document.createElement("option");
                            optionElement.value = "all";
                            optionElement.textContent = "Semua Kabupaten";
                            document.getElementById('pilihanDaerah').appendChild(optionElement);

                            kabupatenList.forEach(item => {
                                const optionElement = document.createElement("option");
                                optionElement.value = item;
                                optionElement.textContent = item;
                                document.getElementById('pilihanDaerah').appendChild(optionElement);
                            });

                            function setTampilanKabupaten(arrayData, ukuranRadiusHotspot) {
                                dataJumlahHotspot.total = 0;
                                dataJumlahHotspot.rendah = 0;
                                dataJumlahHotspot.menengah = 0;
                                dataJumlahHotspot.tinggi = 0;

                                arrayData.forEach(item => {
                                    dataJumlahHotspot.total += 1;
                                    var color;
                                    if (item.Asli.kepercayaan == 7) {
                                        dataJumlahHotspot.rendah += 1;
                                        color = "green";
                                    } else if (item.Asli.kepercayaan == 8) {
                                        dataJumlahHotspot.menengah += 1;
                                        color = "orange";
                                    } else if (item.Asli.kepercayaan == 9) {
                                        dataJumlahHotspot.tinggi += 1;
                                        color = "red";
                                    }

                                    var circleMarker = L.circleMarker([item.Asli.lintang, item.Asli.bujur], {
                                        color: color,
                                        fillColor: color,
                                        fillOpacity: 1.0,
                                        radius: ukuranRadiusHotspot,
                                    }).addTo(map);

                                    circleMarker.on(
                                        "click",
                                        hotspotClicked(
                                            item.Asli.bujur,
                                            item.Asli.lintang,
                                            item.Asli.kepercayaan,
                                            item.Asli.tanggal,
                                            item.Asli.waktu,
                                            item.Lokasi.namaKabupaten,
                                            item.Lokasi.namaKecamatan,
                                            item.Lokasi.namaKelurahan,
                                            item.Asli.satelit,
                                            item.Asli.kejadian_api,
                                        )
                                    );
                                });
                            }

                            setTampilanKabupaten(data, radiusHotspot);

                            var keteranganHotspot = L.control({ position: "bottomleft" });
                            keteranganHotspot.onAdd = function (map) {
                                var div = L.DomUtil.create("div");
                                div.innerHTML = `
                                    <ul class="list-group">
                                        <li class="list-group-item fw-bold bg-secondary" id="jumlahHotspotKeseluruhan">
                                            Terdapat ${dataJumlahHotspot.total} Titik Panas Keseluruhan
                                        </li>
                                        <li class="list-group-item fw-bold bg-danger" id="jumlahHotspotTinggi">
                                            Terdapat Terdapat ${dataJumlahHotspot.tinggi} Titik Panas Tinggi
                                        </li>
                                        <li class="list-group-item fw-bold bg-warning" id="jumlahHotspotMenengah">
                                            Terdapat ${dataJumlahHotspot.menengah} Titik Panas Menengah
                                        </li>
                                        <li class="list-group-item fw-bold bg-success" id="jumlahHotspotRendah">
                                            Terdapat ${dataJumlahHotspot.rendah} Titik Panas Rendah
                                        </li>
                                    </ul>
                                `;
                                return div;
                            };
                            keteranganHotspot.addTo(map);

                            var legendHotspot = L.control({ position: "bottomleft" });
                            legendHotspot.onAdd = function (map) {
                                var el = L.DomUtil.create("div", "legendHotspot");
                                el.innerHTML += '<img style="height: 10vh" src="assets/legenda_hotspot.png">';
                                return el;
                            };
                            legendHotspot.addTo(map);

                            document.getElementById('radiusHotspot').addEventListener('change', function () {
                                var radiusHotspot = parseInt(this.value);
                                localStorage.setItem('radiusHotspot', radiusHotspot);
                                map.eachLayer(function (layer) {
                                    if (layer instanceof L.CircleMarker) {
                                        layer.setRadius(radiusHotspot);
                                    }
                                });
                            });

                            document.getElementById('pilihanDaerah').addEventListener('change', function () {
                                map.eachLayer(function (layer) {
                                    if (layer instanceof L.CircleMarker) {
                                        map.removeLayer(layer);
                                    }
                                });

                                var pilihanDaerah = document.getElementById('pilihanDaerah').value;
                                if (pilihanDaerah == "all") {
                                    setTampilanKabupaten(data, radiusHotspot);
                                    document.getElementById('jumlahHotspotKeseluruhan').textContent = `Terdapat ${dataJumlahHotspot.total} Titik Panas Keseluruhan`;
                                    document.getElementById('jumlahHotspotTinggi').textContent = `Terdapat ${dataJumlahHotspot.tinggi} Titik Panas Tinggi`;
                                    document.getElementById('jumlahHotspotMenengah').textContent = `Terdapat ${dataJumlahHotspot.menengah} Titik Panas Menengah`;
                                    document.getElementById('jumlahHotspotRendah').textContent = `Terdapat ${dataJumlahHotspot.rendah} Titik Panas Rendah`;
                                } else {
                                    dataDaerahSeleksi = [];
                                    data.forEach(item => {
                                        if (item.Lokasi.namaKabupaten == pilihanDaerah) {
                                            dataDaerahSeleksi.push(item);
                                        }
                                    });
                                    setTampilanKabupaten(dataDaerahSeleksi, radiusHotspot);
                                    document.getElementById('jumlahHotspotKeseluruhan').textContent = `Terdapat ${dataJumlahHotspot.total} Titik Panas Keseluruhan`;
                                    document.getElementById('jumlahHotspotTinggi').textContent = `Terdapat ${dataJumlahHotspot.tinggi} Titik Panas Tinggi`;
                                    document.getElementById('jumlahHotspotMenengah').textContent = `Terdapat ${dataJumlahHotspot.menengah} Titik Panas Menengah`;
                                    document.getElementById('jumlahHotspotRendah').textContent = `Terdapat ${dataJumlahHotspot.rendah} Titik Panas Rendah`;
                                }
                            });
                        }
                    });
            });
    });