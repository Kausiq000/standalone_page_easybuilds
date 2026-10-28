Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/easybuilds_office_360.jpg"))

# Crop around seam between Back and Left: x = 200..800, y = 500..1000
$s1 = New-Object System.Drawing.Bitmap 600, 500
$g1 = [System.Drawing.Graphics]::FromImage($s1)
$g1.DrawImage($b, (New-Object System.Drawing.Rectangle 0, 0, 600, 500), (New-Object System.Drawing.Rectangle 200, 500, 600, 500), [System.Drawing.GraphicsUnit]::Pixel)
$g1.Dispose()
$s1.Save("scratch/seam_back_left.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$s1.Dispose()

# Crop around seam between Right and Back: x = 3300..3900, y = 500..1000
$s4 = New-Object System.Drawing.Bitmap 600, 500
$g4 = [System.Drawing.Graphics]::FromImage($s4)
$g4.DrawImage($b, (New-Object System.Drawing.Rectangle 0, 0, 600, 500), (New-Object System.Drawing.Rectangle 3300, 500, 600, 500), [System.Drawing.GraphicsUnit]::Pixel)
$g4.Dispose()
$s4.Save("scratch/seam_right_back.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$s4.Dispose()

$b.Dispose()
Write-Host "Seams 1 & 4 saved."
