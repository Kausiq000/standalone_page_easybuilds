Add-Type -AssemblyName System.Drawing

$pano = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/easybuilds_office_360.jpg"))

# Front view center is at x=2048, y=460.
# Crop x from 1600 to 2400 (width 800), y from 500 to 1200 (height 700)
$cropX = 1600
$cropY = 500
$cropW = 800
$cropH = 700

$crop = New-Object System.Drawing.Bitmap $cropW, $cropH
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($pano, (New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH), (New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$crop.Save("scratch/pano_front_crop_no_laptop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$pano.Dispose()
Write-Host "Saved scratch/pano_front_crop_no_laptop.jpg"
