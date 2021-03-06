<?php
require_once('base.php');
require_once(getBasePath('lib/functions.php'));
require_once(getBasePath('lib/log_functions.php'));
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8"/>
    <meta name="theme-color" content="#46962b">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Logs</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <link rel="stylesheet" type="text/css" href="../assets/css/styles.css">
    <style>
        .graphCanvas{
            display: flex;
            align-items: baseline;
        }
        .graph{
            background: #46962b;
            width: 10px;
            margin-right: 1px;
        }
    </style>
</head>
<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-12 text-center">
            <h2>Statistiken</h2>
        </div>
        <div class="col-12 text-center mb-3">
            <a href="show.php" class="btn btn-primary btn-sm"><i class="fas fa-images"></i> Zeige die jüngsten Sharepics</a>
        </div>
        <div class="col-6 col-md-6 col-lg-3">
            <dl>
                <dt><i class="fas fa-users"></i> User</dt>
                <dd>
                    <?php
                        $totalDownloads = getDownloads();
                    ?>
                    gesamt: <?php echo number_format(getUsers(), 0, ',', '.'); ?>
                        <br>
                    Logzeit seit <?php echo number_format(getLoggingPeriodInDays(), 0, ',', '.'); ?> Tagen
                        <br>
                    täglich: <?php printf("%d", getDailyUsers()); ?>
                        <br>
                    mit eigenem Logo: <?php echo getUserWithCustomLogo(); ?>
                        <br>
                </dd>
            </dl>
        </div>
        <div class="col-6 col-md-6 col-lg-3">
            <dl>
                <dt><i class="fas fa-download"></i> Downloads</dt>
                <dd>
                    gesamt: <?php echo getDownloads(); ?>
                    <br>
                    täglich: <?php echo getDailyDownloads(); ?>
                    <br>
                    mit Pixabay: <?php echo getPixabay(); ?>
                        (<?php printf('%2d', 100*getPixabay()/$totalDownloads); ?>%)
                    <br>
                    für Social Media: <?php echo number_format(getSocialMedia(), 0, ',', '.'); ?>
                        (<?php printf('%2d', 100*getSocialMedia()/$totalDownloads); ?>%)
                    <br>
                    mit Zusatzbild: <?php echo number_format(getAddPic(), 0, ',', '.'); ?>
                        (<?php printf('%2d', 100*getAddPic()/$totalDownloads); ?>%)
                        <br>
                    mit Störer: <?php echo number_format(getWithEyecatcher(), 0, ',', '.'); ?>
                        (<?php printf('%2d', 100*getWithEyecatcher()/$totalDownloads); ?>%)
                    <br>
                    mit Sternchentext: <?php echo number_format(getAddText(), 0, ',', '.'); ?>
                        (<?php printf('%2d', 100*getAddText()/$totalDownloads); ?>%)
                    <br>
                    mit 3-D-Effekt: <?php echo number_format(getEraser(), 0, ',', '.'); ?>
                        (<?php printf('%2d', 100*getEraser()/$totalDownloads); ?>%)
                </dd>
            </dl>
        </div>
        <div class="col-6 col-md-6 col-lg-3">
            <dl>
                <dt><i class="far fa-time"></i> Zeiten</dt>
                <dd>
                    Median Createtime: <?php echo round(getMedianCreatingTime()/1000, 1); ?>s<br>
                    80% Createtime: <?php echo round(getMedianCreatingTime(80)/1000, 1); ?>s<br>
                    90% Createtime: <?php echo round(getMedianCreatingTime(90)/1000, 1); ?>s<br>
                    Mittel Createtime: <?php echo round(getAvgCreatingTime()/1000, 1); ?>s
                </dd>
                <dd>
                    Median Uploadtime: <?php echo round(getMedianUploadTime()/1000, 1); ?>s<br>
                    80% Uploadtime: <?php echo round(getMedianUploadTime(80)/1000, 1); ?>s<br>

                    Mittel Uploadtime: <?php echo round(getAvgUploadTime()/1000, 1); ?>s
                </dd>
            </dl>
        </div>
        <div class="col-6 col-md-6 col-lg-3">
            <dl>
                <dt><i class="far fa-images"></i> Bildquellen</dt>
                <dd>
                    <ul>
                        <?php showBackgroundSources(); ?>
                    </ul>
                </dd>
            </dl>
        </div>
        <div class="col-6 col-md-6 col-lg-3">
            <dl>
                <dt><i class="fas fa-ruler-combined"></i> Layouts (nur federal)</dt>
                <dd>
                    <ul>
                        <?php showLayouts(); ?>
                    </ul>
                </dd>
            </dl>
        </div>
        <div class="col-6 col-md-6 col-lg-3">
            <dl>
                <dt><i class="fas fa-bullhorn"></i> Social Media</dt>
                <dd>
                    <ul>
                        <?php showSocialMedia(); ?>
                    </ul>
                </dd>
            </dl>
        </div>
        <div class="col-6 col-md-6 col-lg-3">
            <dl>
                <dt><i class="fas fa-sitemap"></i> Mandanten</dt>
                <dd><ul><?php echo showTenants(); ?></ul></dd>
            </dl>
        </div>
     
    </div>
</div>
</body>
</html>
