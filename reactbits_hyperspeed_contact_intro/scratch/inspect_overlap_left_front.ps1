Add-Type -AssemblyName System.Drawing
$leftImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/LEFT SIDE.png"))
$frontImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))

# Crop right side of LEFT SIDE.png: x = 1100..1672
$cropLeftRight = New-Object System.Drawing.Bitmap 572, 941
$g = [System.Drawing.Graphics]::FromImage($cropLeftRight)
$g.DrawImage($leftImg, (New-Object System.Drawing.Rectangle 0, 0, 572, 941), (New-Object System.Drawing.Rectangle 1100, 0, 572, 941), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$cropLeftRight.Save("scratch/crop_left_right.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropLeftRight.Dispose()

# Crop left side of FRONT VIEW.png: x = 0..572
$cropFrontLeft = New-Object System.Drawing.Bitmap 572, 941
$g = [System.Drawing.Graphics]::FromImage($cropFrontLeft)
$g.DrawImage($frontImg, (New-Object System.Drawing.Rectangle 0, 0, 572, 941), (New-Object System.Drawing.Rectangle 0, 0, 572, 941), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$cropFrontLeft.Save("scratch/crop_front_left.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropFrontLeft.Dispose()

$leftImg.Dispose()
$frontImg.Dispose()
Write-Host "Done cropping left-right and front-left."
