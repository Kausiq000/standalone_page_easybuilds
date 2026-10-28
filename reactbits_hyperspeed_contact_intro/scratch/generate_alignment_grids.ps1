Add-Type -AssemblyName System.Drawing

$leftImg  = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/LEFT SIDE.png"))
$frontImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))
$rightImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/RIGHT SIDE.png"))

Write-Host "Left size: $($leftImg.Width)x$($leftImg.Height)"
Write-Host "Front size: $($frontImg.Width)x$($frontImg.Height)"
Write-Host "Right size: $($rightImg.Width)x$($rightImg.Height)"

# Inspect vertical features in FRONT VIEW:
# Where does the fluted wall start on the left?
# Where does the desk end on the right?
# Where does the bookcase end on the right?

# Save a strip with coordinate markings every 50px for FRONT VIEW left (0..400) and right (1200..1672)
$bmpFL = New-Object System.Drawing.Bitmap 400, 300
$gFL = [System.Drawing.Graphics]::FromImage($bmpFL)
$gFL.DrawImage($frontImg, (New-Object System.Drawing.Rectangle 0, 0, 400, 300), (New-Object System.Drawing.Rectangle 0, 300, 400, 300), [System.Drawing.GraphicsUnit]::Pixel)
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Yellow), 1
$font = New-Object System.Drawing.Font ("Arial", 9)
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Yellow)
for ($x = 0; $x -lt 400; $x += 50) {
    $gFL.DrawLine($pen, $x, 0, $x, 300)
    $gFL.DrawString("$x", $font, $brush, [float]($x + 2), 10.0)
}
$bmpFL.Save("scratch/grid_front_left.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmpFL.Dispose()

# Grid for FRONT VIEW right (1200..1672)
$bmpFR = New-Object System.Drawing.Bitmap 472, 300
$gFR = [System.Drawing.Graphics]::FromImage($bmpFR)
$gFR.DrawImage($frontImg, (New-Object System.Drawing.Rectangle 0, 0, 472, 300), (New-Object System.Drawing.Rectangle 1200, 300, 472, 300), [System.Drawing.GraphicsUnit]::Pixel)
for ($x = 0; $x -lt 472; $x += 50) {
    $gFR.DrawLine($pen, $x, 0, $x, 300)
    $gFR.DrawString("$(1200 + $x)", $font, $brush, [float]($x + 2), 10.0)
}
$bmpFR.Save("scratch/grid_front_right.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmpFR.Dispose()

# Grid for LEFT SIDE right (900..1500)
$bmpLR = New-Object System.Drawing.Bitmap 600, 300
$gLR = [System.Drawing.Graphics]::FromImage($bmpLR)
$gLR.DrawImage($leftImg, (New-Object System.Drawing.Rectangle 0, 0, 600, 300), (New-Object System.Drawing.Rectangle 900, 300, 600, 300), [System.Drawing.GraphicsUnit]::Pixel)
for ($x = 0; $x -lt 600; $x += 50) {
    $gLR.DrawLine($pen, $x, 0, $x, 300)
    $gLR.DrawString("$(900 + $x)", $font, $brush, [float]($x + 2), 10.0)
}
$bmpLR.Save("scratch/grid_left_right.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmpLR.Dispose()

# Grid for RIGHT SIDE left (0..600)
$bmpRL = New-Object System.Drawing.Bitmap 600, 300
$gRL = [System.Drawing.Graphics]::FromImage($bmpRL)
$gRL.DrawImage($rightImg, (New-Object System.Drawing.Rectangle 0, 0, 600, 300), (New-Object System.Drawing.Rectangle 0, 300, 600, 300), [System.Drawing.GraphicsUnit]::Pixel)
for ($x = 0; $x -lt 600; $x += 50) {
    $gRL.DrawLine($pen, $x, 0, $x, 300)
    $gRL.DrawString("$x", $font, $brush, [float]($x + 2), 10.0)
}
$bmpRL.Save("scratch/grid_right_left.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmpRL.Dispose()

$pen.Dispose()
$font.Dispose()
$brush.Dispose()
$leftImg.Dispose()
$frontImg.Dispose()
$rightImg.Dispose()
Write-Host "Grids saved."
