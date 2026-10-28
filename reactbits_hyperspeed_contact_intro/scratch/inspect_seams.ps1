Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/easybuilds_office_360.jpg"))
Write-Host "Pano size: $($b.Width) x $($b.Height)"

# Crop around seam between Left and Front: x = 1200..1800, y = 460..1400
$s2 = New-Object System.Drawing.Bitmap 600, 500
$g2 = [System.Drawing.Graphics]::FromImage($s2)
$g2.DrawImage($b, (New-Object System.Drawing.Rectangle 0, 0, 600, 500), (New-Object System.Drawing.Rectangle 1200, 500, 600, 500), [System.Drawing.GraphicsUnit]::Pixel)
$g2.Dispose()
$s2.Save("scratch/seam_left_front.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$s2.Dispose()

# Crop around seam between Front and Right: x = 2300..2900, y = 500..1000
$s3 = New-Object System.Drawing.Bitmap 600, 500
$g3 = [System.Drawing.Graphics]::FromImage($s3)
$g3.DrawImage($b, (New-Object System.Drawing.Rectangle 0, 0, 600, 500), (New-Object System.Drawing.Rectangle 2300, 500, 600, 500), [System.Drawing.GraphicsUnit]::Pixel)
$g3.Dispose()
$s3.Save("scratch/seam_front_right.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$s3.Dispose()

$b.Dispose()
Write-Host "Seams saved."
