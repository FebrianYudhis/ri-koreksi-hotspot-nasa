<?php
session_start();
?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <title>Ambil Data NASA</title>
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
                Formulir Pengambilan Data Dari NASA
            </div>
            <div class="card-body">
                <div class="alert alert-info">Data yang Diambil Berasal Dari Tiga Sumber (MODIS_NRT, VIIRS_NOAA20_NRT, VIIRS_SNPP_NRT) Dengan Lokasi Disekitar Kalimantan Tengah</div>
                <form action="ambil-data-nasa.php" method="POST">
                    <div class="input-group mb-3">
                        <span class="input-group-text">Rentang Hari :</span>
                        <select class="form-select" name="rentangHari">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tanggal : (Kosongkan Jika Tidak Perlu)</label>
                        <input type="date" class="form-control" name="tanggalHotspot">
                    </div>
                    <input type="submit" value="Ambil Data" class="btn btn-primary w-100">
                </form>
            </div>
        </div>
    </div>
    <script src="assets/js/sweetalert2.js"></script>
    <script>
        <?php
        if (isset($_SESSION['pesan'])) {
        ?>
            Swal.fire(
                'Error !',
                '<?= $_SESSION['pesan'] ?>',
                'warning'
            )
        <?php
            unset($_SESSION['pesan']);
        }
        ?>
    </script>
</body>

</html>