Add-Type -AssemblyName System.Drawing

$front = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))

# Crop the left edge of FRONT VIEW: x from 0 to 500, y from 300 to 941
$crop = New-Object System.Drawing.Bitmap 500, 641
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($front, (New-Object System.Drawing.Rectangle 0, 0, 500, 641), (New-Object System.Drawing.Rectangle 0, 300, 500, 641), [System.Drawing.GraphicsUnit]::Pixel)

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Yellow), 1
$font = New-Object System.Drawing.Font "Arial", 9
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Yellow)

for ($x = 0; $x -lt 500; $x += 50) {
    $g.DrawLine($pen, $x, 0, $x, 641)
    $g.DrawString("$x", $font, $brush, $x, 5)
}
for ($y = 0; $y -lt 641; $y += 50) {
    $g.DrawLine($pen, 0, $y, 500, $y)
    $g.DrawString("$(300 + $y)", $font, $brush, 5, $y)
}

$g.Dispose()
$crop.Save("scratch/front_left_edge.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$front.Dispose()
Write-Host "Saved scratch/front_left_edge.jpg"
