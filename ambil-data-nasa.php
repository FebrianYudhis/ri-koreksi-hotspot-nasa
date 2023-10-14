<?php

use Carbon\Carbon;

require_once "vendor/autoload.php";

function formatWaktu($angka)
{
    return sprintf("%02d:%02d", floor($angka / 100), $angka % 100);
}

$apiKey = "89275c04599d72c243265b5a6438f0d5";
$koordinatArea = "110.44281629391048,-4.0077437822672834,116.44650187043783,1.4224889112231267";
$url = "https://firms.modaps.eosdis.nasa.gov/api/area/csv/";
$hitungBaris = 0;

$jarakHari = $_POST['rentangHari'];
$tanggal = $_POST['tanggalHotspot'];

$alamatUrlPertama = $url . '/' . $apiKey . '/MODIS_NRT/' . $koordinatArea . '/' . $jarakHari . '/' . $tanggal;
$dataMentahPertama = file_get_contents($alamatUrlPertama);
$pecahDataMentahPertama = explode("\n", $dataMentahPertama);

foreach (array_slice($pecahDataMentahPertama, 1) as $data) {
    $dataPecah[$hitungBaris] = explode(",", $data);

    $confidence = @$dataPecah[$hitungBaris][9];
    if ($confidence >= 0 && $confidence <= 29) {
        $tingkatKepercayaan = 7;
    } else if ($confidence >= 30 && $confidence <= 79) {
        $tingkatKepercayaan = 8;
    } else if ($confidence >= 80 && $confidence <= 100) {
        $tingkatKepercayaan = 9;
    }

    $tanggal_utc = @$dataPecah[$hitungBaris][5];
    $waktu_utc = formatWaktu(@$dataPecah[$hitungBaris][6]);
    $buatWaktu = Carbon::createFromFormat('Y-m-d H:i', $tanggal_utc . ' ' . $waktu_utc, 'UTC');
    $buatWaktu->addHours(7);

    if ($buatWaktu->format('H') > 5 && $buatWaktu->format('H') < 18) {
        $kejadianApi = "Siang";
    } else {
        $kejadianApi = "Malam";
    }

    $dataCSV[] = [
        "bujur" => @$dataPecah[$hitungBaris][1],
        "lintang" => @$dataPecah[$hitungBaris][0],
        "kepercayaan" => $tingkatKepercayaan,
        "satelit" => @$dataPecah[$hitungBaris][7],
        "tanggal_utc" => $tanggal_utc,
        "waktu_utc" => $waktu_utc,
        'tanggal_wib' => $buatWaktu->format('Y-m-d'),
        'waktu_wib' => $buatWaktu->format('H:i'),
        'kejadian_api' => $kejadianApi,
    ];
};


$alamatUrlKedua = $url . '/' . $apiKey . '/VIIRS_NOAA20_NRT/' . $koordinatArea . '/' . $jarakHari . '/' . $tanggal;
$dataMentahKedua = file_get_contents($alamatUrlKedua);
$pecahDataMentahKedua = explode("\n", $dataMentahKedua);

foreach (array_slice($pecahDataMentahKedua, 1) as $data) {
    $dataPecah[$hitungBaris] = explode(",", $data);

    $confidence = @$dataPecah[$hitungBaris][9];
    if ($confidence == "l") {
        $tingkatKepercayaan = 7;
    } else if ($confidence == "n") {
        $tingkatKepercayaan = 8;
    } else if ($confidence == "h") {
        $tingkatKepercayaan = 9;
    }

    $tanggal_utc = @$dataPecah[$hitungBaris][5];
    $waktu_utc = formatWaktu(@$dataPecah[$hitungBaris][6]);
    $buatWaktu = Carbon::createFromFormat('Y-m-d H:i', $tanggal_utc . ' ' . $waktu_utc, 'UTC');
    $buatWaktu->addHours(7);

    if ($buatWaktu->format('H') > 5 && $buatWaktu->format('H') < 18) {
        $kejadianApi = "Siang";
    } else {
        $kejadianApi = "Malam";
    }

    $dataCSV[] = [
        "bujur" => @$dataPecah[$hitungBaris][1],
        "lintang" => @$dataPecah[$hitungBaris][0],
        "kepercayaan" => $tingkatKepercayaan,
        "satelit" => "NOAA20",
        "tanggal_utc" => $tanggal_utc,
        "waktu_utc" => $waktu_utc,
        'tanggal_wib' => $buatWaktu->format('Y-m-d'),
        'waktu_wib' => $buatWaktu->format('H:i'),
        'kejadian_api' => $kejadianApi,
    ];
};



$alamatUrlKetiga = $url . '/' . $apiKey . '/VIIRS_SNPP_NRT/' . $koordinatArea . '/' . $jarakHari . '/' . $tanggal;
$dataMentahKetiga = file_get_contents($alamatUrlKetiga);
$pecahDataMentahKetiga = explode("\n", $dataMentahKetiga);

foreach (array_slice($pecahDataMentahKetiga, 1) as $data) {
    $dataPecah[$hitungBaris] = explode(",", $data);

    $confidence = @$dataPecah[$hitungBaris][9];
    if ($confidence == "l") {
        $tingkatKepercayaan = 7;
    } else if ($confidence == "n") {
        $tingkatKepercayaan = 8;
    } else if ($confidence == "h") {
        $tingkatKepercayaan = 9;
    }

    $tanggal_utc = @$dataPecah[$hitungBaris][5];
    $waktu_utc = formatWaktu(@$dataPecah[$hitungBaris][6]);
    $buatWaktu = Carbon::createFromFormat('Y-m-d H:i', $tanggal_utc . ' ' . $waktu_utc, 'UTC');
    $buatWaktu->addHours(7);

    if ($buatWaktu->format('H') > 5 && $buatWaktu->format('H') < 18) {
        $kejadianApi = "Siang";
    } else {
        $kejadianApi = "Malam";
    }

    $dataCSV[] = [
        "bujur" => @$dataPecah[$hitungBaris][1],
        "lintang" => @$dataPecah[$hitungBaris][0],
        "kepercayaan" => $tingkatKepercayaan,
        "satelit" => "SNPP",
        "tanggal_utc" => $tanggal_utc,
        "waktu_utc" => $waktu_utc,
        'tanggal_wib' => $buatWaktu->format('Y-m-d'),
        'waktu_wib' => $buatWaktu->format('H:i'),
        'kejadian_api' => $kejadianApi,
    ];
};

if (!isset($dataCSV)) {
    session_start();
    $_SESSION['pesan'] = "Data Tidak Ditemukan.";
    header("Location: form-ambil-data-nasa.php");
}

$randomFileName = 'downloads/' . uniqid() . '-data-nasa.csv';
$file = fopen($randomFileName, 'w');

fputcsv($file, array_keys($dataCSV[0]));
foreach ($dataCSV as $data) {
    fputcsv($file, $data);
}

fclose($file);
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <title>Download Data</title>
    <style>
        html {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
    </style>
</head>

<body>
    <div class="container mt-4">
        <div class="card">
            <div class="card-header">
                Download Data Dari NASA
            </div>
            <div class="card-body">
                <a href="<?= $randomFileName; ?>" class="btn btn-info w-100"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                    </svg> Download <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                    </svg>
                </a>
                <div class="card mt-4">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-sm-12 mb-2">
                                <a href="/" class="btn btn-primary w-100">Menu Utama</a>
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <a href="form-ambil-data-nasa.php" class="btn btn-success w-100">Ambil Data Baru</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>