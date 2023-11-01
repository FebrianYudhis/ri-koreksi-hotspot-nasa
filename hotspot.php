<?php
$dataJSON = file_get_contents('php://input');
$data = json_decode($dataJSON);
$namaFile = 'HotspotKoreksi.json';

if ($data) {
    $hasilJSON = json_encode($data);
    file_put_contents($namaFile, $hasilJSON);
} else {
    file_put_contents($namaFile, '');
    echo "Data Tidak Valid Atau Tidak Ada Data Yang Dikirimkan.";
}
