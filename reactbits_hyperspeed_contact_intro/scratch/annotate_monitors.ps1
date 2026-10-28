Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))

# Create an annotated image with coordinate grid
$crop = New-Object System.Drawing.Bitmap 1400, 500
$g = [System.Drawing.Graphics]::FromImage($crop)
# Crop region from FRONT VIEW: x: 136..1536, y: 350..850
$g.DrawImage($b, (New-Object System.Drawing.Rectangle 0, 0, 1400, 500), (New-Object System.Drawing.Rectangle 136, 350, 1400, 500), [System.Drawing.GraphicsUnit]::Pixel)

# Draw grid lines every 100px with labels
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(180, 255, 255, 0)), 1
$font = New-Object System.Drawing.Font "Arial", 10
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Yellow)

for ($x = 0; $x -lt 1400; $x += 100) {
    $srcX = $x + 136
    $g.DrawLine($pen, $x, 0, $x, 500)
    $g.DrawString("$srcX", $font, $brush, [float]($x + 2), 5.0)
}
for ($y = 0; $y -lt 500; $y += 50) {
    $srcY = $y + 350
    $g.DrawLine($pen, 0, $y, 1400, $y)
    $g.DrawString("$srcY", $font, $brush, 5.0, [float]($y + 2))
}

$pen.Dispose()
$font.Dispose()
$brush.Dispose()
$g.Dispose()

$crop.Save("scratch/monitors_grid.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$b.Dispose()
Write-Host "Annotated grid saved."
