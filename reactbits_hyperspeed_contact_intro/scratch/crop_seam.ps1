Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/easybuilds_office_360.jpg"))
$crop = New-Object System.Drawing.Bitmap 800, 600
$g = [System.Drawing.Graphics]::FromImage($crop)
# Crop x = 300 to 1100, y = 460 to 1060
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, 800, 600), (New-Object System.Drawing.Rectangle 300, 460, 800, 600), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$crop.Save("scratch/pano_seam_back_left.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$img.Dispose()
Write-Host "Saved pano_seam_back_left.jpg"
