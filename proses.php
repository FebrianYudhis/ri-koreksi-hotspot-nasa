<?php
session_start();
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/toastify.min.css">
    <script src="assets/js/toastify-js.js"></script>
    <title>Memproses Data</title>
</head>

<body>
    <?php
    if (isset($_FILES["fileMentah"]) && $_FILES["fileMentah"]["error"] == 0) {
        echo <<<HEREDOC
        <script>
        function tampilkanToast(teks, warna) {
            switch (warna) {
                case "Success":
                    background = "linear-gradient(to right, #006600, #00ff00)";
                    break;
                case "Info":
                    background = "linear-gradient(to right, #0033cc, #33ccff)";
                    break;
                default:
                    background = "linear-gradient(to right, #000000, #828282)";
                    break;
            }
            Toastify({
                text: teks,
                duration: 5000,
                stopOnFocus: false,
                gravity: "bottom",
                position: "left",
                style: {
                    background: background,
                },
            }).showToast();
        }
        tampilkanToast("Mohon Tunggu, Sedang Upload Data", "Info");
        </script>
        HEREDOC;

        $direktoriUpload = "uploads/";

        $namaFile = uniqid() . '.csv';

        $ekstensiFile = pathinfo($_FILES["fileMentah"]["name"], PATHINFO_EXTENSION);

        $targetLokasi = $direktoriUpload . $namaFile;

        $formatDiperbolehkan = ["csv"];

        $hitungBaris = 0;

        if (in_array(strtolower($ekstensiFile), $formatDiperbolehkan)) {
            if (move_uploaded_file($_FILES["fileMentah"]["tmp_name"], $targetLokasi)) {
                $data = explode("\n", file_get_contents($targetLokasi));
                if (end($data) == "") {
                    array_pop($data);
                }

                echo <<<HEREDOC
                <script>
                tampilkanToast("Upload Berhasil", "Success");
                tampilkanToast("Mohon Tunggu, Sedang Memproses Data", "Info");
                </script>
                HEREDOC;

                foreach (array_slice($data, 1) as $baris) {
                    $dataPecah[$hitungBaris] = explode(",", $baris);

                    $hotspotData[] = [
                        'bujur' => @$dataPecah[$hitungBaris][0],
                        'lintang' => @$dataPecah[$hitungBaris][1],
                        'kepercayaan' => @$dataPecah[$hitungBaris][2],
                        'satelit' => @$dataPecah[$hitungBaris][3],
                        'tanggal' => @$dataPecah[$hitungBaris][6],
                        'waktu' => @$dataPecah[$hitungBaris][7],
                        'kejadian_api' => trim(@$dataPecah[$hitungBaris][8]),
                    ];
                }
                file_put_contents('Hotspot.json', json_encode($hotspotData));

                echo <<<HEREDOC
                <script>
                tampilkanToast("Data Berhasil Diproses", "Success");
                tampilkanToast("Mohon Tunggu, Sedang Memproses Koreksi Data", "Info");
                </script>
                HEREDOC;
            } else {
                $_SESSION['pesan'] = "Gagal mengunggah file.";
                header("Location: index.php");
            }
        } else {
            $_SESSION['pesan'] = "Format file tidak diizinkan. Hanya file dengan format " . implode(", ", $formatDiperbolehkan) . " yang diizinkan.";
            header("Location: index.php");
        }
    } else {
        $_SESSION['pesan'] = "Terjadi kesalahan saat mengunggah file.";
        header("Location: index.php");
    }
    ?>

    <script src="assets/js/proses.js"></script>
</body>

</html>