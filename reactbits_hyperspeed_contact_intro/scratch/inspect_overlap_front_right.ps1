Add-Type -AssemblyName System.Drawing
$frontImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))
$rightImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/RIGHT SIDE.png"))

# Crop right side of FRONT VIEW.png: x = 1200..1672 (width 472)
$cropFrontRight = New-Object System.Drawing.Bitmap 472, 941
$g = [System.Drawing.Graphics]::FromImage($cropFrontRight)
$g.DrawImage($frontImg, (New-Object System.Drawing.Rectangle 0, 0, 472, 941), (New-Object System.Drawing.Rectangle 1200, 0, 472, 941), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$cropFrontRight.Save("scratch/crop_front_right_src.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropFrontRight.Dispose()

# Crop left side of RIGHT SIDE.png: x = 0..500
$cropRightLeft = New-Object System.Drawing.Bitmap 500, 941
$g = [System.Drawing.Graphics]::FromImage($cropRightLeft)
$g.DrawImage($rightImg, (New-Object System.Drawing.Rectangle 0, 0, 500, 941), (New-Object System.Drawing.Rectangle 0, 0, 500, 941), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$cropRightLeft.Save("scratch/crop_right_left_src.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropRightLeft.Dispose()

$frontImg.Dispose()
$rightImg.Dispose()
Write-Host "Done cropping front-right and right-left."
