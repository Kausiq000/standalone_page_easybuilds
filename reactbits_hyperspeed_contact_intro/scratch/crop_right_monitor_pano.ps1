Add-Type -AssemblyName System.Drawing

$pano = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/easybuilds_office_360.jpg"))

# Crop right monitor and desk: x in [2250..2850], y in [700..1400]
$cropX = 2250
$cropY = 700
$cropW = 600
$cropH = 700

$crop = New-Object System.Drawing.Bitmap $cropW, $cropH
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($pano, (New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH), (New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$crop.Save("scratch/pano_right_monitor_solid.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$pano.Dispose()
Write-Host "Saved scratch/pano_right_monitor_solid.jpg"
