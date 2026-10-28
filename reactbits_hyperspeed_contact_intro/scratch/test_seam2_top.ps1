Add-Type -AssemblyName System.Drawing

$srcDir = "public/assets"
$frontImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/FRONT VIEW.png"))
$rightImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/RIGHT SIDE.png"))

$bmp = New-Object System.Drawing.Bitmap 600, 500
$g = [System.Drawing.Graphics]::FromImage($bmp)

# Draw FRONT VIEW right edge: crop 1360..1665 (width 305), drawn at 0..305, top y = 0..500
$g.DrawImage($frontImg, (New-Object System.Drawing.Rectangle 0, 0, 305, 500), (New-Object System.Drawing.Rectangle 1360, 0, 305, 500), [System.Drawing.GraphicsUnit]::Pixel)

# Draw RIGHT SIDE starting at 398 (width 295), drawn at 305..600, top y = 0..500
$g.DrawImage($rightImg, (New-Object System.Drawing.Rectangle 305, 0, 295, 500), (New-Object System.Drawing.Rectangle 398, 0, 295, 500), [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()
$bmp.Save("scratch/test_rc_398_top.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()

$frontImg.Dispose()
$rightImg.Dispose()
Write-Host "Saved test_rc_398_top.jpg"
