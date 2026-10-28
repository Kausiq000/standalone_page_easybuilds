Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))

# Crop around the 4 framed boards and EasyBuilds sign:
# In FRONT VIEW.png (1672x941):
# Wall boards are above the monitors (y in [50..450])
# Left boards: x in [0..400]
# Center sign: x in [400..1200]
# Right boards: x in [1200..1672]

$crop = New-Object System.Drawing.Bitmap 1672, 450
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, 1672, 450), (New-Object System.Drawing.Rectangle 0, 0, 1672, 450), [System.Drawing.GraphicsUnit]::Pixel)

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Yellow), 1
$font = New-Object System.Drawing.Font "Arial", 10
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Yellow)

for ($x = 0; $x -lt 1672; $x += 100) {
    $g.DrawLine($pen, $x, 0, $x, 450)
    $g.DrawString("$x", $font, $brush, $x, 5)
}
for ($y = 0; $y -lt 450; $y += 50) {
    $g.DrawLine($pen, 0, $y, 1672, $y)
    $g.DrawString("$y", $font, $brush, 5, $y)
}

$g.Dispose()
$crop.Save("scratch/boards_inspect.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$img.Dispose()
Write-Host "Saved scratch/boards_inspect.jpg"
