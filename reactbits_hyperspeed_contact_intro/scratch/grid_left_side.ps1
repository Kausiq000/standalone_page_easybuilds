Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/LEFT SIDE.png"))
# Draw grid on a crop of LEFT SIDE.png from x: 0..400, y: 0..941
$crop = New-Object System.Drawing.Bitmap 400, 941
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, 400, 941), (New-Object System.Drawing.Rectangle 0, 0, 400, 941), [System.Drawing.GraphicsUnit]::Pixel)

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Yellow), 1
$font = New-Object System.Drawing.Font("Arial", 9)
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Yellow)

for ($y = 0; $y -lt 941; $y += 50) {
    $g.DrawLine($pen, 0, $y, 400, $y)
    $g.DrawString("$y", $font, $brush, 5, $y + 2)
}
for ($x = 0; $x -lt 400; $x += 50) {
    $g.DrawLine($pen, $x, 0, $x, 941)
    $g.DrawString("$x", $font, $brush, $x + 2, 5)
}

$pen.Dispose()
$font.Dispose()
$brush.Dispose()
$g.Dispose()

$crop.Save("scratch/left_side_grid.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$img.Dispose()
Write-Host "Saved left_side_grid.jpg"
