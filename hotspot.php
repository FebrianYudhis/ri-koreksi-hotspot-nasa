<?php
$dataJSON = file_get_contents('php://input');
$data = json_decode($dataJSON);
if ($data) {
    $namaFile = 'HotspotKoreksi.json';

    $hasilJSON = json_encode($data);
    file_put_contents($namaFile, $hasilJSON);
} else {
    echo "Data Tidak Valid Atau Tidak Ada Data Yang Dikirimkan.";
}
